import React from "react";
import { Carousel, Typography, Button } from "antd";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";

const { Title, Text } = Typography;

export default function Home() {
  return (
    <div>
      <HeroSection />
      {/* Ads Carousel Section */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 24px",
          backgroundColor: "#E8F5E9", // Shopee-inspired light green background
          borderRadius: "12px",
        }}
      >
        <Carousel autoplay effect="fade" dots={true} style={{ borderRadius: "12px", overflow: "hidden" }}>
          {/* First Ad: Super Brand Day */}
          <div style={{ position: "relative" }}>
            <Link to="/shop">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                }}
              >
                <img
                  src="/assets/Ad1.jpg" 
                  alt="Ad 1"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "transform 0.3s ease", // Zoom-in effect
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Zoom in on hover
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
                />
                {/* Overlay with "Shop Now" text on hover */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 200, 83, 0.5)", // Shopee green overlay (#00C853 with opacity)
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} // Show overlay on hover
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")} // Hide overlay on hover out
                >
                  <Text style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
                    Mua Ngay
                  </Text>
                </div>
              </div>
            </Link>
          </div>
          {/* Second Ad: Food Ad */}
          <div style={{ position: "relative" }}>
            <Link to="/shop">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                }}
              >
                <img
                  src="/assets/Ad2.jpg" // Placeholder image for the second ad
                  alt="Ad 2"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "transform 0.3s ease", // Zoom-in effect
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Zoom in on hover
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
                />
                {/* Overlay with "Shop Now" text on hover */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 200, 83, 0.5)", // Shopee green overlay (#00C853 with opacity)
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} // Show overlay on hover
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")} // Hide overlay on hover out
                >
                  <Text style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
                    Mua Ngay
                  </Text>
                </div>
              </div>
              
            </Link>
          </div>
          {/* Second Ad: Food Ad */}
          <div style={{ position: "relative" }}>
            <Link to="/shop">
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                }}
              >
                <img
                  src="/assets/Ad3.jpg" // Placeholder image for the second ad
                  alt="Ad 3"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "400px",
                    objectFit: "cover",
                    cursor: "pointer",
                    transition: "transform 0.3s ease", // Zoom-in effect
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Zoom in on hover
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
                />
                {/* Overlay with "Shop Now" text on hover */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 200, 83, 0.5)", // Shopee green overlay (#00C853 with opacity)
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")} // Show overlay on hover
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")} // Hide overlay on hover out
                >
                  <Text style={{ color: "#fff", fontSize: "24px", fontWeight: "bold" }}>
                    Mua Ngay
                  </Text>
                </div>
              </div>
              
            </Link>
          </div>
        </Carousel>
      </div>
      {/* Explore Our Products Section with Fade-In Animation */}
      <div
        style={{
          padding: "40px 24px",
          textAlign: "center",
          background: "linear-gradient(145deg, #E8F5E9, #ffffff)", // Shopee-inspired light green gradient
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          margin: "40px auto",
          maxWidth: "800px",
          animation: "fadeIn 1s ease-in-out", // Fade-in animation
        }}
      >
        <style>
          {`
            @keyframes fadeIn {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>
        <Title level={3} style={{ color: "#1a3c34", marginBottom: "16px" }}>
          Khám Phá Sản Phẩm
        </Title>
        <Text style={{ fontSize: "16px", color: "#1a3c34", display: "block", marginBottom: "24px" }}>
          Xem cửa hàng của chúng tôi để nhận ưu đãi mới nhất!
        </Text>
        <Link to="/shop">
          <Button
            type="primary"
            size="large"
            style={{
              background: "#00C853", // Shopee vibrant green button
              borderColor: "#00C853",
              borderRadius: "8px",
              padding: "0 32px",
              height: "48px",
              fontSize: "16px",
              transition: "transform 0.3s ease", // Scale-up effect
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Scale up on hover
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")} // Reset on hover out
          >
            Bắt Đầu Mua Sắm
          </Button>
        </Link>
      </div>
    </div>
  );
}