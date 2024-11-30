const Category = require("../models/category.model");
const ApiResponse = require("../utils/apiResponse");

// Obtener todas las categorías
exports.getAllCategories = async (req, res, next) => {
  try {
    // Obtener todas las categorías activas, con población del padre si existe
    const categories = await Category.find({ isActive: true })
      .populate("parent", "name slug")
      .select("name slug description image parent level");

    // Crear una respuesta estructurada
    return ApiResponse.success(res, {
      message: "Categorías obtenidas exitosamente",
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    // Pasar al middleware de manejo de errores
    next(error);
  }
};

// Obtener una categoría específica por su slug
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Buscar la categoría por slug, incluyendo información del padre
    const category = await Category.findOne({
      slug: slug,
      isActive: true,
    }).populate("parent", "name slug");

    // Verificar si la categoría existe
    if (!category) {
      return ApiResponse.error(res, "Categoría no encontrada", 400);
    }

    return ApiResponse.success(res, {
      message: "Categoría obtenida exitosamente",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
