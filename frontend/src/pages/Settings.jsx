import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, message, Typography, Spin } from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Settings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      message.error("Please log in to access settings!");
      navigate("/login");
      return;
    }
    fetchUser();
  }, [isLoggedIn, navigate]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      form.setFieldsValue({
        username: response.data.username,
        email: response.data.email,
      });
    } catch (err) {
      message.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/me`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Profile updated successfully!");
    } catch (err) {
      message.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    message.success("Logged out successfully!");
    navigate("/login");
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}><Spin size="large" /></div>;

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "30px",
        background: "#F4F6F8", // Light gray background for a modern look
        borderRadius: "16px", // Slightly larger border radius for a softer appearance
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)", // Enhanced shadow for depth
        border: "1px solid #E0E0E0", // Subtle border for better definition
      }}
    >
      <Title
        level={3}
        style={{
          color: "#1a3c34", 
          textAlign: "center",
          marginBottom: "24px", 
          fontWeight: "bold", 
        }}
      >
        Cài Đặt 
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="Tên Người Dùng"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng của bạn!" }]}
        >
          <Input
            placeholder="Nhập tên người dùng của bạn"
            style={{
              borderRadius: "8px", 
              padding: "10px",
              border: "1px solid #D1D5DB", 
              background: "#FFFFFF", 
            }}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email của bạn!" }]}
        >
          <Input
            placeholder="Nhập email của bạn"
            style={{
              borderRadius: "8px",
              padding: "10px",
              border: "1px solid #D1D5DB",
              background: "#F9FAFB", 
            }}
            disabled
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              width: "100%",
              background: "#00796B", 
              borderColor: "#00796B",
              height: "45px",
              borderRadius: "10px",
              fontWeight: "bold",
              transition: "transform 0.3s ease, background 0.3s ease", 
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#004D40")} 
            onMouseLeave={(e) => (e.currentTarget.style.background = "#00796B")}
          >
            Lưu Thay Đổi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}