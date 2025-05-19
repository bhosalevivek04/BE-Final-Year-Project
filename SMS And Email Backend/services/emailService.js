const nodemailer = require("nodemailer");
require("dotenv").config();

exports.sendEmailNotification = (email, message) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Notification Alert",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error("Email Error:", error);
    else console.log("Email sent:", info.response);
  });
};