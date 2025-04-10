import React, { useState, useEffect, useContext } from "react";
import { Button, List, message, Modal, Form, Input, Select } from "antd";
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

  const pageStyle = {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  };

  if (!isLoggedIn) return null;

  const selectedCartItems = cart?.items?.filter((item) =>
    selectedItemIds.includes(item._id)
  ) || [];

  return (
    <div style={pageStyle}>
      <h2>Checkout</h2>
      {loading ? (
        <p>Loading...</p>
      ) : selectedCartItems.length > 0 ? (
        <>
          {userAddress && (
            <div style={{ marginBottom: "20px" }}>
              <h3>Shipping Address</h3>
              <p>
                <strong>Email:</strong> {user?.email || "Not provided"}
              </p>
              <p>
                <strong>Name:</strong> {userAddress.name}
              </p>
              <p>
                <strong>Phone:</strong> {userAddress.phone}
              </p>
              <p>
                <strong>Address:</strong> {userAddress.specificAddress}, {userAddress.ward}, {userAddress.district}, {userAddress.city}
              </p>
              <Button onClick={() => setIsModalVisible(true)}>
                Change Address
              </Button>
            </div>
          )}

          <List
            dataSource={selectedCartItems}
            renderItem={(item) => (
              <List.Item>
                <div style={{ width: "100%" }}>
                  <strong>
                    {item.productId && item.productId.name
                      ? item.productId.name
                      : "Unknown Product"}
                  </strong>{" "}
                  - $
                  {item.productId && item.productId.price
                    ? item.productId.price
                    : "N/A"}{" "}
                  x {item.quantity}
                </div>
              </List.Item>
            )}
          />
          <p>
            <strong>
              Total: $
              {selectedCartItems.reduce(
                (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
                0
              )}
            </strong>
          </p>
          <Button
            type="primary"
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{ marginTop: "10px" }}
          >
            Place Order
          </Button>
        </>
      ) : (
        <p>No items selected for checkout.</p>
      )}

      <Modal
        title="New Address"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Complete"
        cancelText="Back"
        okButtonProps={{ style: { background: "#ff4d4f", borderColor: "#ff4d4f" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name!" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter your phone number!" }]}
          >
            <Input placeholder="Enter your phone number" />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: "Please select your city!" }]}
          >
            <Select
              showSearch
              placeholder="Select your city"
              optionFilterProp="children"
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
          <Form.Item
            name="district"
            label="District"
            rules={[{ required: true, message: "Please select your district!" }]}
          >
            <Select
              showSearch
              placeholder="Select your district"
              optionFilterProp="children"
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
          <Form.Item
            name="ward"
            label="Ward"
            rules={[{ required: true, message: "Please select your ward!" }]}
          >
            <Select
              showSearch
              placeholder="Select your ward"
              optionFilterProp="children"
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
          <Form.Item
            name="specificAddress"
            label="Specific Address"
            rules={[{ required: true, message: "Please enter your specific address!" }]}
          >
            <Input placeholder="Enter your specific address" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}