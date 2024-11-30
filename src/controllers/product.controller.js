const Product = require("../models/product.model");
const Category = require("../models/category.model");
const ApiResponse = require("../utils/apiResponse");

exports.getAllProducts = async (req, res, next) => {
  try {
    // Extract query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build query to filter only published products
    const query = { status: "published" };

    // Optional filtering by category, tags, etc.
    if (req.query.categoria) {
      const category = await Category.findOne({ slug: req.query.categoria });
      if (category) {
        query.categories = category._id;
      } else {
        return ApiResponse.error(res, "Categoría no encontrada", 404);
      }
    }
    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    // Fetch products with pagination
    const products = await Product.find(query)
      .select("-__v") // Exclude version key
      // .skip(skip)
      // .limit(limit)
      .populate("categories", "name"); // Populate category names

    // Count total products
    const totalProducts = await Product.countDocuments(query);

    // Prepare response
    return ApiResponse.success(res, {
      products,
      // pagination: {
      //   currentPage: page,
      //   totalPages: Math.ceil(totalProducts / limit),
      //   totalProducts,
      // },
      totalProducts,
    });
  } catch (error) {
    next(error);
  }
};

// exports.getProductById = async (req, res, next) => {
//   try {
//     const product = await Product.findById(req.params.id)
//       .populate('categories', 'name') // Populate category details
//       .select('-__v'); // Exclude version key

//     if (!product) {
//       return ApiResponse.notFound(res, 'Product not found');
//     }

//     // Check if product is published
//     if (product.status !== 'published') {
//       return ApiResponse.forbidden(res, 'Product is not available');
//     }

//     return ApiResponse.success(res, product);
//   } catch (error) {
//     next(error);
//   }
// };

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("categories", "name")
      .select("-__v"); // Exclude version key

    if (!product) {
      return ApiResponse.error(res, "Producto no encontrado", 404);
    }

    // Check if product is published
    if (product.status !== "published") {
      return ApiResponse.error(res, "Producto no disponible", 403);
    }

    return ApiResponse.success(res, product);
  } catch (error) {
    next(error);
  }
};
