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
function isEmpty(obj) {
  return !Object.keys(obj).length > 0;
}

// For THE REGISTRATION VALIDATION
function validateInput(data) {
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
  if (typeof data.email !== "undefined") {
    if (isEmpty(data.email)) {
      errors.email = "this field is requird";
    } else {
      let regex = /\S+@\S+\.\S+/;
      if (!regex.test(data.email)) errors.email = "enter valid email";
    }
  }
  // validate userName
  if (isEmpty(data.userName)) {
    errors.userName = "this field is requird";
  } else {
    let regex = /^[A-Za-z]{3,10}$/;
    if (!regex.test(data.userName))
      errors.userName = "user name must be between 3 and 10 characters";
  }
  // validate Firstname
  if (isEmpty(data.firstName)) {
    errors.firstName = "this field is requird";
  }
  // validate lastName
  if (isEmpty(data.lastName)) {
    errors.lastName = "this field is requird";
  }
  // validate password
  if (isEmpty(data.password)) {
    errors.password = "this field is requird";
  } else {
    let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[0-9]).{8,20}/i;
    if (!regex.test(data.password))
      errors.password =
        "password should be between 8-20 characters in length and should include at least one upper case letter, one number or one special character.";
  }
  // validate Confirm_password
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "this field is requird";
  } else {
    if (data.confirmPassword != data.password)
      errors.confirmPassword = "PASSWORDS DO NOT MATCH";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
}
module.exports = {
  validateEmail,
  validateName,
  validatePassword,
  validateInput
};
