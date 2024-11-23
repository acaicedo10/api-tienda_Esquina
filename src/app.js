const configureExpressApp = require("./config/express");
const {connectDatabase} = require("./config/database");
const { PORT } = require("./config/env");

(async () => {
  try {
    // Conectar a la base de datos
    await connectDatabase();

    // Configurar la aplicación de Express
    const app = configureExpressApp();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the application:", error.message);
    process.exit(1); // Finaliza el proceso en caso de error crítico
  }
})();
