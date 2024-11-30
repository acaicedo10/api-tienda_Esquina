const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');

// Ruta para obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// Ruta para obtener una categoría por su slug
router.get('/:slug', categoryController.getCategoryBySlug);

module.exports = router;