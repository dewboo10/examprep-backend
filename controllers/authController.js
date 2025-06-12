
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const sendOTPEmail = require('../utils/mailer');
const nodemailer = require("nodemailer");
const otpStore = {}; // 🟡 In-memory OTP storage (email -> otp)  


exports.register = async (req, res) => {
  try {
    console.log('Register request:', req.body);

    const { name, email, password } = req.body;
     // ✅ With this improved message 👇

     
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Try logging in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      message: 'User registered',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// In authController.js
// exam-prep-backend/controllers/authController.js
// exam-prep-backend/controllers/authController.js

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const mailOptions = {
      from: `"ExamPrep Arena" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your OTP for ExamsPrepArena",
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to:", email);
    res.json({ message: "OTP sent to your email." });
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP." });
  }
};
// In authController.js
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const stored = otpStore[email];

  if (!stored) {
    return res.status(400).json({ error: 'No OTP sent or expired' });
  }

  if (Date.now() > stored.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ error: 'OTP expired' });
  }

  if (stored.code === otp) {
    delete otpStore[email];
    return res.json({ message: 'OTP verified' });
  } else {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
};


