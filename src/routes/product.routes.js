const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// GET all products
router.get('/', productController.getAllProducts);

// // GET product by ID
// router.get('/:id', productController.getProductById);

// GET product by slug
router.get('/:slug', productController.getProductBySlug);

module.exports = router;