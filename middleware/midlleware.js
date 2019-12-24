const jwt = require("jsonwebtoken");
const config = require("config");
const userModel = require("../models/User");
const profileModel = require("../models/Profile");
const escapeSpecialChars = require("../helpers/escapeSpecialChars");
const bcrypt = require("bcryptjs");
const predefined = require("../routes/globals");
const moment = require("moment");
const Jimp = require("jimp");

async function validateEmail(req) {
  req.body.email = req.body.email.toLowerCase().trim();
  const user = await userModel.findById(req.user.id);
  if (user.email !== req.body.email) {
    if (await userModel.findByEmail(req.body.email))
      return "Email already exists";
    else {
      let regex = /\S+@\S+\.\S+/;
      if (!regex.test(req.body.email) || req.body.email.length > 100)
        return "Enter valid Email";
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
      let regex = /^[a-z0-9]{3,15}$/;
      if (!regex.test(req.body.userName)) return "Enter valid Username";
    }
  }
  return "";
}

function validatePassword(req) {
  let regex = /(?=.*[a-zA-Z])(?=.*[0-9]).{8,30}/i;
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

function arrayContains(needle, arrhaystack) {
  return arrhaystack.indexOf(needle) > -1;
}

function isLatitude(lat) {
  return isFinite(lat) && Math.abs(lat) <= 90;
}

function isLongitude(lng) {
  return isFinite(lng) && Math.abs(lng) <= 180;
}

module.exports = middleware = {
  //auth
  auth: function(req, res, next) {
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
  // login validation
  login: async function(req, res, next) {
    try {
      const { email, password, remember } = req.body;
      if (typeof email !== "string" || typeof password != "string")
        return res.json({ success: false, errorMsg: "Wrong Credentials" });
      if (typeof remember !== "undefined") {
        if (typeof remember !== "boolean")
          return res.json({ success: false, errorMsg: "Wrong Credentials" });
      }
      next();
    } catch (error) {
      return res.json({ success: false, errorMsg: "Wrong Credentials" });
    }
  },
  infoVerified: async function(req, res, next) {
    try {
      const id = req.user.id;
      const result = await profileModel.isInfoVerified(id);
      if (!result)
        return res.json({ success: false, errorMsg: "Verify Profile Info" });
      next();
    } catch (error) {
      return res.json({ success: false, errorMsg: "Verify Profile Info" });
    }
  },
  chat: async function(req, res, next) {
    req.body = escapeSpecialChars(req.body);
    const { sender, receiver, message } = req.body;
    if (
      !sender ||
      !receiver ||
      !message ||
      !message.trim() ||
      message.length > 255 ||
      !(await userModel.findById(receiver))
    )
      return res.json({
        success: false
      });
    next();
  },
  setting: async function(req, res, next) {
    try {
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
      if (
        typeof req.body.firstName !== "string" ||
        typeof req.body.lastName !== "string" ||
        typeof req.body.userName !== "string" ||
        typeof req.body.email !== "string" ||
        typeof req.body.newPassword !== "string" ||
        typeof req.body.oldPassword !== "string"
      )
        return res.json({
          success: false,
          errors,
          errorMsg: "Update User Info Unsuccess"
        });

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
    } catch (error) {
      return res.json({
        success: false,
        errors,
        errorMsg: "Update User Info Unsuccess"
      });
    }
  },
  // For The Recover Input Validation
  recover: async function(req, res, next) {
    try {
      if (typeof req.body.data !== "string") {
        return res.json({
          success: false,
          errorMsg:
            "Invalid email or username. Please try to resubmit the form."
        });
      }
      next();
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "Invalid email or username. Please try to resubmit the form."
      });
    }
  },
  // For THE PASSEDIT (RECOVER) VALIDATION
  passedit: async function(req, res, next) {
    try {
      const errors = {
        password: "",
        confirmPassword: ""
      };
      if (
        typeof req.body.password !== "string" ||
        typeof req.body.confirmPassword !== "string"
      )
        return res.json({
          success: false,
          errors,
          errorMsg: "Please Set Your data correctly"
        });

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
      } else {
        errors.password = "Please Set The password Value";
      }
      // validate Confirm_password
      if (typeof req.body.confirmPassword !== "undefined") {
        if (checkProperties(req.body.confirmPassword)) {
          errors.confirmPassword = "this field is requird";
        } else {
          if (req.body.confirmPassword != req.body.password)
            errors.confirmPassword = "PASSWORDS DO NOT MATCH";
        }
      } else {
        errors.confirmPassword = "Please Set The confirmPassword Value";
      }
      if (!checkProperties(errors))
        return res.json({
          success: false,
          errors,
          errorMsg: "Passwword Error 🤕"
        });
      next();
    } catch (error) {
      return res.json({
        success: false,
        errors,
        errorMsg: "Please Set Your data correctly"
      });
    }
  },
  register: async function(req, res, next) {
    try {
      const errors = {
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
      };

      if (
        typeof req.body.email !== "string" ||
        typeof req.body.userName !== "string" ||
        typeof req.body.firstName !== "string" ||
        typeof req.body.lastName !== "string" ||
        typeof req.body.password !== "string" ||
        typeof req.body.confirmPassword !== "string"
      )
        return res.json({
          success: false,
          errorMsg: "Please Set Your data correctly"
        });
      // validate email
      if (checkProperties(req.body.email.trim())) {
        errors.email = "this field is requird";
      } else {
        req.body.email = req.body.email.toLowerCase().trim();
        if (await userModel.findByEmail(req.body.email)) {
          errors.email = "This email is taken by another user";
        } else {
          let regex = /\S+@\S+\.\S+/;
          if (!regex.test(req.body.email) || req.body.email.length > 100)
            errors.email = "enter valid email";
        }
      }

      // validate userName
      if (checkProperties(req.body.userName.trim())) {
        errors.userName = "this field is requird";
      } else {
        req.body.userName = req.body.userName.toLowerCase().trim();
        if (await userModel.findByUsername(req.body.userName)) {
          errors.userName = "This User Name is taken by another user";
        } else {
          let regex = /^[a-z0-9]{3,15}$/;
          if (!regex.test(req.body.userName))
            errors.userName =
              "user name must be between 3 and 10 characters without special characters";
        }
      }

      // validate Firstname
      if (checkProperties(req.body.firstName.trim())) {
        errors.firstName = "this field is requird";
      } else {
        req.body.firstName = req.body.firstName.trim();
        let regex = /^[A-Za-z]{3,20}$/;
        if (!regex.test(req.body.firstName))
          errors.firstName =
            "name must be between 3 and 20 characters without special characters";
      }

      // validate lastName
      if (checkProperties(req.body.lastName.trim())) {
        errors.lastName = "this field is requird";
      } else {
        req.body.lastName = req.body.lastName.trim();
        let regex = /^[A-Za-z]{3,20}$/;
        if (!regex.test(req.body.lastName))
          errors.lastName =
            "Last name must be between 3 and 20 characters without special characters";
      }

      // validate password
      if (checkProperties(req.body.password)) {
        errors.password = "this field is requird";
      } else {
        // let regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=.*[0-9]).{8,20}/i;
        //let regex = /(?=.*[a-z]).{3,20}/i;
        let regex = /(?=.*[a-zA-Z])(?=.*[0-9]).{8,30}/i;
        if (!regex.test(req.body.password))
          errors.password =
            "password should be between 8-20 characters in length and should include at least one upper case letter, one number or one special character.";
      }

      // validate Confirm_password
      if (checkProperties(req.body.confirmPassword)) {
        errors.confirmPassword = "this field is requird";
      } else {
        if (req.body.confirmPassword != req.body.password)
          errors.confirmPassword = "PASSWORDS DO NOT MATCH";
      }

      if (!checkProperties(errors))
        return res.json({
          success: false,
          errors,
          errorMsg: "Unsuccessful Registration"
        });
      next();
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "Please Set Your data correctly"
      });
    }
  },

  search_filter: async function(req, res, next) {
    try {
      const { filter } = req.query;
      const { age_range, tags, location, fame_rating } = JSON.parse(filter);
      // check age_range Values
      if (typeof filter !== "string") {
        return res.json({
          success: false,
          errorMsg: "Someting Goes Wrong On Setting Data 💩"
        });
      }
      if (
        typeof age_range != "object" ||
        age_range[0] > age_range[1] ||
        typeof age_range[0] != "number" ||
        typeof age_range[1] != "number"
      ) {
        return res.json({
          success: false,
          errorMsg: "Something Goes Wrong On Age Range 💩"
        });
      }
      // check location Values
      if (typeof location != "string" || location.length === 0) {
        return res.json({
          success: false,
          errorMsg: "Please chose A Location 🤔"
        });
      }
      // check fame_rating Values
      if (
        typeof fame_rating != "number" ||
        fame_rating < 1 ||
        fame_rating > 5
      ) {
        return res.json({
          success: false,
          errorMsg: "Something Goes Wrong On fame_rating 💩"
        });
      }
      // check fame_rating Values
      if (typeof tags != "object" || tags.length > 10) {
        return res.json({
          success: false,
          errorMsg: "Something Goes Wrong On tags 💩 no more than 10 tags"
        });
      }
      next();
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "Someting Goes Wrong On Setting Data 💩"
      });
    }
  },

  browse_filter: async function(req, res, next) {
    try {
      const { filter } = req.query;

      if (typeof filter !== "string") {
        return res.json({
          success: false,
          errorMsg: "Someting Goes Wrong On Setting Data 💩"
        });
      }
      const { age_range, location_range, fame_rating } = JSON.parse(filter);
      if (
        typeof age_range !== "object" ||
        typeof location_range !== "number" ||
        typeof fame_rating !== "number"
      )
        return res.json({
          success: false,
          errorMsg: "Someting Goes Wrong On Setting Data 💩"
        });
      // check age_range Values
      if (
        age_range[0] > age_range[1] ||
        typeof age_range[0] != "number" ||
        typeof age_range[1] != "number"
      ) {
        return res.json({
          success: false,
          errorMsg: "Something Goes Wrong On Age Range 💩"
        });
      }
      // check location_range Values
      if (
        typeof location_range != "number" ||
        location_range < 0 ||
        location_range > 5000
      ) {
        return res.json({
          success: false,
          errorMsg: "Something Goes Wrong On location_range 💩"
        });
      }
      // check fame_rating Values
      if (
        typeof fame_rating != "number" ||
        fame_rating < 1 ||
        fame_rating > 5
      ) {
        return res.json({
          success: false,
          errorMsg: "Something Goes Wrong On fame_rating 💩"
        });
      }
      next();
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "Someting Goes Wrong On Setting Data 💩"
      });
    }
  },
  edit_profile: async function(req, res, next) {
    try {
      const errors = {
        current_occupancy: "",
        city: "",
        birth_day: "",
        birth_month: "",
        birth_year: "",
        biography: "",
        relationship: "",
        tags: "",
        birthday: ""
      };
      const { data } = req.body;

      if (typeof data === "undefined") {
        return res.json({
          success: false,
          errorMsg: "You need to Set Data 🤥",
          errors
        });
      }

      if (
        typeof data.user_gender !== "string" ||
        typeof data.user_gender_interest !== "string" ||
        typeof data.user_relationship !== "string" ||
        typeof data.user_current_occupancy !== "string" ||
        typeof data.user_birth_day !== "string" ||
        typeof data.user_birth_month !== "string" ||
        typeof data.user_birth_year !== "string" ||
        typeof data.user_biography !== "string" ||
        typeof data.user_tags !== "object" ||
        typeof data.user_location !== "object"
      )
        return res.json({
          success: false,
          errorMsg: "You need to Set Data",
          errors
        });
      // validate lat and lng
      if (
        !isLatitude(data.user_location.lat) ||
        !isLongitude(data.user_location.lng)
      )
        return res.json({
          success: false,
          errorMsg: "You need to Set Data",
          errors
        });
      // validate user gender
      if (!arrayContains(data.user_gender, ["Female", "Male"])) {
        return res.json({
          success: false,
          errorMsg: "Gender Not Existe 🤥",
          errors
        });
      }
      // check user INTERESTS value
      if (
        !arrayContains(data.user_gender_interest, [
          "Bisexual",
          "Female",
          "Male"
        ])
      ) {
        return res.json({
          success: false,
          errorMsg: "Gender Interest Not Existe 🤥",
          errors
        });
      }
      // check user_relationship value
      if (
        !arrayContains(data.user_relationship, [
          "Single",
          "In a relationship",
          "Engaged",
          "Married"
        ])
      ) {
        errors.relationship = "RelationShip Value Doesn't Exist";
      }

      // check user_current_occupancy value
      if (
        !arrayContains(data.user_current_occupancy, [
          "Student",
          "Employer",
          "None"
        ])
      ) {
        errors.current_occupancy = "Current Occupancy Doesn't Exist";
      }
      // check user_city
      if (data.user_city) {
        const found = predefined[0].some(item => item.value === data.user_city);
        if (!found) {
          errors.city = "The City Name is Not Valide ";
        }
      }

      // Check user Birth values

      if (
        data.user_birth_day ||
        data.user_birth_month ||
        data.user_birth_year
      ) {
        if (
          data.user_birth_day &&
          !data.user_birth_month &&
          data.user_birth_year
        )
          data.user_birth_month = "01";
        if (
          data.user_birth_day &&
          data.user_birth_month &&
          data.user_birth_year
        ) {
          const dateFormat = "DD/MM/YYYY";
          const date = moment(
            `${data.user_birth_day}-${data.user_birth_month}-${data.user_birth_year}`,
            dateFormat
          );
          if (!date.isValid()) {
            errors.birthday = "Not Valide";
          }
          const found = predefined[1].some(
            item => item.value === data.user_birth_month
          );
          if (!found) {
            errors.birth_month = "Month Value Not Existe";
          }
        }
        if (!data.user_birth_day) {
          errors.birth_day = "Require";
        }
        if (!data.user_birth_month) {
          errors.birth_month = "Require";
        }
        if (!data.user_birth_year) {
          errors.birth_year = "Require";
        } else {
          let regex = /^(190[5-9]|19[0-9]\d|200\d|201[0-6])$/;
          if (!regex.test(data.user_birth_year))
            errors.birth_year = "13 is the minimum age";
          errors.birthday = errors.birth_year;
        }
      }
      // validate user Biographie Value
      if (data.user_biography) {
        let regex = /^(?=[\s\S]{15,200}$).*/;
        if (!regex.test(data.user_biography))
          errors.biography =
            "Your biography should be between 15 and 200 character";
      }
      // check user tags valuse
      if (data.user_tags.length > 0) {
        if (data.user_tags.length > 10)
          errors.tags = "Maximum of tags should be 10";
        let regex = /^[a-zA-Z]{3,14}$/;
        data.user_tags.map(function(word) {
          if (!regex.test(word)) {
            errors.tags =
              "Every tag should be between 3 and 14 character without space or ";
          }
        });
      }
      if (!checkProperties(errors))
        return res.json({
          success: false,
          errors,
          errorMsg: "Unsuccessful Update 🤕"
        });
      // check user_birth value
      next();
    } catch (error) {
      return res.json({
        success: false,
        errorMsg: "You need to Set Data 🤥",
        errors
      });
    }
  }
};
