const mongoose = require("mongoose");
const validator = require("validator");

const addressSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["billing", "shipping"],
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    street: {
      type: String,
      required: [true, "La dirección es requerida"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "La ciudad es requerida"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "El estado es requerido"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "El país es requerido"],
      trim: true,
    },
    zipCode: {
      type: String,
      required: [true, "El código postal es requerido"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        message: "Por favor ingrese un email válido",
      },
    },
    password: {
      type: String,
      required: [true, "La contraseña es requerida"],
      select: true,
    },
    profile: {
      firstName: {
        type: String,
        required: [true, "El nombre es requerido"],
        trim: true,
      },
      lastName: {
        type: String,
        required: [true, "El apellido es requerido"],
        trim: true,
      },
      avatar: {
        type: String,
        default: "",
      },
    },
    role: { type: String, default: "customer" },
    addresses: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    cart: {
      items: {
        type: [
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
            variants: [
              {
                name: String,
                value: String,
              },
            ],
          },
        ],
        default: [],
      },
      updatedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  Address: mongoose.model("Address", addressSchema),
  User: mongoose.model("User", userSchema),
};
