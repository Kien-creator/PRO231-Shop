import React from "react";
import { Layout } from "antd";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

const { Content } = Layout;

export default function MainLayout({ children }) {
  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header>
        <NavBar />
      </Header>
      <Content style={{ padding: "40px 24px", maxWidth: "1400px", margin: "0 auto", width: "100%" }}>
        {children}
      </Content>
      <Footer />
    </Layout>
  );
}