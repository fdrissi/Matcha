const express = require("express");
const router = express.Router();
const userModel = require("../models/User");
var path = require("path");

// @route   GET api/auth
// @desc    Auth Route
// @access  Public
router.get("/activation/:token", async (req, res) => {
  const { token } = req.params;
  if (await userModel.checkActivation(token)) {
    console.log("is not verivied");
  } else {
    console.log("false token");
  }
});

module.exports = router;
