import React, { useState, useEffect, useContext } from "react";
import { List, message, Tabs } from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      message.error("Please log in to view your orders!");
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [isLoggedIn, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status.toLowerCase() === activeTab);

  const tabItems = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "on delivery", label: "On Delivery" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const pageStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  };

  const emptyStateStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    textAlign: "center",
    color: "#888",
  };

  const emptyIconStyle = {
    fontSize: "48px",
    marginBottom: "16px",
    color: "#ccc",
  };

  const emptyTextStyle = {
    fontSize: "18px",
    fontWeight: "500",
    color: "#555",
  };

  if (!isLoggedIn) return null;

  return (
    <div style={pageStyle}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", color: "#333" }}>
        Your Orders
      </h2>
      <Tabs
        defaultActiveKey="all"
        items={tabItems}
        onChange={(key) => setActiveTab(key.toLowerCase())}
        style={{ width: "100%", marginBottom: "20px" }}
      />
      {loading ? (
        <p>Loading...</p>
      ) : filteredOrders && filteredOrders.length > 0 ? (
        <List
          style={{ width: "100%" }}
          dataSource={filteredOrders}
          renderItem={(order) => (
            <List.Item
              style={{
                background: "#fff",
                borderRadius: "8px",
                marginBottom: "16px",
                padding: "16px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div style={{ width: "100%" }}>
                <p style={{ margin: "0 0 8px", fontWeight: "500" }}>
                  Order placed on: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p style={{ margin: "0 0 8px" }}>Status: {order.status}</p>
                <p style={{ margin: "0 0 8px" }}>Total: ${order.total}</p>
                <List
                  dataSource={order.items}
                  renderItem={(item) => (
                    <List.Item style={{ padding: "8px 0" }}>
                      {item.productId?.name || "Unknown Product"} x {item.quantity}
                    </List.Item>
                  )}
                />
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>📋</div>
          <p style={emptyTextStyle}>
            {activeTab === "all"
              ? "No orders yet"
              : `No ${activeTab} orders`}
          </p>
        </div>
      )}
    </div>
  );
}