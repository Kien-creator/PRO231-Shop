import React from "react";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    message.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <Button onClick={handleLogout} type="primary">
      Log Out
    </Button>
  );
}