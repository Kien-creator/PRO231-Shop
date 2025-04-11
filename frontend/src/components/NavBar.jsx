import React from "react";
import { Menu, Dropdown, message } from "antd"; // Added 'message' here
import { Link } from "react-router-dom";
import { ShoppingCartOutlined, UserOutlined, DownOutlined } from "@ant-design/icons";
import { AuthContext } from "../Contexts/AuthContext";

export default function NavBar() {
  const { isLoggedIn, role, logout } = React.useContext(AuthContext);

  const userMenuItems = {
    items: isLoggedIn
      ? [
          { key: "1", label: <Link to="/settings">Settings</Link> },
          { key: "2", label: <Link to="/orders">Orders</Link> },
          ...(role === "admin"
            ? [{ key: "3", label: <Link to="/admin">Admin Dashboard</Link> }]
            : []),
          {
            key: "4",
            label: (
              <span
                onClick={() => {
                  logout(); // Call the logout function
                  message.success("Logged out successfully!"); // Show the success message
                }}
              >
                Logout
              </span>
            ),
          },
        ]
      : [
          { key: "1", label: <Link to="/login">Login</Link> },
          { key: "2", label: <Link to="/signup">Sign Up</Link> },
        ],
  };

  const navBarStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #ddd",
  };

  const logoStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#000",
  };

  const menuStyle = {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    border: "none",
  };

  const iconsStyle = {
    display: "flex",
    gap: "20px",
    fontSize: "20px",
    alignItems: "center",
  };

  const menuItems = [
    { key: "1", label: <Link to="/">Home</Link> },
    { key: "2", label: <Link to="/shop">Shop</Link> },
  ];

  return (
    <div style={navBarStyle}>
      <div style={logoStyle}>SHOP</div>
      <Menu mode="horizontal" style={menuStyle} items={menuItems} />
      <div style={iconsStyle}>
        <Link to="/cart">
          <ShoppingCartOutlined />
        </Link>
        <Dropdown menu={userMenuItems} trigger={["click"]}>
          <span style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <UserOutlined style={{ marginRight: "5px" }} />
            <DownOutlined style={{ fontSize: "14px" }} />
          </span>
        </Dropdown>
      </div>
    </div>
  );
}