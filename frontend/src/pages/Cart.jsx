import React, { useState, useEffect, useContext } from "react";
import { Button, List, InputNumber, Typography, message, Card, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items || []);
    } catch (err) {
      message.error("Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      message.error("Vui lòng đăng nhập để xem giỏ hàng!");
      navigate("/login");
    } else {
      fetchCart();
    }
  }, [isLoggedIn, navigate]);

  const updateQuantity = async (productId, quantity) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/cart/update`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems(
        cartItems.map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      message.error("Không thể cập nhật số lượng.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(cartItems.filter((item) => item.productId._id !== productId));
      message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      message.error("Không thể xóa sản phẩm.");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      message.warning("Giỏ hàng của bạn đang trống!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div style={{ padding: "40px 20px", background: "#f0f2f5", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Title level={3} style={{ color: "#1a3c34", marginBottom: "24px", textAlign: "center" }}>
          Giỏ Hàng Của Bạn
        </Title>
        {cartItems.length === 0 ? (
          <Text style={{ display: "block", textAlign: "center", color: "#888" }}>
            Giỏ hàng của bạn đang trống.
          </Text>
        ) : (
          <>
            <List
              loading={loading}
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item
                  style={{
                    background: "#fff",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  }}
                  actions={[
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeItem(item.productId._id)}
                      style={{ borderRadius: "8px" }}
                    >
                      Xóa
                    </Button>,
                  ]}
                >
                  <Space style={{ width: "100%", justifyContent: "space-between" }}>
                    <div>
                      <Text strong style={{ fontSize: "16px", color: "#1a3c34" }}>
                        {item.productId.name}
                      </Text>
                      <br />
                      <Text style={{ color: "#555" }}>
                        {(item.productId.price || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                      </Text>
                    </div>
                    <InputNumber
                      min={1}
                      value={item.quantity}
                      onChange={(value) => updateQuantity(item.productId._id, value)}
                      style={{ width: "80px", borderRadius: "8px" }}
                    />
                  </Space>
                </List.Item>
              )}
            />
            <Card
              style={{
                marginTop: "24px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              <Space style={{ width: "100%", justifyContent: "space-between" }}>
                <Text strong style={{ fontSize: "18px", color: "#1a3c34" }}>
                  Tổng Cộng:
                </Text>
                <Text strong style={{ fontSize: "18px", color: "#1a3c34" }}>
                  {calculateTotal().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VNĐ
                </Text>
              </Space>
              <Button
                type="primary"
                size="large"
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  marginTop: "16px",
                  background: "#1a3c34",
                  borderColor: "#1a3c34",
                  borderRadius: "8px",
                  height: "48px",
                  fontSize: "16px",
                }}
              >
                Thanh Toán
              </Button>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}