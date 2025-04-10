import React, { useState, useEffect, useContext } from "react";
import { Button, Checkbox, Space } from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]); // Track selected items
  const [selectAll, setSelectAll] = useState(false); // Track "Select All" checkbox
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [isLoggedIn, navigate]); // Only re-run if isLoggedIn or navigate changes

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
      // Reset selected items when cart is fetched
      setSelectedItems([]);
      setSelectAll(false);
    } catch (err) {
      console.error("Fetch cart error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity, e) => {
    e.preventDefault(); // Prevent any default browser behavior

    if (newQuantity < 1) return; // Prevent quantity from going below 1

    // Optimistically update the UI
    const originalCart = { ...cart }; // Store the original cart for rollback in case of error
    setCart((prevCart) => {
      const updatedItems = prevCart.items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      return { ...prevCart, items: updatedItems };
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (err) {
      setCart(originalCart);
    }
  };

  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart({ items: [] });
      setSelectedItems([]); // Clear selected items
      setSelectAll(false); // Reset "Select All"
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      setSelectAll(false); // Uncheck "Select All" if any item is deselected
    } else {
      const newSelectedItems = [...selectedItems, itemId];
      setSelectedItems(newSelectedItems);
      // Check if all items are selected
      if (cart && cart.items && newSelectedItems.length === cart.items.length) {
        setSelectAll(true);
      }
    }
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(cart.items.map((item) => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  // Calculate total price of selected items
  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items
      .filter((item) => selectedItems.includes(item._id))
      .reduce((sum, item) => sum + (item.productId?.price || 0) * item.quantity, 0);
  };

  // Handle "Proceed to Checkout" with selected items
  const handleProceedToCheckout = () => {
    if (selectedItems.length === 0) {
      return;
    }
    navigate("/checkout", { state: { selectedItemIds: selectedItems } });
  };

  // Styles for the page
  const pageStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "1000px",
    margin: "0 auto",
  };

  const tableHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    background: "#f5f5f5",
    borderBottom: "1px solid #e8e8e8",
    fontWeight: "bold",
  };

  const tableRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #e8e8e8",
  };

  const columnStyle = {
    flex: 1,
    textAlign: "center",
  };

  const productColumnStyle = {
    flex: 3,
    textAlign: "left",
    display: "flex",
    alignItems: "center",
  };

  if (!isLoggedIn) return null;

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "20px" }}>Your Cart</h2>
      {loading ? (
        <p>Loading...</p>
      ) : cart && cart.items && cart.items.length > 0 ? (
        <>
          {/* Table Header */}
          <div style={tableHeaderStyle}>
            <div style={{ ...columnStyle, flex: 0.5 }}>
              <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
            </div>
            <div style={{ ...columnStyle, flex: 3 }}>Product</div>
            <div style={columnStyle}>Quantity</div>
            <div style={columnStyle}>Price</div>
            <div style={columnStyle}>Total</div>
            <div style={columnStyle}>Actions</div>
          </div>

          {/* Table Rows */}
          {cart.items.map((item) => (
            <div key={item._id} style={tableRowStyle}>
              <div style={{ ...columnStyle, flex: 0.5 }}>
                <Checkbox
                  checked={selectedItems.includes(item._id)}
                  onChange={() => handleCheckboxChange(item._id)}
                />
              </div>
              <div style={productColumnStyle}>
                {/* Product Image (if available) */}
                {item.productId?.image ? (
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    style={{ width: "50px", height: "50px", marginRight: "10px" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "#e8e8e8",
                      marginRight: "10px",
                    }}
                  />
                )}
                <div>
                  <strong>
                    {item.productId && item.productId.name
                      ? item.productId.name
                      : "Unknown Product"}
                  </strong>
                </div>
              </div>
              <div style={columnStyle}>
                <Space>
                  <Button
                    onClick={(e) => updateQuantity(item._id, item.quantity - 1, e)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    onClick={(e) => updateQuantity(item._id, item.quantity + 1, e)}
                    disabled={false}
                  >
                    +
                  </Button>
                </Space>
              </div>
              <div style={columnStyle}>
                ${item.productId && item.productId.price ? item.productId.price : "N/A"}
              </div>
              <div style={columnStyle}>
                ${(item.productId?.price || 0) * item.quantity}
              </div>
              <div style={columnStyle}>
                <Button
                  type="link"
                  danger
                  onClick={() => removeItem(item._id)}
                  disabled={loading}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}

          {/* Total and Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <div>
              <strong>Total: ${calculateTotal()}</strong>
            </div>
            <Space>
              <Button
                type="default"
                onClick={clearCart}
                disabled={loading}
              >
                Clear Cart
              </Button>
              <Button
                type="primary"
                onClick={handleProceedToCheckout}
                disabled={loading || selectedItems.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Space>
          </div>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
