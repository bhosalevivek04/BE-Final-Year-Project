import React, { useState } from 'react';
import { Form, Input, Select, Button, Typography, Space, Alert } from 'antd';
import axios from 'axios';
import { EnvironmentOutlined } from '@ant-design/icons';
import '../styles/SoilAnalysisForm.css';

const { Title } = Typography;
const { Option } = Select;

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    season: '',
    area: '',
    soilType: '',
    city: '',
    latitude: '',
    longitude: '',
    temperature: '',
    date: new Date().getFullYear(),
  });
  
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);

  const seasons = ['Rabi', 'Kharif', 'Whole Year'];
  const soilTypes = ['Black', 'Red', 'Alluvial'];

  const handleInputChange = (name, value) => {
    if (name === 'area' && parseFloat(value) < 0) return;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
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
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/crop-recommendation', formData);
      setAnalysisData(response.data);
    } catch (error) {
      alert('Error submitting form. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="form-container">
      <Title level={2} className="form-title">Crop Recommendation Form</Title>
      {!analysisData ? (
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Season" required>
            <Select placeholder="Select Season" onChange={(value) => handleInputChange('season', value)}>
              {seasons.map((season) => (
                <Option key={season} value={season}>{season}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item label="Area (in hectare)" required>
            <Input type="number" min={0} step={0.01} placeholder="Enter area" onChange={(e) => handleInputChange('area', e.target.value)} />
          </Form.Item>

          <Form.Item label="Soil Type" required>
            <Select placeholder="Select Soil Type" onChange={(value) => handleInputChange('soilType', value)}>
              {soilTypes.map((soil) => (
                <Option key={soil} value={soil}>{soil}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="City">
            <Input placeholder="Enter city name" onChange={(e) => handleInputChange('city', e.target.value)} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<EnvironmentOutlined />} onClick={getCurrentLocation}>Get Current Location & Temperature</Button>
          </Form.Item>

          <Space>
            <Input placeholder="Latitude" value={formData.latitude} readOnly />
            <Input placeholder="Longitude" value={formData.longitude} readOnly />
          </Space>

          <Form.Item label="Temperature (°C)">
            <Input value={formData.temperature} readOnly />
          </Form.Item>

          <Form.Item label="Date (Year)">
            <Input value={formData.date} readOnly />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
          </Form.Item>
        </Form>
      ) : (
        <div className="analysis-result">
          <Alert message="Crop Recommendation Analysis" description={analysisData.insights} type="success" showIcon />
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
