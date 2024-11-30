const Order = require("../models/order.model");
const Product = require("../models/product.model");
const paypal = require("@paypal/checkout-server-sdk");
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = require("../config/env");
const ApiResponse = require("../utils/apiResponse");
const { User } = require("../models/user.model");

// PayPal Client Setup
const environment = new paypal.core.SandboxEnvironment(
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

class OrderController {
  // Create a new order
  async createOrder(req, res) {
    try {
      const { items, paymentMethod } = req.body;
      const userId = req.user.id;

      // Validate items and calculate total
      let totalSummary = 0;
      const processedItems = await Promise.all(
        items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product ${item.product} no emcontrado.`);
          }

          // Calculate item price with variants
          let itemPrice = 0;
          if (product.price.sale) {
            itemPrice = product.price.sale;
          } else {
            itemPrice = product.price.regular;
          }
          if (item.variants && item.variants.length) {
            item.variants.forEach((variant) => {
              itemPrice += variant.surcharge || 0;
            });
          }

          const totalItemPrice = itemPrice * item.quantity;
          totalSummary += totalItemPrice;

          return {
            product: item.product,
            quantity: item.quantity,
            price: itemPrice,
            variants: item.variants || [],
          };
        })
      );

      // Generate unique order number
      const orderNumber = `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 5)}`;

      // Create order
      const order = new Order({
        orderNumber,
        user: userId,
        items: processedItems,
        summary: totalSummary,
        payment: {
          method: paymentMethod,
        },
      });

      // Save order
      await order.save();

      // If payment method is PayPal, create PayPal order
      if (paymentMethod === "paypal") {
        const paypalOrder = await this.createPayPalOrder(order);
        return ApiResponse.success(res, {
          order,
          paypalOrderId: paypalOrder.id,
        });
      }

      return ApiResponse.success(res, order);
    } catch (error) {
      return ApiResponse.error(res, error.message);
    }
  }

  // Create PayPal Order
  async createPayPalOrder(order) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: order.summary.toFixed(2),
          },
          custom_id: order._id.toString(),
        },
      ],
    });

    try {
      const paypalOrder = await client.execute(request);
      return paypalOrder.result;
    } catch (error) {
      console.error("PayPal order creation error:", error);
      throw error;
    }
  }

  // Capture PayPal Payment
  async capturePayPalPayment(req, res) {
    const { orderID, paypalOrderId } = req.body;
    const userId = req.user.id;

    try {
      // Find the order
      const order = await Order.findById(orderID);
      if (!order || order.user.toString() !== userId.toString()) {
        return ApiResponse.error(res, "Pedido no encontrado.", 404);
      }

      // Capture PayPal payment
      const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
      const capture = await client.execute(request);

      // Update order status
      if (capture.result.status === "COMPLETED") {
        order.payment.status = "processed";
        order.payment.transactionId = capture.result.id;
        order.payment.paidAt = new Date();
        order.status = "processing";

        await order.save();

        const user = await User.findById(userId);
        user.cart.items = []; // Empty the cart items
        user.cart.updatedAt = new Date(); // Update the cart's timestamp
        await user.save();

        order.items.map(async (item) => {
          const product = await Product.findById(item.product);
          if (!product) {
            throw new Error(`Product ${item.product} no emcontrado.`);
          }

          product.stock -= item.quantity; // Reduce the quantity of the purchased product
          if (product.stock <= 0){
            product.status = "outOfStock"
          }

          await product.save();
        });

        return ApiResponse.success(
          res,
          { order, purchase_units: capture },
          "Pago exitoso"
        );
      } else {
        order.payment.status = "failed";
        await order.save();

        return ApiResponse.error(
          res,
          {
            message: "Error al procesar el pago con PayPal:",
            status: capture.result.status,
          },
          400
        );
      }
    } catch (error) {
      ApiResponse.error(res, "Error al procesar el pago con PayPal");
    }
  }

  // Get user's orders
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await Order.find({ user: userId })
        .populate("items.product")
        .sort({ createdAt: -1 });

      ApiResponse.success(res, orders, "Todos tus pedidos");
    } catch (error) {
      ApiResponse.error(res, "Error al todos los pedidos");
    }
  }

  // Get specific order details
  async getOrderDetails(req, res) {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;

      const order = await Order.findOne({
        _id: orderId,
        user: userId,
      })
        .populate("items.product")
        .populate("shipping.address");

      if (!order) {
        return ApiResponse.error(res, "Pedido no encontrado", 404);
      }

      ApiResponse.success(res, "Todos los detalles del pedido");
    } catch (error) {
      ApiResponse.error(res, "Error al obtener detalles del pedido");
    }
  }
}

module.exports = new OrderController();
