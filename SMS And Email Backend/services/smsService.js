const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendSmsNotification = (mobile, message) => {
  client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: mobile,
  })
  .then((msg) => console.log("SMS sent:", msg.sid))
  .catch((error) => console.error("SMS Error:", error));
};