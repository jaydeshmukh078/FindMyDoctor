const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const authRoutes = require("./Routes/authRoutes");
const doctorRoutes = require("./Routes/doctorRoutes");
const appointmentRoutes = require("./Routes/appointmentRoutes");
const bookingRoutes = require("./Routes/bookingRoutes");


// Load env vars
dotenv.config();

// App init
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB Connect
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("Find My Doctor API is running...");
});

// 👉 AUTH ROUTES USE KARO:
app.use("/auth", authRoutes);
app.use("/doctors", doctorRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/bookings", bookingRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});