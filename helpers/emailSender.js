const nodemailer = require("nodemailer");
const config = require("config");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayoubebelomari@gmail.com",
    pass: "hdhgiitchzayjgfd"
  }
});
const url = config.get("url");

const sendActivation = async (email, userName, token) => {
  console.log(url);
  let mailOptions = {
    from: "ayoubebelomari@gmail.com",
    to: email,
    subject: "Activation Of Your Registration",
    text: `Please Click On This link <a href="http://${url}/activate/${userName}/${token}">Link</a> to activate  your account.`
  };

  await transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const sendRecovery = async (info, token) => {
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
};

module.exports = {
  sendActivation,
  sendRecovery
};
