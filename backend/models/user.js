const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  city: { type: String, trim: true },
  district: { type: String, trim: true },
  ward: { type: String, trim: true },
  specificAddress: { type: String, trim: true },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: { type: String, required: true }, 
    role: { type: String, enum: ["user", "admin"], default: "user" },
    address: addressSchema, 
  },
  { timestamps: true } 
);

module.exports = mongoose.model("User", userSchema);