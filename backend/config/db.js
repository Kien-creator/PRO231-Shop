const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB - Database: Shop");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1); // Stop if it fails
  }
};

module.exports = connectDB;