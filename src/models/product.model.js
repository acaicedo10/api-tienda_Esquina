const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      short: String,
      long: String,
    },
    price: {
      regular: {
        type: Number,
        required: true,
      },
      sale: Number,
      compareAt: Number,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    images: [
      {
        url: String,
        alt: String,
        isMain: Boolean,
      },
    ],
    variants: [
      {
        name: String,
        options: [
          {
            value: String,
            surcharge: { type: Number, default: 0 },
            stock: { type: Number, default: 0 },
          },
        ],
      },
    ],
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "outOfStock", "discontinued"],
      default: "draft",
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
