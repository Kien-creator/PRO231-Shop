import React, { useState, useContext } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email: values.email,
        password: values.password,
      });
      login(response.data.token, { email: response.data.email });
      message.success("Account created successfully!");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    fontFamily: "Arial, sans-serif",
    margin: "0",
    padding: "0",
  };

  const formStyle = {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div style={pageStyle}>
      <div style={formStyle}>
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
        <Form name="signup" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: "Please enter your username!" }]}>
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: "Please enter your email!" }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Sign Up
            </Button>
          </Form.Item>
          <p style={{ textAlign: "center" }}>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </Form>
      </div>
    </div>
  );
}