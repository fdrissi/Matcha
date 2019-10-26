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
router.post("/register", [validateInput], async (req, res) => {
  const user = await userModel.register(req.body);
  if (!user) {
    return res.json({
      success: false,
      errorMsg: "Sorry There is A prb With the database"
    });
  } else {
    res.json({
      success: true,
      SuccessMsg: `We'll send an email to ${req.body.email} in 5 minutes. Open it up to activate your account.`,
      errorMsg: "Register success"
    });
  }
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
    res.send("Server error");
  }
});

// @route   GET api/users/activation
// @desc    activation User
// @access  Public
router.get("/activation", async (req, res) => {
  const { userName, token } = req.query;
  let check = await userModel.checkActivation(userName);
  if (check) {
    // valide username
    if (check.verified) {
      //already verivied
      return res.json({
        success: false,
        errorMsg: "already verified"
      });
    } else {
      // lets work on validing this username
      if (await userModel.ActivateUser(userName, token)) {
        // the token is true
        if (await userModel.updateValidation(userName, token)) {
          // everything works fine
          return res.json({ success: true, errorMsg: "EveryThing Goes Good" });
        } else {
          // something goes wrong
          return res.json({
            success: false,
            errorMsg: "Something Goes Wrong Please Let Us Know"
          });
        }
      } else {
        //the token is not true
        return res.json({
          success: false,
          errorMsg: "Sorry But This is invalide Token you entre"
        });
      }
    }
  } else {
    // invalide username
    return res.json({ success: false, errorMsg: "invalid username" });
  }
});

// @route   GET api/users/editsetting
// @desc    Edit user info (name, email, password...)
// @access  Public
router.get("/updateUser", [auth, validateInput], async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    email,
    oldPassword,
    newPassword
  } = req.data;
  const errors = {
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  };
  try {
    const user = await userModel.findById(req.user.id);
    if (user.email !== email && !userModel.findByEmail(email)) {
      errors.email = "Email already exists";
    } else if (user.email !== email && !userModel.findByEmail(email)) {
    }
    res.json({ success: true, user });
  } catch (error) {
    res.send("Server error");
  }
});

module.exports = router;
