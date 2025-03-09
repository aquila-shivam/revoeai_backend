const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({ message: "Protected content", userId: req.user.userId });
});

module.exports = router;
