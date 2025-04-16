import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import LogoutButton from "./LogoutButton";
import { Space } from "antd";

export default function NavBar() {
  const { isLoggedIn, role } = useContext(AuthContext);
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#1a3c34" : "#333",
    fontSize: "16px",
    fontWeight: location.pathname === path ? "bold" : "normal",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "all 0.3s",
    background: location.pathname === path ? "rgba(255, 255, 255, 0.2)" : "transparent",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.1)",
      color: "#fff",
    },
  });

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        height: "100%",
      }}
    >
      {/* Left: Fake Shop Logo and Navigation Links */}
      <Space size="middle" style={{ alignItems: "center" }}>
        {/* Fake Shop Logo */}
        <Link to="/">
          <img
            src="src\assets\logo.png" 
            alt="Fake Shop Logo"
            style={{
              height: "40px",
              marginRight: "16px",
            }}
          />
        </Link>

        {/* Navigation Links */}
        <Link to="/" style={linkStyle("/")}>
          Home
        </Link>
        <Link to="/shop" style={linkStyle("/shop")}>
          Shop
        </Link>
        {isLoggedIn && (
          <Link to="/orders" style={linkStyle("/orders")}>
            Orders
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/cart" style={linkStyle("/cart")}>
            Cart
          </Link>
        )}
        {isLoggedIn && (
          <Link to="/settings" style={linkStyle("/settings")}>
            Settings
          </Link>
        )}
        {isLoggedIn && role === "admin" && (
          <Link to="/admin" style={linkStyle("/admin")}>
            Admin
          </Link>
        )}
      </Space>

      {/* Right: Login/Logout Buttons */}
      <Space size="middle">
        {!isLoggedIn ? (
          <>
            <Link to="/login" style={linkStyle("/login")}>
              Login
            </Link>
            <Link to="/register" style={linkStyle("/register")}>
              Register
            </Link>
          </>
        ) : (
          <LogoutButton />
        )}
      </Space>
    </nav>
  );
}