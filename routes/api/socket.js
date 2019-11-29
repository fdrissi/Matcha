const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/midlleware");

// @route   GET /api/socket/online
// @desc    is user online
// @access  Public
router.get("/online", [middleware.auth], async (req, res) => {
  let io = req.app.get("io");
  res.json({ success: true });
});

module.exports = router;
