const express = require("express");
require("dotenv").config();
const bot = require("./core.js");


const cors = require("cors");

const userRouter = require("./routes/user.routes");
const webAppRouter = require("./routes/webApp.routes");

const PORT = 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use("/v1/api/", userRouter);
app.use("/v1/api/", webAppRouter);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});

// Catch any unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Application specific logging, throwing an error, or other logic here
});

// Catch any uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // It's recommended to gracefully shutdown the server here
  process.exit(1); // Exiting the process as uncaught exceptions are usually fatal
});

// Start the server inside a try-catch block to catch any synchronous errors during startup
try {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
} catch (e) {
  console.error('Error during server startup:', e);
}
