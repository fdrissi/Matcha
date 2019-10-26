const userModel = require("../../models/User");

function validatePassword(req, res, next) {
  let regex = /(?=.*[a-z])(?=.*[0-9]).{8,}/i;
  if (!regex.test(req.body.password))
    return res.json({ success: false, errorMsg: "Enter valid password" });
  next();
}

function validateEmail(req, res, next) {
  let regex = /\S+@\S+\.\S+/;
  if (!regex.test(req.body.email))
    return res.json({ success: false, errorMsg: "Enter valid email" });
  next();
}

function validateName(req, res, next) {
  let regex = /^[A-Za-z]{3,}$/;
  if (!regex.test(req.body.lastName || !regex.test(req.body.firstName)))
    return res.json({ success: false, errorMsg: "Enter valid Last Name" });
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
  let errors = {
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  };
  // validate email
  if (typeof req.body.email !== "undefined") {
    if (checkProperties(req.body.email)) {
      errors.email = "this field is requird";
    } else {
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
    if (checkProperties(req.body.userName)) {
      errors.userName = "this field is requird";
    } else {
      if (await userModel.findByUsername(req.body.userName)) {
        errors.userName = "This User Name is taken by another user";
      } else {
        let regex = /^[A-Za-z]{3,10}$/;
        if (!regex.test(req.body.userName))
          errors.userName = "user name must be between 3 and 10 characters";
      }
    }
  }
  // validate Firstname
  if (typeof req.body.firstName !== "undefined") {
    if (checkProperties(req.body.firstName)) {
      errors.firstName = "this field is requird";
    }
  }

  // validate lastName
  if (typeof req.body.lastName !== "undefined") {
    if (checkProperties(req.body.lastName)) {
      errors.lastName = "this field is requird";
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
  validateInput
};
