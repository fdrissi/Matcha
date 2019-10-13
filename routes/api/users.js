const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/User");
const express = require("express");
const router = express.Router();
const key = config.get("keyOrSecret");

// @route   GET api/users/login
// @desc    Login User
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const user = await userModel.login(email, hash);
  if (!user) {
    return res.status(404).json({ email: "Wrong Credentials" });
  }
  const passwordMtach = await bcrypt.compare(password, user.password);
  if (!passwordMtach)
    return res.status(404).json({ password: "Wrong Credentials" });

  const payload = {
    id: user.id,
    username: user.username,
    fname: user.first_name,
    lname: user.last_name,
    email: user.email
  };

  jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
    res.json({ success: true, token: "Bearer " + token });
  });
});

module.exports = router;
