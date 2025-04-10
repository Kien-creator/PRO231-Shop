// src/Contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUser({ email: decoded.email || "user@example.com" });
        setRole(decoded.role || "user");
      } catch (err) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUser(null);
        setRole("user");
      }
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setIsLoggedIn(true);
    setUser({ email: userData.email });
    setRole(decoded.role || "user");
    if (decoded.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    setRole("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};