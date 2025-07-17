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
    from: `"ParikshaPrep" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for Exam Prep Login",
    text: `Your OTP is: ${otp}\n\nPlease use this OTP to complete your login process.\nStart your journey from today only with us!`,
    html: `<p>Your OTP is: <b>${otp}</b></p><p>Please use this OTP to complete your login process.<br>Start your journey from today only with us!</p>`
  });
};

module.exports = sendOTPEmail;
