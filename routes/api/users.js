const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/User");
const profileModel = require("../../models/Profile");
const { sendRecovery } = require("../../helpers/emailSender");
const express = require("express");
const router = express.Router();
const key = config.get("keyOrSecret");
const crypto = require("crypto");
const middleware = require("../../middleware/midlleware");
const _ = require("lodash");

const url = config.get("url");

// @route   POST api/users/login
// @desc    Login User
// @access  Public
router.post("/login", [middleware.login], async (req, res) => {
  try {
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

    jwt.sign(payload, key, { expiresIn: expiration }, async (err, token) => {
      if (err) throw err;
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: expiration * 1000
      }); //one hour or 2 weeks
      await userModel.setLastLogin(user.id);
      res.json({ success: true });
    });
  } catch (error) {
    return res.json({ success: false, errorMsg: "Error Occured" });
  }
});

// @route   POST api/users/logout
// @desc    Login User
// @access  Public
router.get("/logout", [middleware.auth], async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false });
  }
});

// @route   POST api/users/register
// @desc    Register User
// @access  Public
router.post("/register", [middleware.register], async (req, res) => {
  try {
    const errors = {
      email: "",
      userName: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: ""
    };
    const user = await userModel.register(req.body, url);
    if (!user) {
      return res.json({
        success: false,
        errorMsg: "Sorry there is a problem with the database",
        errors
      });
    } else {
      res.json({
        success: true,
        SuccessMsg: `We'll send an email to ${req.body.email} In 5 minutes. Open it up to activate your account.`,
        errorMsg: "Register Success",
        errors
      });
    }
  } catch (error) {
    return res.json({ success: false, errorMsg: "Error Occured" });
  }
});

// @route Post api/user/recover
// @desc Recover User
// @access PUBLIC
router.post("/recover", [middleware.recover], async (req, res) => {
  try {
    const { data } = req.body;
    // first of all we have to check if the input is valide
    const result = await userModel.findByUsername(data);
    const respond = await userModel.checkByEamilUsernameValidation(data);
    if (result) {
      if (respond) {
        const token = crypto.randomBytes(64).toString("hex");
        // here we goona seet the token to that user (result = all row of the user get it from the users model)
        const resultFromSr = userModel.setRecovery(result.email, token);
        if (resultFromSr) {
          // here we gonna send the email of the recovery
          if (sendRecovery(result, token, url)) {
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
      const result = await userModel.findByEmail(data);
      if (result) {
        if (respond) {
          // let send the user an email to recover his account
          const token = crypto.randomBytes(64).toString("hex");
          const resultFromSr = userModel.setRecovery(data, token);
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
          errorMsg:
            "Invalid email or username. Please try to resubmit the form."
        });
      }
    }
  } catch (error) {
    return res.json({ success: false, errorMsg: "Error Occured" });
  }
});

// @route POST /api/users/passedit
// @desc Edit password
// @access public
router.post("/passedit", [middleware.passedit], async (req, res) => {
  try {
    // first of all we have to make sure that we already have that token
    const { token, password } = req.body;
    const user = await userModel.findUserByRecovery(token);
    if (user) {
      let hash = bcrypt.hashSync(password, 10);
      const update = await userModel.updatePassword(hash, user.id);
      if (update) {
        // now lets remove that token
        const removeIt = await userModel.setRecovery(user.email, "");
        if (removeIt)
          res.json({
            success: true,
            errorMsg: "Your password has ben updated",
            updated: "done",
            valide: true
          });
        else
          res.json({
            success: false,
            errorMsg: "Problem With Removing The Token"
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
  } catch (error) {
    return res.json({ success: false, errorMsg: "Error Occured" });
  }
});

// @route POST /api/users/checktoken
// @desc checktoken
// @access public
router.get("/checktoken", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ success: false, errorMsg: "Error Occured" });
  }
});

// @route   GET api/users/login
// @desc    Login User
// @access  Public
router.get("/current", [middleware.auth], async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    const profile_info = await profileModel.getUserInfo(req.user.id);
    delete user.password;
    user.info_verified = !!profile_info.info_verified;
    res.json({ success: true, user });
  } catch (error) {
    return res.json({ success: false });
  }
});

// @route   GET api/users/activation
// @desc    activation User
// @access  Public
router.get("/activation", async (req, res) => {
  try {
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
  } catch (error) {
    return res.json({ success: false, errorMsg: "Error Occured" });
  }
});

// @route   POST api/users/updateUser
// @desc    Edit user info (name, email, password...)
// @access  Privet
router.post(
  "/updateUser",
  [middleware.auth, middleware.setting],
  async (req, res) => {
    const errors = {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      newPassword: "",
      oldPassword: "",
      confirmPassword: ""
    };
    const { firstName, lastName, userName, email, newPassword } = req.body;

    try {
      let update = null;
      const user = userModel.findById(req.user.id);
      if (user.first_name !== firstName) {
        update = await userModel.updateFirstName(firstName, req.user.id);
        if (!update)
          return res.json({
            success: false,
            errorMsg: "Error while update user First Name",
            errors
          });
      }

      if (user.last_name !== lastName) {
        update = await userModel.updateLastName(lastName, req.user.id);
        if (!update)
          return res.json({
            success: false,
            errorMsg: "Error while update Last Name",
            errors
          });
      }

      if (newPassword !== "") {
        const hash = bcrypt.hashSync(newPassword, 10);
        update = await userModel.updatePassword(hash, req.user.id);
        if (!update)
          return res.json({
            success: false,
            errorMsg: "Error while update user password",
            errors
          });
      }

      if (user.username !== userName) {
        update = await userModel.updateUsername(userName, req.user.id);
        if (!update)
          return res.json({
            success: false,
            errorMsg: "Error while update Username",
            errors
          });
      }

      if (user.email !== email) {
        update = userModel.updateEmail(email, req.user.id);
        if (!update)
          return res.json({
            success: false,
            errorMsg: "Error while update Email",
            errors
          });
      }

      return res.json({
        success: true,
        errorMsg: "User Info updated successfully",
        errors
      });
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "Error while update user info",
        errors
      });
    }
  }
);

// @route   POST api/users/getTotal
// @desc    GET THE TOTAL OF USERS
// @access  Public
router.get("/getTotal", async (req, res) => {
  const result = await userModel.getTotalUser();
  const { total } = result;
  return res.json({
    total
  });
});

module.exports = router;
