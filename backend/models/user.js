const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  address: {
    name: { type: String },
    phone: { type: String },
    city: { type: String },
    district: { type: String },
    ward: { type: String },
    specificAddress: { type: String },
  },
});

module.exports = mongoose.model("User", userSchema);