const express = require("express");
const { json, urlencoded } = require("express");
const cors = require("cors");

// Configuración de la aplicación
const errorMiddleware = require("../middlewares/error.middleware");
const { NODE_ENV } = require("./env");

// Rutas
const authRoutes = require("../routes/auth.routes");
const userRoutes = require("../routes/user.routes");
const categoryRoutes = require("../routes/category.routes");
const productRoutes = require("../routes/product.routes");
const cartRoutes = require("../routes/cart.routes");
const orderRoutes = require("../routes/order.routes");

const configureExpressApp = () => {
  // Inicializar Express
  const app = express();

  app.use(cors());
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE"],
      allowedHeaders: ["Authorization", "Content-Type"],
    })
  );
  app.use(json());
  app.use(urlencoded({ extended: true }));

  // Registro de rutas
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/productos", productRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);

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
