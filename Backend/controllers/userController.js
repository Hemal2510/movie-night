// controllers/userController.js
const User = require("../models/User");

// Get watchlist
const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add to watchlist
const addToWatchlist = async (req, res) => {
  try {
    const { movie } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Prevent duplicates
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
// remove watchlist 


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

// Get favourites
const getFavourites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Add to favourites
const addToFavourites = async (req, res) => {
  try {
    const { movie } = req.body; // { id, title, poster, etc. }
    const user = await User.findById(req.user.id);

    // Prevent duplicates
    if (!user.favourites.some(m => m.id === movie.id)) {
      user.favourites.push(movie);
      await user.save();
    }

    res.json({ success: true, favourites: user.favourites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove from favourites
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

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getFavourites,
  addToFavourites,
  removeFromFavourites
};