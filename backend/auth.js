const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db.js");

const router = express.Router();
const SECRET = "secret123";


// REGISTER
router.post("/register", (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body missing" });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email or password missing" });
    }

    db.run(
      "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
      [email, password, "user"],
      err => {
        if (err) {
          return res.status(200).json({ message: "User already exists" });
        }
        return res.status(200).json({ message: "Registered" });
      }
    );
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, user) => {
      if (!user) return res.status(401).json({ error: "Invalid" });
      if (password !== user.password)
        return res.status(401).json({ error: "Invalid" });

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
      res.json({ token, role: user.role });
    }
  );
});

module.exports = router;
