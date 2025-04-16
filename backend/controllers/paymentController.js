const Payment = require("../models/payment");
const { generateCode, formatDate } = require("../helpers/helper");

const createPayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const transactionId = generateCode("TX-"); // Sử dụng Helper
    const newPayment = new Payment({ orderId, amount, method, transactionId });
    await newPayment.save();
    res.status(201).json({
      message: "Payment created",
      payment: { ...newPayment._doc, paymentDate: formatDate(newPayment.paymentDate) }, // Định dạng ngày
    });
  } catch (err) {
    next(err);
  }
};

const getOrderPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await Payment.findOne({ orderId });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({
      ...payment._doc,
      paymentDate: formatDate(payment.paymentDate), // Định dạng ngày
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createPayment, getOrderPayment };