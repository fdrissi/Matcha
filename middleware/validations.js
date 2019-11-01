const userModel = require("../models/User");

function validateEmail(req, res, next) {
  const errors = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    newPassword: "",
    password: "",
    confirmPassword: ""
  };
  req.body.email = req.body.email.toLowerCase();
  let regex = /\S+@\S+\.\S+/;
  if (!regex.test(req.body.email)) {
    errors.email = "Enter valid Email";
    return res.json({
      success: false,
      errorMsg: "Failed process due to errors",
      errors
    });
  }
  next();
}

function validateUsername(req, res, next) {
  const errors = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    newPassword: "",
    password: "",
    confirmPassword: ""
  };
  req.body.userName = req.body.userName.toLowerCase();
  let regex = /^[a-z0-9]{3,10}$/;
  if (!regex.test(req.body.userName)) {
    errors.userName = "Enter valid Username";
    return res.json({
      success: false,
      errorMsg: "Failed process due to errors",
      errors
    });
  }
  next();
}

function validatePassword(req, res, next) {
  const errors = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    newPassword: "",
    password: "",
    confirmPassword: ""
  };
  let regex = /(?=.*[a-zA-Z])(?=.*[0-9]).{8,}/i;
  if (!regex.test(req.body.newPassword) && req.body.newPassword !== "") {
    errors.newPassword = "Enter valid Password";
    return res.json({
      success: false,
      errorMsg: "Failed process due to errors",
      errors
    });
  }
  next();
}

function validateName(req, res, next) {
  const errors = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    newPassword: "",
    password: "",
    confirmPassword: ""
  };
  let regex = /^[A-Za-z]{3,20}$/;
  if (!regex.test(req.body.lastName) || !regex.test(req.body.firstName)) {
    !regex.test(req.body.lastName)
      ? (errors.lastName = "Enter valid Last Name")
      : (errors.firstName = "Enter valid First Name");
    return res.json({
      success: false,
      errorMsg: "Failed process due to errors",
      errors
    });
  }
  next();
}

function validator(req, res, next) {
  next();
}

// Check it is empty
function checkProperties(obj) {
  for (var key in obj) {
    if (obj[key] !== null && obj[key] != "") return false;
  }
  return true;
}

// For THE REGISTRATION VALIDATION
async function validateInput(req, res, next) {
  const errors = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    newPassword: "",
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

module.exports = {
  validateEmail,
  validateName,
  validatePassword,
  validateUsername,
  validateInput
};
