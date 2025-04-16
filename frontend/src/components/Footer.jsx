import React from "react";
import { Layout, Row, Col, Typography, Space, Divider } from "antd";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaWallet,
  FaCreditCard,
  FaMoneyCheckAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTruck,
  FaApple,
  FaGooglePlay,
  FaMobileAlt,
  FaQrcode,
} from "react-icons/fa";

const { Footer: AntdFooter } = Layout;
const { Text, Title } = Typography;

export default function Footer() {
  return (
    <AntdFooter
      style={{
        background: "#E8F5E9", // Shopee light green background
        padding: "40px 24px",
        borderTop: "1px solid #e8e8e8",
      }}
    >
      <Row gutter={[24, 24]} style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Customer Service */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#1a3c34", marginBottom: "16px" }}>
            DỊCH VỤ KHÁCH HÀNG
          </Title>
          <Space direction="vertical">
            <Text style={{ color: "#1a3c34" }}>Trung Tâm Trợ Giúp Fake Shop</Text>
            <Text style={{ color: "#1a3c34" }}>Fake Shop Blog</Text>
            <Text style={{ color: "#1a3c34" }}>Fake Shop Mall</Text>
            <Text style={{ color: "#1a3c34" }}>Hướng Dẫn Mua Hàng/Đặt Hàng</Text>
            <Text style={{ color: "#1a3c34" }}>Hướng Dẫn Bán Hàng</Text>
            <Text style={{ color: "#1a3c34" }}>Vận Chuyển</Text>
            <Text style={{ color: "#1a3c34" }}>Fake Shop Pay</Text>
            <Text style={{ color: "#1a3c34" }}>Fake Shop Xu</Text>
            <Text style={{ color: "#1a3c34" }}>Đơn Hàng</Text>
            <Text style={{ color: "#1a3c34" }}>Trả Hàng/Hoàn Tiền</Text>
            <Text style={{ color: "#1a3c34" }}>Liên Hệ Fake Shop</Text>
            <Text style={{ color: "#1a3c34" }}>Chính Sách Bảo Hành</Text>
          </Space>
        </Col>

        {/* About Fake Shop */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#1a3c34", marginBottom: "16px" }}>
            VỀ FAKE SHOP
          </Title>
          <Space direction="vertical">
            <Text style={{ color: "#1a3c34" }}>Về Fake Shop</Text>
            <Text style={{ color: "#1a3c34" }}>Tuyển Dụng</Text>
            <Text style={{ color: "#1a3c34" }}>Điều Khoản Fake Shop</Text>
            <Text style={{ color: "#1a3c34" }}>Chính Sách Bảo Mật</Text>
            <Text style={{ color: "#1a3c34" }}>Fake Shop Mall</Text>
            <Text style={{ color: "#1a3c34" }}>Kênh Người Bán</Text>
            <Text style={{ color: "#1a3c34" }}>Flash Sale</Text>
            <Text style={{ color: "#1a3c34" }}>Tiếp Thị Liên Kết</Text>
            <Text style={{ color: "#1a3c34" }}>Liên Hệ Truyền Thông</Text>
          </Space>
        </Col>

        {/* Payment Methods */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#1a3c34", marginBottom: "16px" }}>
            THANH TOÁN
          </Title>
          <Space wrap>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaCcVisa size={40} color="#1a3c34" title="Visa" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaCcMastercard size={40} color="#1a3c34" title="MasterCard" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaCcAmex size={40} color="#1a3c34" title="Amex" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaWallet size={40} color="#1a3c34" title="Fake Shop Pay" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaCreditCard size={40} color="#1a3c34" title="Fake Shop Pay Later" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaMoneyCheckAlt size={40} color="#1a3c34" title="Trả Góp" />
            </div>
          </Space>
        </Col>

        {/* Follow Fake Shop */}
        <Col xs={24} sm={12} md={3}>
          <Title level={5} style={{ color: "#1a3c34", marginBottom: "16px" }}>
            THEO DÕI FAKE SHOP
          </Title>
          <Space>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaFacebook size={40} color="#1a3c34" title="Facebook" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaInstagram size={40} color="#1a3c34" title="Instagram" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaLinkedin size={40} color="#1a3c34" title="LinkedIn" />
            </div>
          </Space>
        </Col>

        {/* Shipping Partners */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "#1a3c34", marginBottom: "16px" }}>
            ĐƠN VỊ VẬN CHUYỂN
          </Title>
          <Space wrap>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="SPX Express" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="Viettel Post" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="VN Post" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="J&T Express" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="Grab Express" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="Ninja Van" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="Be" />
            </div>
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaTruck size={40} color="#1a3c34" title="AhaMove" />
            </div>
          </Space>
        </Col>

        {/* Download Fake Shop App */}
        <Col xs={24} sm={12} md={3}>
          <Title level={5} style={{ color: "#1a3c34", marginBottom: "16px" }}>
            TẢI ỨNG DỤNG FAKE SHOP
          </Title>
          <Space direction="vertical" align="center">
            <div
              style={{
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
            >
              <FaQrcode size={100} color="#1a3c34" title="QR Code" />
            </div>
            <Space>
              <div
                style={{
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
              >
                <FaApple size={40} color="#1a3c34" title="App Store" />
              </div>
              <div
                style={{
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
              >
                <FaGooglePlay size={40} color="#1a3c34" title="Google Play" />
              </div>
              <div
                style={{
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
              >
                <FaMobileAlt size={40} color="#1a3c34" title="AppGallery" />
              </div>
            </Space>
          </Space>
        </Col>
      </Row>

      {/* Divider */}
      <Divider style={{ margin: "24px 0", borderColor: "#e8e8e8" }} />

      {/* Copyright and Countries */}
      <Row justify="space-between" style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <Col>
          <Text style={{ color: "#1a3c34" }}>
            © 2025 Fake Shop. Tất cả các quyền được bảo lưu.
          </Text>
        </Col>
        <Col>
          <Text style={{ color: "#1a3c34" }}>
            Quốc gia & Khu vực: Singapore | Indonesia | Thái Lan | Malaysia | Việt Nam | Philippines | Brazil | México | Colombia | Chile | Đài Loan
          </Text>
        </Col>
      </Row>
    </AntdFooter>
  );
}