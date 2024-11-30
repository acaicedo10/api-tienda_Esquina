const { User } = require("../models/user.model");
const ApiResponse = require("../utils/apiResponse");

exports.getUserProfile = async (req, res, next) => {
  try {
    // Obtener el ID del usuario desde el token de autenticación
    const userId = req.user.id;

    // Buscar el usuario por ID y popular las direcciones y el carrito
    const user = await User.findById(userId).populate("addresses").populate({
      path: "cart.items.product",
      select: "name price images description stock", // Selecciona solo los campos necesarios del producto
    });

    // Si no se encuentra el usuario
    if (!user) {
      return ApiResponse.error(res, "Usuario no encontrado", 400);
    }

    // Eliminar campos sensibles antes de enviar
    const userResponse = {
      email: user.email,
      profile: user.profile,
      role: user.role,
      addresses: user.addresses,
      status: user.status,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      cart: user.cart,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Enviar respuesta exitosa
    return ApiResponse.success(res, userResponse);
  } catch (error) {
    next(error);
  }
};
