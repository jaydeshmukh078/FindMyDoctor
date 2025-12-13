// server/models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,   // optional: if you want you can make it false
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);