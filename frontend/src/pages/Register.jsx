import React from "react";
import { Form, Input, Button, message, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

export default function Register() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, values);
      message.success("Registered successfully! Please login.");
      navigate("/login");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to register.");
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
        Register
      </Title>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter your username" }]}
        >
          <Input placeholder="Enter your username" size="large" />
        </Form.Item>
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
            Register
          </Button>
        </Form.Item>
        <Button
          type="link"
          onClick={() =>

 navigate("/login")}
          style={{ padding: 0 }}
        >
          Already have an account? Login
        </Button>
      </Form>
    </div>
  );
}