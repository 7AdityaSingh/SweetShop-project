const express = require("express");
const cors = require("cors");

const app = express();

// 🔹 MIDDLEWARE (MUST BE FIRST)
app.use(cors());
app.use(express.json());

// 🔹 DATABASE INITIALIZATION
require("./db.js");

// 🔹 ROUTES
const authRoutes = require("./auth.js");
const sweetRoutes = require("./sweets.js");

app.use("/auth", authRoutes);
app.use("/sweets", sweetRoutes);

// 🔹 ROOT CHECK (OPTIONAL BUT USEFUL)
app.get("/", (req, res) => {
  res.send("Sweet Shop API is running");
});

// 🔹 GLOBAL ERROR HANDLER (FOR DEBUGGING)
app.use((err, req, res, next) => {
  console.error("🔥 ERROR STACK:", err);
  res.status(500).json({ error: err.message });
});

// 🔹 START SERVER ONLY WHEN NOT TESTING
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// 🔹 EXPORT APP FOR JEST
module.exports = app;
