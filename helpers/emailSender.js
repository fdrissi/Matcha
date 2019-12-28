const nodemailer = require("nodemailer");
const config = require("config");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayoubebelomari@gmail.com",
    pass: "<Gmail App Password>"
  }
});
const url = config.get("url");

const sendActivation = async (email, userName, token) => {
  try {
    let mailOptions = {
      from: "ayoubebelomari@gmail.com",
      to: email,
      subject: "Activation Of Your Registration",
      text: `Please Click On This link <a href="http://${url}/activate/${userName}/${token}">Link</a> to activate  your account.`
    };

    await transporter.sendMail(mailOptions, function(error, info) {});
  } catch (error) {
    return false;
  }
};

const sendRecovery = async (info, token) => {
  try {
    let mailOptions = {
      from: "ayoubebelomari@gmail.com",
      to: info.email,
      subject: "Recovery Email",
      text: `Hi ${info.username} Please Click On This link <a href="http://${url}/editpass/${token}">Link</a> So you can update your account password`
    };

    await transporter.sendMail(mailOptions, function(error) {
      if (error) {
        return false;
      } else {
        return true;
      }
    });
  } catch (error) {
    return false;
  }
};
const sendReport = async (profile, id) => {
  try {
    let mailOptions = {
      from: "ayoubebelomari@gmail.com",
      to: "drissi.toubbali.fadel@gmail.com",
      subject: "Report Email",
      text: `Hi Admin This profile id ${profile} has been reported from this user id ${id}`
    };

    await transporter.sendMail(mailOptions, function(error) {
      if (error) {
        return false;
      } else {
        return true;
      }
    });
  } catch (error) {
    return false;
  }
};

module.exports = {
  sendActivation,
  sendRecovery,
  sendReport
};
