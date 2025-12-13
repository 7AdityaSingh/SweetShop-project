const jwt = require("jsonwebtoken");

const SECRET = "secret123"; // same secret used in auth.js

// Verify token middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: "Invalid token format" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = decoded; // { id, role }
    next();
  });
}

// Admin-only middleware
function verifyAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

module.exports = {
  verifyToken,
  verifyAdmin,
};
