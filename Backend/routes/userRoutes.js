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
} = require("../controllers/userController");

// All routes below require a valid token
router.get("/watchlist", authMiddleware, getWatchlist);
router.post("/watchlist", authMiddleware, addToWatchlist);
router.delete("/watchlist/:movieId", authMiddleware, removeFromWatchlist);

router.get("/favourites", authMiddleware, getFavourites);
router.post("/favourites", authMiddleware, addToFavourites);
router.delete("/favourites/:movieId", authMiddleware, removeFromFavourites);

module.exports = router;
