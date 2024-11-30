// src/controllers/cart.controller.js
const { User } = require("../models/user.model");
const Product = require("../models/product.model");
const ApiResponse = require("../utils/apiResponse");
const { number } = require("joi");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity, variants } = req.body;
    const userId = req.user.id;
    const quantityNumber = Number(quantity);

    // Verificar si el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return ApiResponse.error(res, "Producto no encontrado", 404);
    }

    // Encontrar al usuario
    const user = await User.findById(userId);

    // Verificar si el producto ya está en el carrito
    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Si el producto ya está en el carrito, actualizar cantidad
      user.cart.items[cartItemIndex].quantity += quantityNumber;
    } else {
      // Agregar nuevo producto al carrito
      user.cart.items.push({
        product: productId,
        quantity,
        variants: variants || [],
      });
    }

    // Actualizar timestamp del carrito
    user.cart.updatedAt = new Date();

    // Guardar cambios
    await user.save();

    return ApiResponse.success(res, {}, "Producto agregado al carrito");
  } catch (error) {
    return ApiResponse.error(res, error.message, 400);
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId, variants } = req.body;
    const userId = req.user.id;

    // Encontrar al usuario
    const user = await User.findById(userId);

    // Filtrar el producto del carrito
    user.cart.items = user.cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          JSON.stringify(item.variants) === JSON.stringify(variants)
        )
    );

    // Actualizar timestamp del carrito
    user.cart.updatedAt = new Date();

    // Guardar cambios
    await user.save();

    return ApiResponse.success(res, user.cart, "Producto eliminado del carrito");
  } catch (error) {
    return ApiResponse.error(res, "Error al eliminar producto del carrito");
  }
};

// exports.updateCartItemQuantity = async (req, res) => {
//   try {
//     const { productId, quantity, variants } = req.body;
//     const userId = req.user._id;

//     // Encontrar al usuario
//     const user = await User.findById(userId);

//     // Encontrar el índice del producto en el carrito
//     const cartItemIndex = user.cart.items.findIndex(
//       (item) =>
//         item.product.toString() === productId &&
//         JSON.stringify(item.variants) === JSON.stringify(variants)
//     );

//     if (cartItemIndex === -1) {
//       return ApiResponse.notFound(res, "Producto no encontrado en el carrito");
//     }

//     // Actualizar cantidad
//     if (quantity > 0) {
//       user.cart.items[cartItemIndex].quantity = quantity;
//     } else {
//       // Si la cantidad es 0, eliminar el producto
//       user.cart.items.splice(cartItemIndex, 1);
//     }

//     // Actualizar timestamp del carrito
//     user.cart.updatedAt = new Date();

//     // Guardar cambios
//     await user.save();

//     return ApiResponse.success(
//       res,
//       "Cantidad de producto actualizada",
//       user.cart
//     );
//   } catch (error) {
//     return ApiResponse.error(
//       res,
//       "Error al actualizar cantidad de producto",
//       error
//     );
//   }
// };

exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Encontrar al usuario y popular los productos del carrito
    const user = await User.findById(userId).populate({
      path: "cart.items.product",
      select: "name price images description stock", // Campos que quieres mostrar del producto
    });

    return ApiResponse.success(res, user.cart, "Carrito obtenido");
  } catch (error) {
    return ApiResponse.error(res, "Error al obtener el carrito");
  }
};
