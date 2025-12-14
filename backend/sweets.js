const express = require("express");

const db = require("./db");
const {
  verifyToken,
  verifyAdmin,
} = require("./middleware/auth");

const router = express.Router();

/* =========================
   GET ALL SWEETS (PUBLIC)
   ========================= */
router.get("/", (req, res) => {
  db.all("SELECT * FROM sweets", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Failed to fetch sweets" });
    }
    res.json(rows);
  });
});

/* =========================
   ADD SWEET (ADMIN ONLY)
   ========================= */
router.post("/", verifyToken, verifyAdmin, (req, res) => {
  const { name, category, price, quantity } = req.body;

  if (!name || !category || price == null || quantity == null) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.run(
    "INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)",
    [name, category, price, quantity],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to add sweet" });
      }
      res.json({
        message: "Sweet added successfully",
        id: this.lastID,
      });
    }
  );
});

/* =========================
   UPDATE SWEET (ADMIN ONLY)
   ========================= */
router.put("/:id", verifyToken, verifyAdmin, (req, res) => {
  const { name, category, price, quantity } = req.body;
  const id = req.params.id;

  db.run(
    "UPDATE sweets SET name=?, category=?, price=?, quantity=? WHERE id=?",
    [name, category, price, quantity, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to update sweet" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Sweet not found" });
      }

      res.json({ message: "Sweet updated successfully" });
    }
  );
});

/* =========================
   DELETE SWEET (ADMIN ONLY)
   ========================= */
router.delete("/:id", verifyToken, verifyAdmin, (req, res) => {
  const id = req.params.id;

  db.run(
    "DELETE FROM sweets WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Failed to delete sweet" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Sweet not found" });
      }

      res.json({ message: "Sweet deleted successfully" });
    }
  );
});

/* =========================
   RESTOCK SWEET (ADMIN ONLY)
   ========================= */
router.post("/:id/restock", verifyToken, verifyAdmin, (req, res) => {
  const sweetId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  db.run(
    "UPDATE sweets SET quantity = quantity + ? WHERE id = ?",
    [quantity, sweetId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Restock failed" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Sweet not found" });
      }

      res.json({ message: "Restocked successfully" });
    }
  );
});

/* =========================
   PURCHASE SWEET (LOGIN REQUIRED)
   ========================= */
router.post("/:id/purchase", verifyToken, (req, res) => {
  const sweetId = req.params.id;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  // Step 1: Check available stock
  db.get(
    "SELECT quantity FROM sweets WHERE id = ?",
    [sweetId],
    (err, row) => {
      if (err || !row) {
        return res.status(404).json({ error: "Sweet not found" });
      }

      if (row.quantity < quantity) {
        return res
          .status(400)
          .json({ error: "Not enough stock available" });
      }

      // Step 2: Reduce stock
      db.run(
        "UPDATE sweets SET quantity = quantity - ? WHERE id = ?",
        [quantity, sweetId],
        function (err) {
          if (err) {
            return res.status(500).json({ error: "Purchase failed" });
          }

          res.json({ message: "Purchase successful" });
        }
      );
    }
  );
});

module.exports = router;
