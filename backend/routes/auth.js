const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");

const handleError = (res, err, message = "Server error") => {
  if (err.code === 11000) {
    res.status(400).json({ message: "Username or email already exists" });
  } else {
    res.status(500).json({ message, details: err.message });
  }
};

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
    );
    res.status(201).json({ message: "User registered successfully", token, email: user.email, role: user.role });
  } catch (err) {
    handleError(res, err, "Error during registration");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token, email: user.email, role: user.role });
  } catch (err) {
    handleError(res, err, "Error during login");
  }
});

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err, "Error fetching profile");
  }
});

router.put("/address", auth, async (req, res) => {
  try {
    const { name, phone, city, district, ward, specificAddress } = req.body;

    const addressFields = { name, phone, city, district, ward, specificAddress };
    const hasAddressChanges = Object.values(addressFields).some((value) => value);

    if (hasAddressChanges) {
      if (!name || !phone || !city || !district || !ward || !specificAddress) {
        return res.status(400).json({ message: "All address fields are required if updating address" });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.address = { name, phone, city, district, ward, specificAddress };
      await user.save();

      res.status(200).json({ message: "Address updated successfully", address: user.address });
    } else {
      res.status(200).json({ message: "No address changes provided" });
    }
  } catch (err) {
    handleError(res, err, "Error updating address");
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;
    const updates = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (gender) updates.gender = gender;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User information is missing" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated",
      user: { username: user.username, email: user.email, gender: user.gender },
    });
  } catch (err) {
    handleError(res, err, "Error updating profile");
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email gender");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    handleError(res, err, "Error fetching user details");
  }
});

module.exports = router;