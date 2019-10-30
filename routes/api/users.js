const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/User");
const auth = require("../../middleware/auth");
const { sendRecovery } = require("../../helpers/emailSender");

const {
  validateEmail,
  validatePassword,
  validateInput
} = require("../../middleware/validations");
const express = require("express");
const router = express.Router();
const key = config.get("keyOrSecret");
const crypto = require("crypto");

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
      errorMsg: "Sorry there is a problem with the database"
    });
  } else {
    res.json({
      success: true,
      SuccessMsg: `We'll send an email to ${req.body.email} In 5 minutes. Open it up to activate your account.`,
      errorMsg: "Register Success"
    });
  }
});

// @route Post api/user/recover
// @desc Recover User
// @access PUBLIC
router.post("/recover", async (req, res) => {
  // first of all we have to check if the input is valide
  const result = await userModel.findByUsername(req.body.data);
  const respond = await userModel.checkByEamilUsernameValidation(req.body.data);
  if (result) {
    if (respond) {
      const token = crypto.randomBytes(64).toString("hex");
      // here we goona seet the token to that user (result = all row of the user get it from the users model)
      const resultFromSr = userModel.setRecovery(result.email, token);
      if (resultFromSr) {
        // here we gonna send the email of the recovery
        if (sendRecovery(result, token)) {
          return res.json({
            success: true,
            errorMsg:
              "A message has been sent to you by email with instructions on how to reset your password."
          });
        }
      } else {
        // something goes worng
        return res.json({
          success: false,
          errorMsg: "Something goes wrong please lets know"
        });
      }
    } else {
      // the user need to validate his account firest
      return res.json({
        success: false,
        errorMsg: "Please confirme your account first"
      });
    }
  } else {
    const result = await userModel.findByEmail(req.body.data);
    if (result) {
      if (respond) {
        // let send the user an email to recover his account
        const token = crypto.randomBytes(64).toString("hex");
        const resultFromSr = userModel.setRecovery(req.body.data, token);
        if (resultFromSr) {
          // here we gonna send the email of the recovery
          if (sendRecovery(result, token)) {
            return res.json({
              success: true,
              errorMsg:
                "A message has been sent to you by email with instructions on how to reset your password."
            });
          }
        } else {
          // something goes worng
          return res.json({
            success: false,
            errorMsg: "Something goes wrong please lets know"
          });
        }
      } else {
        return res.json({
          success: false,
          errorMsg: "Please confirme your account first"
        });
      }
    } else {
      return res.json({
        success: false,
        errorMsg: "Invalid email or username. Please try to resubmit the form."
      });
    }
  }
});

// @route POST /api/users/passedit
// @desc Recover USER
// @access public
router.post("/passedit", [validateInput], async (req, res) => {
  // first of all we have to make sure that we already have that token
  const { token, password } = req.body;
  const user = await userModel.findUserByRecovery(token);
  if (user) {
    let hash = bcrypt.hashSync(password, 10);
    const update = await userModel.updatePassword(hash, user.id);
    if (update) {
      res.json({
        success: true,
        errorMsg: "Your password has ben updated",
        updated: "done",
        valide: true
      });
    } else {
      res.json({
        success: false,
        errorMsg: "Something goes wrong please lets know"
      });
    }
  } else {
    return res.json({
      success: false,
      errorMsg: "The reset token you have provided is not valid."
    });
  }
});
router.get("/checktoken", async (req, res) => {
  let { token } = req.query;
  // lets make sure its a valide token
  const user = await userModel.findByToken(token);
  if (user) {
    res.json({ success: true, errorMsg: "YES", valide: true });
  } else {
    res.json({
      success: false,
      errorMsg: "The reset token you have provided is not valid",
      valide: false
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
        errorMsg: "Account Already Verified"
      });
    } else {
      // lets work on validing this username
      if (await userModel.ActivateUser(userName, token)) {
        // the token is true
        if (await userModel.updateValidation(userName, token)) {
          // everything works fine
          return res.json({
            success: true,
            errorMsg:
              "Your account has been activated successfully. You can now login."
          });
        } else {
          // something goes wrong
          return res.json({
            success: false,
            errorMsg: "Something goes wrong please let us know"
          });
        }
      } else {
        //the token is not true
        return res.json({
          success: false,
          errorMsg: "Sorry but this is invalide token you entre"
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
