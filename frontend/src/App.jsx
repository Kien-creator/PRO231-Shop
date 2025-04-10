import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./Contexts/AuthContext";
import { SearchProvider } from "./Contexts/SearchContext";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import ProductDetail from "./pages/ProductDetail";
import "antd/dist/reset.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <SearchProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/products/:id" element={<ProductDetail />} />
            </Route>
          </Routes>
        </SearchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;