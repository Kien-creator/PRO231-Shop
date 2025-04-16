import React, { useContext } from "react";
import { AuthContext } from "../Contexts/AuthContext";
import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const { setIsLoggedIn, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setRole(null);
    navigate("/login");
  };

  return (
    <Button
      onClick={handleLogout}
      icon={<LogoutOutlined />}
      style={{
        background: "#ff4d4f",
        borderColor: "#ff4d4f",
        color: "#fff",
        borderRadius: "8px",
        height: "40px",
        fontSize: "14px",
        transition: "all 0.3s",
      }}
    >
      Logout
    </Button>
  );
}