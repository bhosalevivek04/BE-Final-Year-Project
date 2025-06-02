import React, { useState } from "react";
import { Form, Input, Select, Button, Typography, Space, Alert } from "antd";
import axios from "axios";
import { EnvironmentOutlined } from "@ant-design/icons";
import "../styles/SoilAnalysisForm.css";

const { Title } = Typography;
const { Option } = Select;

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    season: "",
    area: "",
    soilType: "",
    city: "",
    latitude: "",
    longitude: "",
    temperature: "",
    date: new Date().getFullYear(),
  });

  const ahmednagarCities = [
    "Ahmednagar",
    "Akole taluka",
    "Bhandardara",
    "Bhingar",
    "Deolali Pravara",
    "Ghulewadi",
    "Guruwar Peth",
    "Jamkhed taluka",
    "Kopargaon",
    "Kopargaon taluka",
    "Loni, Ahmednagar",
    "Meherabad",
    "Miri, Ahmednagar",
    "Nagapur",
    "Nagar taluka",
    "Nevasa",
    "Nevasa taluka",
    "Nighoj",
    "Parner taluka",
    "Pathardi",
    "Pathardi taluka",
    "Puntamba",
    "Rahata taluka",
    "Rahta Pimplas",
    "Rahuri",
    "Rahuri taluka",
    "Sangamner",
    "Shevgaon",
    "Shevgaon taluka",
    "Shirdi",
    "Shrigonda",
    "Shrigonda taluka",
    "Shrirampur",
    "Shrirampur (Rural)",
    "Shrirampur taluka",
    "Siddhatek",
    "Singnapur",
    "Takali Dhokeshwar",
    "Tisgaon",
  ];
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  const seasons = ["Rabi", "Kharif", "Whole Year"];
  const soilTypes = ["Black", "Red", "Alluvial"];

  const handleInputChange = (name, value) => {
    if (name === "area" && parseFloat(value) < 0) return;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=d887d60da51df1eb3236014a853b63bc`
          )
            .then((res) => res.json())
            .then((data) => {
              setFormData((prevState) => ({
                ...prevState,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                temperature: data.main.temp,
              }));
            })
            .catch((error) =>
              console.error("Error fetching temperature:", error)
            );
        },
        (error) =>
          alert(
            "Unable to retrieve location. Please check your device settings."
          )
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/crop-recommendation",
        formData
      );
      setAnalysisData(response.data);
    } catch (error) {
      alert("Error submitting form. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="form-container" style={{ maxWidth: 420, margin: "0 auto" }}>
      <Title level={2} className="form-title" style={{ textAlign: "center" }}>
        Crop Recommendation Form
      </Title>
      {!analysisData ? (
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          size="large"
          style={{ width: "100%" }}
        >
          <Form.Item label="Season" required>
            <Select
              placeholder="Select Season"
              value={formData.season}
              onChange={(value) => handleInputChange("season", value)}
              style={{ width: "100%" }}
            >
              {seasons.map((season) => (
                <Option key={season} value={season}>
                  {season}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Area (in hectare)" required>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="Enter area"
              value={formData.area}
              onChange={(e) => handleInputChange("area", e.target.value)}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Soil Type" required>
            <Select
              placeholder="Select Soil Type"
              value={formData.soilType}
              onChange={(value) => handleInputChange("soilType", value)}
              style={{ width: "100%" }}
            >
              {soilTypes.map((soil) => (
                <Option key={soil} value={soil}>
                  {soil}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="City" required>
            <Select
              showSearch
              placeholder="Select city"
              value={formData.city}
              onChange={(value) => handleInputChange("city", value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: "100%" }}
            >
              {ahmednagarCities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              icon={<EnvironmentOutlined />}
              onClick={getCurrentLocation}
              block
              style={{ marginBottom: 8 }}
            >
              Get Current Location & Temperature
            </Button>
          </Form.Item>

          <Space style={{ width: "100%", marginBottom: 16 }}>
            <Input
              placeholder="Latitude"
              value={formData.latitude}
              readOnly
              style={{ width: "49%" }}
            />
            <Input
              placeholder="Longitude"
              value={formData.longitude}
              readOnly
              style={{ width: "49%" }}
            />
          </Space>

          <Form.Item label="Temperature (°C)">
            <Input
              value={formData.temperature}
              placeholder="Auto-filled from location"
              readOnly
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Date (Year)">
            <Input
              value={formData.date}
              readOnly
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{ fontWeight: 600 }}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="analysis-result">
          <Alert
            message="Crop Recommendation Analysis"
            description={analysisData.insights}
            type="success"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
