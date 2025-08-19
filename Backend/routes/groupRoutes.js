const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const User = require("../models/User");

function generateGroupId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters =
    letters.charAt(Math.floor(Math.random() * 26)) +
    letters.charAt(Math.floor(Math.random() * 26));

  const randomNumbers = Math.floor(100 + Math.random() * 900);
  return `GRP-${randomLetters}${randomNumbers}`;
}
router.post("/create", async (req, res) => {
  try {
    const { name, description } = req.body;
    const adminId = req.user.id;

    let customId;
    let exists = true;
    while (exists) {
      customId = generateGroupId();
      exists = await Group.findOne({ customId });
    }
    const group = await Group.create({
      customId,
      name,
      description,
      admin: adminId,
      members: [adminId],
    });
    await group.save();

    await User.findByIdAndUpdate(adminId, { $push: { groups: group._id } });

    res.status(201).json({ message: "Group created", group });
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
});

router.get("/fetch-groups", async (req, res) => {
  try {
    const userId = req.user.id;
    const groups = await Group.find({
      $or: [{ admin: userId }, { members: userId }],
    }).populate("admin", "name email uid");
    //.populate("members", "name email uid");
    res.json({ groups });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching groups", details: err.message });
  }
});

router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json([]);

  try {
    const groups = await Group.find({
      $or: [
        { customId: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).limit(10);
    res.json(groups);
  } catch (err) {
    console.error("Error searching groups:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/join/:groupId", async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.members.includes(userId)) {
      group.members.push(userId);
      await group.save();
      await User.findByIdAndUpdate(userId, { $push: { groups: groupId } });
    }
    res.json({ message: "Joined group", group });
  } catch (error) {
    res.status(500).json({ message: "Error joining group", error });
  }
});

module.exports = router;
