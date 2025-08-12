const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
email: { type: String, required: true, index: true },
otpHash: { type: String, required: true },
expiresAt: { type: Date, required: true },
used: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-delete after expiresAt
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);