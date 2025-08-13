const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
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
    verifyOTP
} = require("../controllers/userController");

// All routes below require a valid token
router.get("/watchlist", authMiddleware, getWatchlist);
router.post("/watchlist", authMiddleware, addToWatchlist);
router.delete("/watchlist/:movieId", authMiddleware, removeFromWatchlist);

router.get("/favourites", authMiddleware, getFavourites);
router.post("/favourites", authMiddleware, addToFavourites);
router.delete("/favourites/:movieId", authMiddleware, removeFromFavourites);

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

router.put("/change-password", authMiddleware, changePassword);
router.post("/send-reset-otp", sendResetOtp); // request OTP
router.post("/reset-password", resetPassword); // submit OTP + new password
router.post('/verify-otp', verifyOTP);


module.exports = router;
