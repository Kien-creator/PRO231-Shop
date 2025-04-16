import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { message } from "antd";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, []);

const fetchCart = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Fetched cart data:", response.data);
    setCart(response.data || []);
  } catch (err) {
    console.error("Error in fetchCart:", err);
    message.error("Failed to load cart.");
    setCart([]);
  }
};

  const addToCart = async (product, quantity = 1) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId: product._id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data.cart.items || []);
      message.success(`${product.name} added to cart`);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Item removed from cart");
      await fetchCart(); // Ensure the cart is refreshed after removal
    } catch (err) {
      console.error("Error in removeFromCart:", err);
      message.error(err.response?.data?.message || "Failed to remove item from cart.");
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);