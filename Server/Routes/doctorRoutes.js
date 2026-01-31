const express = require("express");
const Doctor = require("../models/Doctor");
const auth = require("../Middleware/auth");

const router = express.Router();

/* --------------------------------------------------
   HELPER: Doctor Normalizer
   (frontend compatibility layer)
-------------------------------------------------- */
const normalizeDoctor = (doc) => {
  if (!doc) return null;

  return {
    id: doc._id,
    _id: doc._id,

    // basic
    name: doc.name,
    speciality: doc.specialization,      // 🔑 frontend uses this
    specialization: doc.specialization,
    hospital: doc.location,               // 🔑 frontend uses this
    location: doc.location,

    // money / experience
    fee: `₹${doc.fees}`,                  // 🔑 frontend fallback
    fees: doc.fees,
    experience: `${doc.experience} yrs`,

    // ratings
    rating: doc.ratingAverage,
    ratingAverage: doc.ratingAverage,

    // profile
    about: doc.about,
    image: doc.imageUrl,
    imageUrl: doc.imageUrl,

    // flags
    online: true,                          // default (can enhance later)

    // slots (VERY IMPORTANT)
    availability: doc.availableSlots
      ? doc.availableSlots.flatMap(d =>
          d.slots.map(t => `${d.date} ${t}`)
        )
      : [],

    availableSlots: doc.availableSlots,

    // clinic
    contactNumber: doc.contactNumber,
    clinicAddress: doc.clinicAddress,
    timings: doc.timings,

    createdAt: doc.createdAt,
  };
};

/* --------------------------------------------------
   GET /doctors
-------------------------------------------------- */
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

    if (date) {
      doctors = await Doctor.find({
        ...query,
        "availableSlots.date": date,
      });
    } else {
      doctors = await Doctor.find(query);
    }

    // 🔥 NORMALIZE HERE
    const formattedDoctors = doctors.map(normalizeDoctor);

    res.json(formattedDoctors);
  } catch (err) {
    console.error("GET /doctors error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------
   GET /doctors/:id
-------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // 🔥 NORMALIZE SINGLE DOCTOR
    res.json(normalizeDoctor(doctor));
  } catch (err) {
    console.error("GET /doctors/:id error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* --------------------------------------------------
   POST /doctors (admin)
-------------------------------------------------- */
router.post("/", auth, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(normalizeDoctor(doctor));
  } catch (err) {
    console.error("POST /doctors error:", err.message);
    res.status(400).json({ message: "Invalid data", error: err.message });
  }
});

/* --------------------------------------------------
   PUT /doctors/:id
-------------------------------------------------- */
router.put("/:id", auth, async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json(normalizeDoctor(doctor));
  } catch (err) {
    console.error("PUT /doctors/:id error:", err.message);
    res.status(400).json({ message: "Invalid data" });
  }
});

/* --------------------------------------------------
   DELETE /doctors/:id
-------------------------------------------------- */
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
