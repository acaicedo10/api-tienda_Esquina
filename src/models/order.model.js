const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        variants: [
          {
            name: String,
            value: String,
            surcharge: Number,
          },
        ],
      },
    ],
    summary: {
      type: Number,
      required: true,
    },
    shipping: {
      address: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    payment: {
      method: {
        type: String,
        enum: ["credit_card", "paypal", "transfer"],
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "processed", "failed", "refunded"],
        default: "pending",
      },
      transactionId: String,
      paidAt: Date,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
