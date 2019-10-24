const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/User");
const auth = require("../../middleware/auth");
const {
  validateEmail,
  validatePassword,
  validateInput
} = require("../../helpers/user/validations");
const express = require("express");
const router = express.Router();
const key = config.get("keyOrSecret");

// @route   POST api/users/login
// @desc    Login User
// @access  Public
router.post("/login", [validateEmail, validatePassword], async (req, res) => {
  const { email, password, remember } = req.body;
  const user = await userModel.login(email);
  if (!user) {
    return res.json({ success: false, errorMsg: "Wrong Credentials" });
  }
  const passwordMtach = await bcrypt.compare(password, user.password);
  if (!passwordMtach)
    return res.json({ success: false, errorMsg: "Wrong Credentials" });
  if (!user.verified)
    return res.json({ success: false, errorMsg: "Verify your account" });

  const payload = {
    user: {
      id: user.id
    }
  };

  const expiration = remember ? 3600 * 24 * 14 : 3600;

  jwt.sign(payload, key, { expiresIn: expiration }, (err, token) => {
    if (err) throw err;
    res.cookie("token", token, { httpOnly: true, maxAge: expiration * 1000 }); //one hour or 2 weeks
    res.json({ success: true });
  });
});

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post("/register", async (req, res) => {
  const { errors, isValid } = await validateInput(req.body);
  if (isValid) {
    const user = await userModel.register(req.body);
    if (!user) {
      return res.json({
        success: false,
        errorMsg: "Sorry There is A prb With the database"
      });
    } else {
      res.json({ success: true });
    }
  } else {
    return res.json({ success: false, errors });
  }
});

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.get("/verification/:token", async (req, res) => {
  console.log(req.params.token);
});

// @route   GET api/users/login
// @desc    Login User
// @access  Public
router.get("/current", auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    delete user.password;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.send("Server error");
  }
});

// @route   GET api/users/editsetting
// @desc    Edit user info (name, email, password...)
// @access  Public
router.get("/editinfo", auth, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    delete user.password;
    res.json({ success: true, user });
  } catch (error) {
    res.send("Server error");
  }
});

module.exports = router;
