const User = require("../models/User");
const OTP = require("../models/Otpmodel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// ----- Watchlist Functions -----
const getWatchlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, watchlist: user.watchlist || [] });
    } catch (err) {
        console.error('getWatchlist error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const addToWatchlist = async (req, res) => {
    try {
        const { movieId, movie } = req.body;  // Accept both for flexibility
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Use movieId if provided, otherwise use movie.id
        const id = movieId || movie?.id;
        if (!id) return res.status(400).json({ success: false, message: "Movie ID required" });

        // Check if movie already exists in watchlist
        if (user.watchlist.some(m => String(m.id) === String(id))) {
            return res.status(400).json({ success: false, message: "Movie already in watchlist" });
        }

        // Add movie to watchlist
        const movieToAdd = movie || { id: movieId };
        user.watchlist.push(movieToAdd);
        await user.save();

        res.json({ success: true, watchlist: user.watchlist, message: "Added to watchlist" });
    } catch (err) {
        console.error('addToWatchlist error:', err);
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
        res.json({ success: true, watchlist: user.watchlist, message: "Removed from watchlist" });
    } catch (err) {
        console.error('removeFromWatchlist error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ----- Favourites Functions -----
const getFavourites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, favourites: user.favourites || [] });
    } catch (err) {
        console.error('getFavourites error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const addToFavourites = async (req, res) => {
    try {
        const { movieId, movie } = req.body;  // Accept both for flexibility
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Use movieId if provided, otherwise use movie.id
        const id = movieId || movie?.id;
        if (!id) return res.status(400).json({ success: false, message: "Movie ID required" });

        // Check if movie already exists in favourites
        if (user.favourites.some(m => String(m.id) === String(id))) {
            return res.status(400).json({ success: false, message: "Movie already in favourites" });
        }

        // Add movie to favourites
        const movieToAdd = movie || { id: movieId };
        user.favourites.push(movieToAdd);
        await user.save();

        res.json({ success: true, favourites: user.favourites, message: "Added to favourites" });
    } catch (err) {
        console.error('addToFavourites error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const removeFromFavourites = async (req, res) => {
    try {
        const { movieId } = req.params;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const initialLength = user.favourites.length;
        user.favourites = user.favourites.filter(m => String(m.id) !== String(movieId));

        if (user.favourites.length === initialLength) {
            return res.status(404).json({ success: false, message: "Movie not found in favourites" });
        }

        await user.save();
        res.json({ success: true, favourites: user.favourites, message: "Removed from favourites" });
    } catch (err) {
        console.error('removeFromFavourites error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ----- Profile Functions -----
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("name email uid");
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                uid: user.uid || user._id.toString(),
            },
        });
    } catch (err) {
        console.error('getProfile error:', err);
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
            message: "Profile updated successfully"
        });
    } catch (err) {
        console.error('updateProfile error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

// ----- Password Change Functions -----
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;  // Match frontend expectations
        const userId = req.user?.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }

        const isSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isSameAsOld) {
            return res.status(400).json({ success: false, message: 'New password cannot be the same as the old password' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('changePassword error:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ----- OTP Functions -----
const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: "User not found with this email" });

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpHash = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);  // 15 minutes expiry

        // Remove any existing OTPs for this email
        await OTP.deleteMany({ email });

        // Create new OTP entry
        await OTP.create({ email, otpHash, expiresAt, used: false });

        // Send email
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
            subject: "Movie Night - Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}\n\nThis OTP is valid for 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #f59e0b;">🍿 Movie Night - Password Reset</h2>
                    <p>Your OTP for password reset is:</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p style="color: #6b7280;">This OTP is valid for 15 minutes.</p>
                    <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                </div>
            `
        });

        res.json({ success: true, message: "OTP sent successfully to your email" });
    } catch (error) {
        console.error('sendResetOtp error:', error);
        res.status(500).json({ success: false, message: "Failed to send OTP. Please try again." });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required" });
        }

        // Find OTP entry for the email that hasn't been used yet
        const otpEntry = await OTP.findOne({ email, used: false });
        if (!otpEntry) {
            return res.status(400).json({ success: false, message: "Invalid OTP or OTP not found" });
        }

        // Check expiration
        if (otpEntry.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpEntry._id }); // Clean up expired OTP
            return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
        }

        // Compare entered OTP with hashed OTP in DB
        const isMatch = await bcrypt.compare(otp, otpEntry.otpHash);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // Don't mark as used yet - save that for the final password change
        res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const changePasswordWithOtp = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: "Email and new password are required" });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
        }

        // Find a valid, unused OTP for this email (we already verified it)
        const otpEntry = await OTP.findOne({ email, used: false });
        if (!otpEntry) {
            return res.status(400).json({ success: false, message: "No valid OTP found. Please verify OTP first." });
        }

        if (otpEntry.expiresAt < new Date()) {
            await OTP.deleteOne({ _id: otpEntry._id }); // Clean up expired OTP
            return res.status(400).json({ success: false, message: "OTP expired. Please request a new one." });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Mark OTP as used and clean up
        await OTP.deleteOne({ _id: otpEntry._id });

        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        console.error('changePasswordWithOtp error:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const deleteProfile = async (req, res) => {
    try {
        // Assuming user ID is available from auth middleware (e.g., req.user.id)
        const userId = req.user.id;

        // Find user by ID and delete from database
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Export all functions
module.exports = {
    // Watchlist
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,

    // Favourites
    getFavourites,
    addToFavourites,
    removeFromFavourites,

    // Profile
    getProfile,
    updateProfile,
    deleteProfile,

    // Password Management
    changePassword,
    sendResetOtp,
    verifyOTP,
    changePasswordWithOtp,
};
