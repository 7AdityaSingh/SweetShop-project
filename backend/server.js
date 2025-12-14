const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

require("./db.js");

const authRoutes = require("./auth.js");
const sweetRoutes = require("./sweets.js");

app.use("/auth", authRoutes);
app.use("/sweets", sweetRoutes);

app.get("/", (req, res) => {
  res.send("Sweet Shop API is running");
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR STACK:", err);
  res.status(500).json({ error: err.message });
});

const PORT = 3000;

if (require.main === module) {
  app.listen(5000, () => {
    console.log(`Server running on http://localhost:5000`);
  });
}

module.exports = app;
