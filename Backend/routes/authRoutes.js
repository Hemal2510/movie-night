const express = require('express');
const { signup, login, sendOTP, verifyOTP} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);


module.exports = router;
