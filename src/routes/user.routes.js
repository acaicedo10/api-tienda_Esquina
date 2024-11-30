const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth.middleware");

// Ruta para obtener el perfil del usuario
router.get(
  "/profile",
  auth, // Middleware de autenticación
  userController.getUserProfile
);

module.exports = router;
