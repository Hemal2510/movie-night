const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/authMiddleware");

dotenv.config();
connectDB();

const app = express();

// ✅ Apply CORS BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json()); // to parse JSON bodies

// ✅ Routes after CORS
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/groups", auth, require("./routes/groupRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
