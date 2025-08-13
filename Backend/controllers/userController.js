const User = require("../models/User");
const OTP = require("../models/Otpmodel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// ----- Watchlist -----
const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, watchlist: user.watchlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addToWatchlist = async (req, res) => {
    try {
        const { movie } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (user.watchlist.some(m => m.id === movie.id)) {
            return res.status(400).json({ success: false, message: "Movie already in watchlist" });
        }

        user.watchlist.push(movie);
        await user.save();
        res.json({ success: true, watchlist: user.watchlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const removeFromWatchlist = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const initialLength = user.watchlist.length;
        user.watchlist = user.watchlist.filter(m => String(m.id) !== String(movieId));

        if (user.watchlist.length === initialLength) {
            return res.status(404).json({ success: false, message: "Movie not found in watchlist" });
        }

        await user.save();
        res.json({ success: true, watchlist: user.watchlist });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ----- Favourites -----
const getFavourites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, favourites: user.favourites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const addToFavourites = async (req, res) => {
    try {
        const { movie } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.favourites.some(m => m.id === movie.id)) {
            user.favourites.push(movie);
            await user.save();
        }

        res.json({ success: true, favourites: user.favourites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const removeFromFavourites = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.favourites = user.favourites.filter(m => String(m.id) !== String(movieId));
        await user.save();

        res.json({ success: true, favourites: user.favourites });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ----- Profile -----
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email uid");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                uid: user.uid,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Name cannot be empty" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name: name.trim() },
            { new: true, runValidators: true }
        ).select("name email _id");

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                uid: user._id.toString(),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ----- Change Password -----
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.user?.id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (confirmPassword !== undefined && newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('changePassword error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// ----- Send OTP for Password Reset -----
const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.create({ email, otpHash, expiresAt, used: false });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
        });

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ----- Reset Password with OTP -----
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const otpRecord = await OTP.findOne({ email, used: false });
        if (!otpRecord) return res.status(400).json({ message: "OTP not found or already used" });

        const isValid = await bcrypt.compare(otp, otpRecord.otpHash);
        if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

        if (otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

        otpRecord.used = true;
        await otpRecord.save();

        res.json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // Find OTP entry for the email that hasn't been used yet
        const otpEntry = await OTP.findOne({ email, used: false });
        if (!otpEntry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Check expiration
        if (otpEntry.expiresAt < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Compare entered OTP with hashed OTP in DB
        const isMatch = await bcrypt.compare(otp, otpEntry.otpHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Mark as used (or delete if you prefer)
        otpEntry.used = true;
        await otpEntry.save();

        // Optional: Mark user as verified
        await User.updateOne({ email }, { $set: { isVerified: true } });

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getFavourites,
    addToFavourites,
    removeFromFavourites,
    getProfile,
    updateProfile,
    changePassword,
    sendResetOtp,
    resetPassword,
    verifyOTP,


};
