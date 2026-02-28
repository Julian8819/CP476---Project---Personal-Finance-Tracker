const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([]);
});

router.post("/", (req, res) => {
  res.json({ message: "Create transaction stub" });
});

router.put("/:id", (req, res) => {
  res.json({ message: "Update transaction stub" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Delete transaction stub" });
});

module.exports = router;
