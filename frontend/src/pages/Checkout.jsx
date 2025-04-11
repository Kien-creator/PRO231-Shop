import React, { useState, useEffect, useContext } from "react";
import { Button, List, message, Modal, Form, Input, Select, Card, Row, Col, Space } from "antd";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const { Option } = Select;

export default function Checkout() {
  const [cart, setCart] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [form] = Form.useForm();
  const { isLoggedIn, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItemIds = location.state?.selectedItemIds || [];

  // Your existing useEffect and fetch functions remain the same
  useEffect(() => {
    if (!isLoggedIn) {
      message.error("Please log in to proceed to checkout!");
      navigate("/login");
      return;
    }
    fetchCart();
    fetchUserProfile();
    fetchCities();
  }, [isLoggedIn, navigate]);

  const fetchCities = async () => {
    try {
      const response = await axios.get("https://provinces.open-api.vn/api/p/");
      setCities(response.data);
    } catch (err) {
      message.error("Failed to load cities.");
    }
  };

  const fetchDistricts = async (cityCode) => {
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/p/${cityCode}?depth=2`);
      setDistricts(response.data.districts);
      setWards([]);
      setSelectedDistrict(null);
      form.setFieldsValue({ district: undefined, ward: undefined });
    } catch (err) {
      message.error("Failed to load districts.");
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(response.data.wards);
      form.setFieldsValue({ ward: undefined });
    } catch (err) {
      message.error("Failed to load wards.");
    }
  };

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(response.data);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserAddress(response.data.address);
      if (response.data.address) {
        form.setFieldsValue({
          name: response.data.address.name,
          phone: response.data.address.phone,
          city: response.data.address.city,
          district: response.data.address.district,
          ward: response.data.address.ward,
          specificAddress: response.data.address.specificAddress,
        });
        const city = cities.find((c) => c.name === response.data.address.city);
        if (city) {
          setSelectedCity(city.code);
          await fetchDistricts(city.code);
        }
        const district = districts.find((d) => d.name === response.data.address.district);
        if (district) {
          setSelectedDistrict(district.code);
          await fetchWards(district.code);
        }
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to load user profile.");
      setUserAddress(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!userAddress) {
      setIsModalVisible(true);
    } else {
      placeOrder(userAddress);
    }
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        saveAddress(values);
      })
      .catch(() => {});
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const saveAddress = async (address) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/address`,
        address,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserAddress(response.data.address);
      setIsModalVisible(false);
      form.resetFields();
      message.success("Address saved successfully!");
      placeOrder(response.data.address);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save address.");
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async (address) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        { selectedItemIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Order placed successfully!");
      navigate("/orders");
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) return null;

  const selectedCartItems = cart?.items?.filter((item) =>
    selectedItemIds.includes(item._id)
  ) || [];

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Checkout</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : selectedCartItems.length > 0 ? (
        <Row gutter={[16, 16]}>
          {/* Shipping Address Section */}
          {userAddress && (
            <Col xs={24} md={12}>
              <Card title="Shipping Address" style={{ width: "100%" }}>
                <Space direction="vertical">
                  <p><strong>Email:</strong> {user?.email || "Not provided"}</p>
                  <p><strong>Name:</strong> {userAddress.name}</p>
                  <p><strong>Phone:</strong> {userAddress.phone}</p>
                  <p>
                    <strong>Address:</strong> {userAddress.specificAddress}, {userAddress.ward}, {userAddress.district}, {userAddress.city}
                  </p>
                  <Button type="dashed" onClick={() => setIsModalVisible(true)}>
                    Change Address
                  </Button>
                </Space>
              </Card>
            </Col>
          )}

          {/* Cart Items Section */}
          <Col xs={24} md={12}>
            <Card title="Your Order" style={{ width: "100%" }}>
              <List
                dataSource={selectedCartItems}
                renderItem={(item) => (
                  <List.Item>
                    <Space>
                      <strong>
                        {item.productId?.name || "Unknown Product"}
                      </strong>
                      <span>
                        ${item.productId?.price || "N/A"} x {item.quantity}
                      </span>
                    </Space>
                  </List.Item>
                )}
              />
              <p style={{ textAlign: "right", fontSize: "16px" }}>
                <strong>Total: ${selectedCartItems.reduce(
                  (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
                  0
                )}</strong>
              </p>
              <Button
                type="primary"
                size="large"
                onClick={handlePlaceOrder}
                loading={loading}
                block
              >
                Place Order
              </Button>
            </Card>
          </Col>
        </Row>
      ) : (
        <p style={{ textAlign: "center" }}>No items selected for checkout.</p>
      )}

      {/* Address Modal */}
      <Modal
        title="Add New Address"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save & Proceed"
        cancelText="Cancel"
        okButtonProps={{ loading: loading }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter your name!" }]}>
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: "Please enter your phone number!" }]}>
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: "Please select your city!" }]}>
            <Select
              showSearch
              placeholder="Select your city"
              onChange={(value) => {
                const city = cities.find((c) => c.name === value);
                setSelectedCity(city.code);
                fetchDistricts(city.code);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {cities.map((city) => (
                <Option key={city.code} value={city.name}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="district" label="District" rules={[{ required: true, message: "Please select your district!" }]}>
            <Select
              showSearch
              placeholder="Select your district"
              onChange={(value) => {
                const district = districts.find((d) => d.name === value);
                setSelectedDistrict(district.code);
                fetchWards(district.code);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!selectedCity}
            >
              {districts.map((district) => (
                <Option key={district.code} value={district.name}>
                  {district.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="ward" label="Ward" rules={[{ required: true, message: "Please select your ward!" }]}>
            <Select
              showSearch
              placeholder="Select your ward"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              disabled={!selectedDistrict}
            >
              {wards.map((ward) => (
                <Option key={ward.code} value={ward.name}>
                  {ward.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="specificAddress" label="Specific Address" rules={[{ required: true, message: "Please enter your specific address!" }]}>
            <Input placeholder="Enter your specific address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}