const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, require: true, default: 1 }
    }
  ]
});

module.exports = mongoose.model("Cart", cartSchema);