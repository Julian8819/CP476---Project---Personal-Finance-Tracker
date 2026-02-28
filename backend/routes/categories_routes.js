const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { category_ID: 1, category_name: "Salary", type: "income" },
    { category_ID: 2, category_name: "Food", type: "expense" }
  ]);
});

module.exports = router;
