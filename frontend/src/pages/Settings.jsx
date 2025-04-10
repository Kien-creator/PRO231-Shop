import React, { useState, useEffect, useContext } from "react";
import { Tabs, Form, Input, Button, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Contexts/AuthContext";
import LogoutButton from "../components/LogoutButton";

const { Option } = Select;

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isAddressTabLoaded, setIsAddressTabLoaded] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [addressForm] = Form.useForm();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
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
      addressForm.setFieldsValue({ district: undefined, ward: undefined });
    } catch (err) {
      message.error("Failed to load districts.");
    }
  };

  const fetchWards = async (districtCode) => {
    try {
      const response = await axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
      setWards(response.data.wards);
      addressForm.setFieldsValue({ ward: undefined });
    } catch (err) {
      message.error("Failed to load wards.");
    }
  };

  useEffect(() => {
    if (userProfile && activeTab === "1") {
      profileForm.setFieldsValue({
        username: userProfile.username,
        email: userProfile.email,
        gender: userProfile.gender,
      });
    }
  }, [userProfile, activeTab, profileForm]);

  useEffect(() => {
    if (userProfile && activeTab === "3" && !isAddressTabLoaded && userProfile.address) {
      addressForm.setFieldsValue({
        name: userProfile.address.name,
        phone: userProfile.address.phone,
        city: userProfile.address.city,
        district: userProfile.address.district,
        ward: userProfile.address.ward,
        specificAddress: userProfile.address.specificAddress,
      });
      setIsAddressTabLoaded(true);
    }
  }, [userProfile, activeTab, addressForm, isAddressTabLoaded]);

  useEffect(() => {
    if (userProfile && activeTab === "3" && userProfile.address) {
      const city = cities.find((c) => c.name === userProfile.address.city);
      if (city && selectedCity !== city.code) {
        setSelectedCity(city.code);
        fetchDistricts(city.code);
      }
      const district = districts.find((d) => d.name === userProfile.address.district);
      if (district && selectedDistrict !== district.code) {
        setSelectedDistrict(district.code);
        fetchWards(district.code);
      }
    }
  }, [userProfile, activeTab, cities, districts]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserProfile(response.data);
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to load user profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const onProfileFinish = async (values) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const profileUpdates = {};
      if (values.username) profileUpdates.username = values.username;
      if (values.email) profileUpdates.email = values.email;
      if (values.gender) profileUpdates.gender = values.gender;

      if (Object.keys(profileUpdates).length > 0) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          profileUpdates,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        message.success("Profile updated successfully!");
      } else {
        message.info("No profile changes provided.");
      }

      await fetchUserProfile();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const onPasswordFinish = async (values) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      if (values.newPassword !== values.confirmNewPassword) {
        message.error("New password and confirm password do not match!");
        setLoading(false);
        return;
      }

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success("Password updated successfully!");
      passwordForm.resetFields();
    } catch (err) {
      message.error(
        err.response?.data?.message || "Failed to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  const onAddressFinish = async (values) => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const addressUpdates = {
        name: values.name,
        phone: values.phone,
        city: values.city,
        district: values.district,
        ward: values.ward,
        specificAddress: values.specificAddress,
      };

      const hasAddressChanges = Object.values(addressUpdates).some(
        (value) => value
      );
      if (hasAddressChanges) {
        const missingFields = [];
        if (!addressUpdates.name) missingFields.push("Name");
        if (!addressUpdates.phone) missingFields.push("Phone Number");
        if (!addressUpdates.city) missingFields.push("City");
        if (!addressUpdates.district) missingFields.push("District");
        if (!addressUpdates.ward) missingFields.push("Ward");
        if (!addressUpdates.specificAddress)
          missingFields.push("Specific Address");

        if (missingFields.length > 0) {
          message.error(
            `Please fill in all address fields: ${missingFields.join(", ")}`
          );
          setLoading(false);
          return;
        }

        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/auth/address`,
          addressUpdates,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Address updated successfully!");
      } else {
        message.info("No address changes provided.");
      }

      await fetchUserProfile();
      setIsAddressTabLoaded(false);
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to update address.");
    } finally {
      setLoading(false);
    }
  };

  const pageStyle = {
    fontFamily: "Arial, sans-serif",
    margin: "0",
    padding: "20px",
    display: "flex",
  };

  const sidebarStyle = {
    width: "200px",
    padding: "10px",
    borderRight: "1px solid #ddd",
  };

  const contentStyle = {
    flex: 1,
    padding: "20px",
  };

  const formStyle = {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  };

  const buttonStyle = {
    backgroundColor: "#ff6200",
    borderColor: "#ff6200",
  };

  if (!isLoggedIn) return null;

  return (
    <div style={pageStyle}>
      <div style={contentStyle}>
        <div style={formStyle}>
          <h2 style={{ textAlign: "center" }}>My Profile</h2>
          <Tabs
            defaultActiveKey="1"
            onChange={(key) => {
              setActiveTab(key);
              if (key === "3") setIsAddressTabLoaded(false);
            }}
            items={[
              {
                key: "1",
                label: "Profile",
                children: (
                  <Form
                    form={profileForm}
                    name="profile"
                    onFinish={onProfileFinish}
                    layout="vertical"
                  >
                    <Form.Item name="username" label="Username">
                      <Input placeholder="Enter your username" />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                      <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item name="gender" label="Gender">
                      <Select placeholder="Select your gender" allowClear>
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                        <Option value="Other">Other</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={buttonStyle}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: "2",
                label: "Password",
                children: (
                  <Form
                    form={passwordForm}
                    name="password"
                    onFinish={onPasswordFinish}
                    layout="vertical"
                  >
                    <Form.Item
                      name="oldPassword"
                      label="Old Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your old password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Enter your old password" />
                    </Form.Item>
                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your new password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Enter your new password" />
                    </Form.Item>
                    <Form.Item
                      name="confirmNewPassword"
                      label="Confirm New Password"
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your new password!",
                        },
                      ]}
                    >
                      <Input.Password placeholder="Confirm your new password" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={buttonStyle}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: "3",
                label: "Address",
                children: (
                  <Form
                    form={addressForm}
                    name="address"
                    onFinish={onAddressFinish}
                    layout="vertical"
                  >
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[
                        { required: false, message: "Please enter your name!" },
                      ]}
                    >
                      <Input placeholder="Enter your name" />
                    </Form.Item>
                    <Form.Item
                      name="phone"
                      label="Phone Number"
                      rules={[
                        {
                          required: false,
                          message: "Please enter your phone number!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>
                    <Form.Item
                      name="city"
                      label="City"
                      rules={[
                        { required: false, message: "Please select your city!" },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select your city"
                        optionFilterProp="children"
                        onChange={(value) => {
                          const city = cities.find((c) => c.name === value);
                          setSelectedCity(city?.code || null);
                          if (city) fetchDistricts(city.code);
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
                      rules={[
                        {
                          required: false,
                          message: "Please select your district!",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        placeholder="Select your district"
                        optionFilterProp="children"
                        onChange={(value) => {
                          const district = districts.find((d) => d.name === value);
                          setSelectedDistrict(district?.code || null);
                          if (district) fetchWards(district.code);
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
                      rules={[
                        { required: false, message: "Please select your ward!" },
                      ]}
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
                      rules={[
                        {
                          required: false,
                          message: "Please enter your specific address!",
                        },
                      ]}
                    >
                      <Input placeholder="Enter your specific address" />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        style={buttonStyle}
                      >
                        Save
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}