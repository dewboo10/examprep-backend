const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = (to, otp) => {
  return transporter.sendMail({
    from: `"Exam Prep Arena" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for Exam Prep Login",
    text: `Your OTP is: ${otp}
    Please use this OTP to complete your login process.
    Start your journey from today only with us!`,
  });
};

module.exports = sendOTPEmail;
