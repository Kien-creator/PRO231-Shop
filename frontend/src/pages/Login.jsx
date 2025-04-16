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
        maxWidth: "400px",
        margin: "100px auto",
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      }}
    >
      <Title level={3} style={{ color: "#1a3c34", textAlign: "center" }}>
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
              background: "#1a3c34",
              borderColor: "#1a3c34",
              borderRadius: "8px",
              height: "40px",
            }}
          >
            Login
          </Button>
        </Form.Item>
        <Button
          type="link"
          onClick={() => navigate("/register")}
          style={{ padding: 0 }}
        >
          Don't have an account? Register
        </Button>
      </Form>
    </div>
  );
}