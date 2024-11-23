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

module.exports = {
  registerSchema,
  loginSchema,
};
