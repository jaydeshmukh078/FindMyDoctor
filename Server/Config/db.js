const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // MongoDB connect
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } 
  catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1); // Stop server if DB not connected
  }
};

module.exports = connectDB;