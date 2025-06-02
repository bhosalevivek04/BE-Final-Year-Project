import React, { useState } from 'react';
import { Form, Input, Select, Button, Typography, Space, Alert } from 'antd';
import axios from 'axios';
import { EnvironmentOutlined } from '@ant-design/icons';
import '../styles/SoilAnalysisForm.css';

const { Title } = Typography;
const { Option } = Select;

const cropTypes = ['Wheat', 'Bajra', 'Rice', 'Maize'];
const seasons = ['Rabi', 'Kharif', 'Whole Year'];
const soilTypes = ['Red', 'Black', 'Alluvial'];

const YieldProductionForm = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    season: '',
    area: '',
    soilType: '',
    city: '',
    latitude: '',
    longitude: '',
    temperature: '',
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    age: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const ahmednagarCities = [
    "Ahmednagar", "Akole ", "Bhandardara", "Bhingar", "Deolali Pravara",
    "Ghulewadi", "Guruwar Peth", "Jamkhed ", "Kopargaon", "Kopargaon ",
    "Loni, Ahmednagar", "Meherabad", "Miri, Ahmednagar", "Nagapur", "Nagar ",
    "Nevasa", "Nevasa ", "Nighoj", "Parner ", "Pathardi", "Pathardi ",
    "Puntamba", "Rahata ", "Rahta Pimplas", "Rahuri", "Rahuri ", "Sangamner",
    "Shevgaon", "Shevgaon ", "Shirdi", "Shrigonda", "Shrigonda ",
    "Shrirampur", "Shrirampur (Rural)", "Shrirampur ", "Siddhatek", "Singnapur",
    "Takali Dhokeshwar", "Tisgaon"
  ];

  const handleInputChange = (name, value) => {
    if ((name === 'area' || name === 'age') && parseFloat(value) < 0) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=d887d60da51df1eb3236014a853b63bc`)
            .then((res) => res.json())
            .then((data) => {
              setFormData((prevState) => ({
                ...prevState,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                temperature: data.main.temp,
              }));
            })
            .catch((error) => console.error('Error fetching temperature:', error));
        },
        (error) => alert('Unable to retrieve location. Please check your device settings.')
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleSubmit = async () => {
    // Simple validation
    const requiredFields = [
      'cropType', 'season', 'area', 'soilType', 'city',
      'latitude', 'longitude', 'temperature', 'date', 'age'
    ];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field] === '') {
        alert(`Please fill the ${field} field.`);
        setLoading(false);
        return;
      }
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/yield-production', {
        cropType: formData.cropType,
        season: formData.season,
        area: parseFloat(formData.area),
        soilType: formData.soilType,
        city: formData.city,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        temperature: parseFloat(formData.temperature),
        date: formData.date,
        age: parseInt(formData.age)
      });
      setPrediction(response.data);
    } catch (error) {
      alert('Error getting prediction. Please check inputs.');
    }
    setLoading(false);
  };

  return (
    <div className="form-container" style={{ maxWidth: 420, margin: "0 auto" }}>
      <Title level={2} className="form-title" style={{ textAlign: "center" }}>
        Crop Yield Prediction
      </Title>
      {!prediction ? (
        <Form layout="vertical" onFinish={handleSubmit} size="large" style={{ width: "100%" }}>
          <Form.Item label="Crop Type" required>
            <Select
              placeholder="Select Crop"
              value={formData.cropType}
              onChange={(value) => handleInputChange('cropType', value)}
              style={{ width: "100%" }}
              size="large"
            >
              {cropTypes.map((crop) => (
                <Option key={crop} value={crop}>{crop}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Season" required>
            <Select
              placeholder="Select Season"
              value={formData.season}
              onChange={(value) => handleInputChange('season', value)}
              style={{ width: "100%" }}
              size="large"
            >
              {seasons.map((season) => (
                <Option key={season} value={season}>{season}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Area (hectares)" required>
            <Input
              type="number"
              min={0}
              step={0.01}
              placeholder="Enter area"
              value={formData.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Soil Type" required>
            <Select
              placeholder="Select Soil Type"
              value={formData.soilType}
              onChange={(value) => handleInputChange('soilType', value)}
              style={{ width: "100%" }}
              size="large"
            >
              {soilTypes.map((soil) => (
                <Option key={soil} value={soil}>{soil}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="City" required>
            <Select
              showSearch
              placeholder="Select city"
              value={formData.city}
              onChange={(value) => handleInputChange('city', value)}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: "100%" }}
              size="large"
            >
              {ahmednagarCities.map((city) => (
                <Option key={city} value={city}>{city}</Option>
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
              size="large"
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
              size="large"
            />
            <Input
              placeholder="Longitude"
              value={formData.longitude}
              readOnly
              style={{ width: "49%" }}
              size="large"
            />
          </Space>

          <Form.Item label="Temperature (°C)">
            <Input
              value={formData.temperature}
              placeholder="Auto-filled from location"
              readOnly
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Date">
            <Input
              type="date"
              value={formData.date}
              onChange={e => handleInputChange('date', e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>

          <Form.Item label="Age (in Days)" required>
            <Input
              type="number"
              min={0}
              placeholder="Enter age in days"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{ fontWeight: 600 }}
            >
              {loading ? 'Predicting...' : 'Predict Yield'}
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="prediction-results">
          <Alert
            message="Prediction Results"
            description={
              <div>
                <h4>Yield Estimate</h4>
                {prediction.avgYieldPerHectare && prediction.totalYield ? (
                  <>
                    <p>
                      <strong>Average Yield per Hectare:</strong> {prediction.avgYieldPerHectare} tonnes/ha
                    </p>
                    <p>
                      <strong>Total Yield:</strong> {prediction.totalYield} tonnes
                    </p>
                  </>
                ) : (
                  <p>No prediction data available.</p>
                )}
                <h4>Insights</h4>
                {prediction.insights ? (
                  <p>{prediction.insights}</p>
                ) : (
                  <p>No insights available.</p>
                )}
              </div>
            }
            type="success"
            showIcon
          />
        </div>
      )}
    </div>
  );
};

export default YieldProductionForm;