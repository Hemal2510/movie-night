const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
    uid: {
         type: String,
         required:true,
          unique: true,
         },
          watchlist: [
    {
      type: mongoose.Schema.Types.Mixed, // can store object with movieId, title, poster, etc.
    }
  ],
  favourites: [
    {
      type: mongoose.Schema.Types.Mixed,
    }
  ]
}, {
  timestamps: true,
});



module.exports = mongoose.model('User', userSchema);
