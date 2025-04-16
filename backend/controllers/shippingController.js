const Shipping = require("../models/shipping");

const createShipping = async (req, res) => {
  try {
    const { orderId, method, fee, trackingNumber } = req.body;
    const newShipping = new Shipping({ orderId, method, fee, trackingNumber });
    await newShipping.save();
    res.status(201).json({ message: "Shipping created", shipping: newShipping });
  } catch (err) {
    next(err);
  }
};

const getOrderShipping = async (req, res) => {
  try {
    const { orderId } = req.params;
    const shipping = await Shipping.findOne({ orderId });
    if (!shipping) {
      return res.status(404).json({ message: "Shipping not found" });
    }
    res.status(200).json(shipping);
  } catch (err) {
    next(err);
  }
};

module.exports = { createShipping, getOrderShipping };