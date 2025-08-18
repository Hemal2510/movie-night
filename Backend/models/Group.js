const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  customId: {
    type: String,
    unique: true,
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  profileImage: { type: String, default: "" },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Group", groupSchema);
