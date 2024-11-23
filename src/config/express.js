const express = require("express");
const { json, urlencoded } = require("express");
const cors = require("cors");

// Configuración de la aplicación
const errorMiddleware = require("../middlewares/error.middleware");
const { NODE_ENV } = require("./env");

// Rutas
const authRoutes = require("../routes/auth.routes");

const configureExpressApp = () => {
  // Inicializar Express
  const app = express();

  // Middlewares de seguridad y utilidad
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Registro de rutas
  app.use("/api/auth", authRoutes);

  // Middleware para manejar errores
  app.use(errorMiddleware);

  // Manejo de rutas no definidas
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: "Ruta no encontrada",
    });
  });

  return app;
};

module.exports = configureExpressApp;