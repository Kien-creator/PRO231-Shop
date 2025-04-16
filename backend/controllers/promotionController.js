const Promotion = require("../models/promotion");

const createPromotion = async (req, res) => {
  try {
    const { name, code, discount, type, startDate, endDate } = req.body;
    const newPromotion = new Promotion({ name, code, discount, type, startDate, endDate });
    await newPromotion.save();
    res.status(201).json({ message: "Promotion created", promotion: newPromotion });
  } catch (err) {
    next(err);
  }
};

const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (err) {
    next(err);
  }
};

module.exports = { createPromotion, getAllPromotions };