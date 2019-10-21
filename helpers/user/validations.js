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
  console.log(data);
  let errors = {};
  // validate email
  if (typeof data.email !== "undefined") {
    if (isEmpty(data.email)) {
      errors.email = "THIS FIELD IS REQUIRD";
    } else {
      let regex = /\S+@\S+\.\S+/;
      if (!regex.test(data.email)) errors.email = "ENTER VALID EMAIL";
    }
  }
  // validate userName
  if (isEmpty(data.userName)) {
    errors.userName = "THIS FIELD IS REQUIRD";
  } else {
    let regex = /^[A-Za-z]{3,10}$/;
    if (!regex.test(data.userName))
      errors.userName = "USER NAME MUST BE BETWEEN 3 AND 10 CHARACTERS";
  }
  // validate Firstname
  if (isEmpty(data.firstName)) {
    errors.firstName = "THIS FIELD IS REQUIRD";
  }
  // validate lastName
  if (isEmpty(data.lastName)) {
    errors.lastName = "THIS FIELD IS REQUIRD";
  }
  // validate password
  if (isEmpty(data.password)) {
    errors.password = "THIS FIELD IS REQUIRD";
  } else {
    let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[0-9]).{8,20}/i;
    if (!regex.test(data.password))
      errors.password =
        "Password should be between 8-20 characters in length and should include at least one upper case letter, one number or one special character.";
  }
  // validate Confirm_password
  if (isEmpty(data.confirmPassword)) {
    errors.confirmPassword = "THIS FIELD IS REQUIRD";
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
