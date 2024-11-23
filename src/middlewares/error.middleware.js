// Middleware para manejar errores
const errorMiddleware = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Si el error no tiene un statusCode, se asume un error interno del servidor
  statusCode = statusCode || 500;
  message = message || "Error interno del servidor";

  // Solo muestra el stack en desarrollo
  const response = {
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;