import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";

const { Title } = Typography;

export default function Login() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setIsLoggedIn, setRole } = React.useContext(AuthContext);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, values);
      localStorage.setItem("token", response.data.token);
      setIsLoggedIn(true);
      setRole(response.data.user.role);
      message.success("Logged in successfully!");
      navigate(response.data.user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to login.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#E8F5E9", // Updated background color
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
          background: "#fff", // White background for the form container
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Slightly darker shadow
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: "24px", color: "#1a3c34" }}>
          Login
        </Title>
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="Enter your email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Enter your password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                width: "100%",
                background: "#00C853", // Updated button color
                borderColor: "#00C853",
                borderRadius: "8px",
                height: "40px",
                transition: "transform 0.3s ease", // Added hover effect
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              Login
            </Button>
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            <span style={{ color: "#1a3c34" }}>Don't have an account? </span>
            <Button
              type="link"
              onClick={() => navigate("/register")}
              style={{
                color: "#00C853", // Updated link color
                padding: 0,
                transition: "transform 0.3s ease", // Added hover effect
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              Register
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}