// public/index.js

const express = require("express");
const bodyParser = require("body-parser");
const transactionRoutes = require("./routes/transactionRoutes.js"); // Ensure correct path

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", transactionRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
