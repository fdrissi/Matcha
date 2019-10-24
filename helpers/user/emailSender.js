var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ayoubebelomari@gmail.com",
    pass: "hdhgiitchzayjgfd"
  }
});

const sendActivation = (email, token) => {
  let mailOptions = {
    from: "ayoubebelomari@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    text: `Please Click On This link <a href="http://localhost:5000/user/verification/${token}">Link</a> to activate  your account.`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  sendActivation
};
