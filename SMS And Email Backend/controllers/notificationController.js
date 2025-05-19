const { sendEmailNotification } = require("../services/emailService");
const { sendSmsNotification } = require("../services/smsService");

exports.sendNotification = async (req, res) => {
  const { email, mobile, message } = req.body;

  if (!email || !mobile || !message) {
    return res.status(400).json({ error: "Email, mobile number, and message are required." });
  }

  sendEmailNotification(email, message);
  sendSmsNotification(mobile, message);

  res.json({ success: true, message: "Notifications sent successfully." });
};