const Wishlist = require("../models/wishlist");

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [] });
    }

    if (!wishlist.items.find(item => item.productId.toString() === productId)) {
      wishlist.items.push({ productId });
      await wishlist.save();
    }

    res.status(200).json({ message: "Added to wishlist", wishlist });
  } catch (err) {
    next(err);
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("items.productId");
    res.status(200).json(wishlist || { userId: req.user.id, items: [] });
  } catch (err) {
    next(err);
  }
};

module.exports = { addToWishlist, getWishlist };