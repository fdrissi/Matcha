const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/User");
const auth = require('../../middleware/auth');
const { validateEmail, validatePassword } = require('../../helpers/user/validations');
const express = require("express");
const router = express.Router();
const key = config.get("keyOrSecret");

// @route   POST api/users/login
// @desc    Login User
// @access  Public
router.post("/login", [validateEmail, validatePassword], async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.login(email);
  if (!user) {
    return res.json({ success: false, errorMsg: "Wrong Credentials" });
  }
  const passwordMtach = await bcrypt.compare(password, user.password);
  if (!passwordMtach)
    return res.json({ success: false, errorMsg: "Wrong Credentials" });
  if(!user.verified)
    return res.json({ success: false, errorMsg: "Verify your account" });

  const payload = {
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      email: user.email,
    }
  };

  jwt.sign(payload, key, { expiresIn: 3600 }, (err, token) => {
    if (err) throw err;
    res.json({success: true, token });
  });
});

// @route   GET api/users/login
// @desc    Login User
// @access  Public
router.get('/current', auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    delete user.password;
    res.json({success: true, user});
  } catch (error) {
    console.log(error.message);
    res.send("Server error");
  }
})

module.exports = router;
