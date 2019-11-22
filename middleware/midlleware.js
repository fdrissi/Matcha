const jwt = require("jsonwebtoken");
const config = require("config");
const userModel = require("../models/User");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");
const bcrypt = require("bcryptjs");


async function validateEmail(req) {
    req.body.email = req.body.email.toLowerCase().trim();
    const user = await userModel.findById(req.user.id);
    if (user.email !== req.body.email) {
      if (await userModel.findByEmail(req.body.email))
        return "Email already exists";
      else {
        let regex = /\S+@\S+\.\S+/;
        if (!regex.test(req.body.email)) return "Enter valid Email";
      }
    }
    return "";
  }
  
  async function validateUsername(req) {
    req.body.userName = req.body.userName.toLowerCase().trim();
    const user = await userModel.findById(req.user.id);
    if (user.username !== req.body.userName) {
      if (await userModel.findByUsername(req.body.userName))
        return "Username already exists";
      else {
        let regex = /^[a-z0-9]{3,10}$/;
        if (!regex.test(req.body.userName)) return "Enter valid Username";
      }
    }
    return "";
  }
  
  function validatePassword(req) {
    let regex = /(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/i;
    if (req.body.newPassword !== "") {
      if (!regex.test(req.body.newPassword)) {
        return ["Enter valid Password", "Enter valid Password"];
      } else if (req.body.newPassword !== req.body.confirmPassword)
        return ["", "Password not matche"];
    }
    return ["", ""];
  }
  
  function validateFirstName(req) {
    req.body.firstName = req.body.firstName.trim();
    let firstName = "";
    let regex = /^[A-Za-z]{3,20}$/;
    firstName = !regex.test(req.body.firstName) ? "Enter valid First Name" : "";
    return firstName;
  }
  
  function validateLastName(req) {
    req.body.lastName = req.body.lastName.trim();
    let lastName = "";
    let regex = /^[A-Za-z]{3,20}$/;
    lastName = !regex.test(req.body.lastName) ? "Enter valid Last Name" : "";
    return lastName;
  }

  // Check it is empty
function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] != "") return false;
    }
    return true;
  }
module.exports =   middleware = {
    //auth
    auth: function (req, res, next)  {
        const token = req.cookies.token;
        if (!token) {
          return res.json({ success: false, errorMsg: "Access denied" });
        }
      
        try {
          const decoded = jwt.decode(token, config.get("keyOrSecret"));
          if (Date.now() >= decoded.exp * 1000) {
            res.clearCookie("token");
            return res.json({ success: false, errorMsg: "Access denied" });
          }
          req.user = decoded.user;
          next();
        } catch (error) {
          return res.json({ success: false, errorMsg: "Access denied" });
        }
    },
     async setting(req, res, next) {
        req.body = escapeSpecialChars(req.body);
      
        const errors = {
          firstName: "",
          lastName: "",
          userName: "",
          email: "",
          newPassword: "",
          password: "",
          confirmPassword: ""
        };
      
        const user = await userModel.findById(req.user.id);
        const isMatched = bcrypt.compareSync(req.body.oldPassword, user.password);
        if (!isMatched)
          return res.json({
            success: false,
            errorMsg: "Invalid user password",
            errors
          });
      
        if (typeof req.body.firstName !== "undefined") {
          errors.firstName = validateFirstName(req);
        }
      
        if (typeof req.body.lastName !== "undefined") {
          errors.lastName = validateLastName(req);
        }
      
        if (typeof req.body.userName !== "undefined") {
          errors.userName = await validateUsername(req);
        }
      
        if (typeof req.body.email !== "undefined") {
          errors.email = await validateEmail(req);
        }
      
        if (typeof req.body.newPassword !== "undefined") {
          const [newPassword, confirmPassword] = validatePassword(req);
          errors.newPassword = newPassword;
          errors.confirmPassword = confirmPassword;
        }
      
        if (!checkProperties(errors))
          return res.json({
            success: false,
            errors,
            errorMsg: "Update User Info Unsuccess"
          });
        next();
      },
    logger: function(req, res, next) {
       console.log('Original request hit : '+req.originalUrl);
       next();
    },
    // For THE REGISTRATION VALIDATION
    async  register(req, res, next) {
    const errors = {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: ""
    };
    // validate email
    if (typeof req.body.email !== "undefined") {
      if (checkProperties(req.body.email.trim())) {
        errors.email = "this field is requird";
      } else {
        req.body.email = req.body.email.toLowerCase().trim();
        if (await userModel.findByEmail(req.body.email)) {
          errors.email = "This email is taken by another user";
        } else {
          let regex = /\S+@\S+\.\S+/;
          if (!regex.test(req.body.email)) errors.email = "enter valid email";
        }
      }
    }
    // validate userName
    if (typeof req.body.userName !== "undefined") {
      if (checkProperties(req.body.userName.trim())) {
        errors.userName = "this field is requird";
      } else {
        req.body.userName = req.body.userName.toLowerCase().trim();
        if (await userModel.findByUsername(req.body.userName)) {
          errors.userName = "This User Name is taken by another user";
        } else {
          let regex = /^[a-z0-9]{3,10}$/;
          if (!regex.test(req.body.userName))
            errors.userName =
              "user name must be between 3 and 10 characters without special characters";
        }
      }
    }
    // validate Firstname
    if (typeof req.body.firstName !== "undefined") {
      if (checkProperties(req.body.firstName.trim())) {
        errors.firstName = "this field is requird";
      } else {
        req.body.firstName = req.body.firstName.trim();
        let regex = /^[A-Za-z]{3,20}$/;
        if (!regex.test(req.body.firstName))
          errors.firstName =
            "name must be between 3 and 20 characters without special characters";
      }
    }
  
    // validate lastName
    if (typeof req.body.lastName !== "undefined") {
      if (checkProperties(req.body.lastName.trim())) {
        errors.lastName = "this field is requird";
      } else {
        req.body.lastName = req.body.lastName.trim();
        let regex = /^[A-Za-z]{3,20}$/;
        if (!regex.test(req.body.lastName))
          errors.lastName =
            "Last name must be between 3 and 20 characters without special characters";
      }
    }
    // validate password
    if (typeof req.body.password !== "undefined") {
      if (checkProperties(req.body.password)) {
        errors.password = "this field is requird";
      } else {
        // let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[0-9]).{8,20}/i;
        let regex = /(?=.*[a-z]).{3,20}/i;
        if (!regex.test(req.body.password))
          errors.password =
            "password should be between 8-20 characters in length and should include at least one upper case letter, one number or one special character.";
      }
    }
    // validate Confirm_password
    if (typeof req.body.confirmPassword !== "undefined") {
      if (checkProperties(req.body.confirmPassword)) {
        errors.confirmPassword = "this field is requird";
      } else {
        if (req.body.confirmPassword != req.body.password)
          errors.confirmPassword = "PASSWORDS DO NOT MATCH";
      }
    }
    if (!checkProperties(errors))
      return res.json({ success: false, errors, errorMsg: "Register unsuccess" });
    next();
  }
}