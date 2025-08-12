const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OTP = require('../models/Otpmodel');
const generateOTP = require('../utils/generateOTP');
const sendEmail = require('../utils/sendEmail');


// Helper function to generate UID in format #AB12CD6

function generateUID() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = () => numbers[Math.floor(Math.random() * numbers.length)];

  return (
    randomLetter() + randomLetter() +  // 2 letters
    randomNumber() + randomNumber() +  // 2 numbers
    randomLetter() + randomLetter() +  // 2 letters
    randomNumber()                     // 1 number
  );
}


const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique UID
    let uid;
    let uidExists = true;
    while (uidExists) {
      uid = generateUID();
      const existingUID = await User.findOne({ uid });
      if (!existingUID) uidExists = false;
    }

    // Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      uid
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: newUser._id, name: newUser.name, email: newUser.email, uid: newUser.uid }
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Signup failed", error: err.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("🔍 Stored hash in DB:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, uid: user.uid }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};




// Send OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 2️⃣ Generate and save OTP
    const code = generateOTP();
    const otpHash = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    await OTP.create({ email, otpHash, expiresAt, used: false });

    // 3️⃣ Send OTP via email
    await sendEmail(
      email,
      "Your Movie Night OTP Code",
      `Your OTP code is: ${code}`
    );

    res.status(200).json({
      success: true,
      message: "OTP generated and sent to your email.",
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to generate OTP",
      error: err.message,
    });
  }
};



const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // 1️⃣ Fetch the latest unused OTP for this email
    const otpRecord = await OTP.findOne({
      email,
      used: false,
      expiresAt: { $gt: new Date() }, // still valid
    }).sort({ createdAt: -1 }); // latest OTP first

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }

    // 2️⃣ Always compare as strings (avoid type issues)
    const isMatch = await bcrypt.compare(String(otp).trim(), otpRecord.otpHash);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // 3️⃣ Mark OTP as used
    otpRecord.used = true;
    await otpRecord.save();

    res.status(200).json({ success: true, message: "OTP verified successfully" });

  } catch (err) {
    console.error("OTP Verification Error:", err);
    res.status(500).json({ success: false, message: "OTP verification failed", error: err.message });
  }
};


module.exports = { signup, login, sendOTP, verifyOTP};
