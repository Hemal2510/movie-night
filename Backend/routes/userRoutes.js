const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Import all controller functions
const {
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

    // Password Management
    changePassword,
    sendResetOtp,
    verifyOTP,
    changePasswordWithOtp,
} = require("../controllers/userController");

// =====================================================
//                  WATCHLIST ROUTES
// =====================================================
router.get("/watchlist", authMiddleware, getWatchlist);
router.post("/watchlist", authMiddleware, addToWatchlist);
router.delete("/watchlist/:movieId", authMiddleware, removeFromWatchlist);

// =====================================================
//                  FAVOURITES ROUTES
// =====================================================
router.get("/favourites", authMiddleware, getFavourites);
router.post("/favourites", authMiddleware, addToFavourites);
router.delete("/favourites/:movieId", authMiddleware, removeFromFavourites);

// =====================================================
//                   PROFILE ROUTES
// =====================================================
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// =====================================================
//              PASSWORD MANAGEMENT ROUTES
// =====================================================

// Change password using current password (requires authentication)
router.put("/change-password", authMiddleware, changePassword);

// Password reset flow (no authentication required)
router.post("/send-reset-otp", sendResetOtp);           // Step 1: Send OTP to email
router.post("/verify-reset-otp", verifyOTP);            // Step 2: Verify OTP code
router.post("/reset-password", changePasswordWithOtp); // Step 3: Set new password

// =====================================================
//                    EXPORT ROUTER
// =====================================================
module.exports = router;
