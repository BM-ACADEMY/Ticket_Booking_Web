require('dotenv').config();
const nodemailer = require("nodemailer");



const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP connection failed:", error);
  } else {
    console.log("SMTP connection successful");
  }
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Pegasus Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error("Mail sending failed:", err);
    throw err;
  }
};

module.exports = sendMail;