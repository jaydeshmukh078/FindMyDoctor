const express = require("express");
const Doctor = require("../models/Doctor");
const auth = require("../Middleware/auth"); // for protected routes if needed

const router = express.Router();

/*
  GET /doctors
  Query params:
    - specialization
    - location
    - minFees
    - maxFees
    - search  (keyword: name/specialization/location)
    - date    (optional: filter by availability date)
*/

router.get("/", async (req, res) => {
  try {
    const { specialization, location, minFees, maxFees, search, date } = req.query;

    const query = {};

    if (specialization) {
      query.specialization = { $regex: specialization, $options: "i" };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (minFees || maxFees) {
      query.fees = {};
      if (minFees) query.fees.$gte = Number(minFees);
      if (maxFees) query.fees.$lte = Number(maxFees);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    let doctors;

    // If date is given, we also check availableSlots for that date
    if (date) {
      doctors = await Doctor.find({
        ...query,
        "availableSlots.date": date,
      });
    } else {
      doctors = await Doctor.find(query);
    }

    res.json(doctors);
  } catch (err) {
    console.error("GET /doctors error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  GET /doctors/:id
  Single doctor profile
*/
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("GET /doctors/:id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/*
  POST /doctors
  Add new doctor
  (Protected with auth – later tum isko sirf admin ke liye rakh sakte ho)
*/
router.post("/", auth, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    console.error("POST /doctors error:", err.message);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

/*
  PUT /doctors/:id
  Update doctor
*/
router.put("/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("PUT /doctors/:id error:", err.message);
    res.status(400).json({ message: "Invalid data" });
  }
});

/*
  DELETE /doctors/:id
  Delete doctor
*/
router.delete("/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted" });
  } catch (err) {
    console.error("DELETE /doctors/:id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;