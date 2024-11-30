const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.empty": "Es obligatorio que ingrese un correo electrónico.",
    "string.email": "El correo electrónico debe tener un formato válido.",
    "any.required": "El correo electrónico es requerido.",
    "string.base": "El correo electrónico debe ser una cadena de texto.",
  }),
  password: Joi.string().trim().required().messages({
    "string.empty": "Es obligatorio que ingrese una contraseña.",
    "any.required": "La contraseña es requerida.",
    "string.base": "La contraseña debe ser una cadena de texto.",
  }),
  firstName: Joi.string().trim().required().messages({
    "string.empty": "Es obligatorio que ingrese un nombre.",
    "any.required": "El nombre es requerido.",
    "string.base": "El nombre debe ser una cadena de texto.",
  }),
  lastName: Joi.string().trim().required().messages({
    "string.empty": "Es obligatorio que ingrese un apellido.",
    "any.required": "El apellido es requerido.",
    "string.base": "El apellido debe ser una cadena de texto.",
  }),
  avatar: Joi.string().trim().messages({
    "string.empty": "El avatar no puede estar vacío.",
    "string.base": "El avatar debe ser una cadena de texto.",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required().messages({
    "string.empty": "Es obligatorio que ingrese un correo electrónico.",
    "string.email": "El correo electrónico debe tener un formato válido.",
    "any.required": "El correo electrónico es requerido.",
    "string.base": "El correo electrónico debe ser una cadena de texto.",
  }),
  password: Joi.string().trim().required().messages({
    "string.empty": "Es obligatorio que ingrese una contraseña.",
    "any.required": "La contraseña es requerida.",
    "string.base": "La contraseña debe ser una cadena de texto.",
  }),
});

const veryfyEmailSchema = Joi.object({
  token: Joi.string().trim().required().max(6).min(6).messages({
    "string.empty": "Es obligatorio que ingrese el codigo.",
    "any.required": "El codigo es requerido.",
    "string.base": "El codigo debe ser una cadena de texto.",
    "string.min": "El codigo debe tener 6 caracteres.",
    "string.max": "El codigo debe tener 6 caracteres.",
  }),
});

const cartSchema = Joi.object({
  productId: Joi.string().required().messages({
    "any.required": "El producto es requerido.",
    "string.base": "El producto debe ser una cadena de texto.",
  }),
  quantity: Joi.number().min(1).required().messages({
    "number.base": "La cantidad debe ser un número.",
    "number.min": "Debes agregar al menos un producto.",
    "any.required": "Debes agregar un producto.",
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
  veryfyEmailSchema,
  cartSchema,
};
