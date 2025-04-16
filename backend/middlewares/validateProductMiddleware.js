module.exports = (req, res, next) => {
  try {
    const { name, price, description, categoryId, stock, images } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: "Name, price, and categoryId are required" });
    }

    if (price < 0 || stock < 0) {
      return res.status(400).json({ message: "Price and stock cannot be negative" });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};