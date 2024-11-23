const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
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
    avatar: String,
  },
  role: { type: String, default: "customer" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
