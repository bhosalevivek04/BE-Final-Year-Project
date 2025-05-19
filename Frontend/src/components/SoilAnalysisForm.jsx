import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Form, Input, Select, Button, InputNumber, message, Modal, Spin, Card } from "antd";
import axios from "axios";
import { EnvironmentOutlined } from "@ant-design/icons";

const { Option } = Select;

const SoilAnalysisForm = ({ closeForm }) => {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm();

  function ResetCenter() {
    const map = useMap();
    map.setView(position, map.getZoom());
    return null;
  }

  function MapClickHandler() {
    useMapEvents({
      click(event) {
        const { lat, lng } = event.latlng;
        setPosition([lat, lng]);
        form.setFieldsValue({ latitude: lat, longitude: lng });
      },
    });
    return null;
  }

  const handleAutoCoordinates = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          form.setFieldsValue({ latitude, longitude });
          setLoadingLocation(false);
        },
        () => {
          message.error("Failed to get location. Please try again.");
          setLoadingLocation(false);
        }
      );
    } else {
      message.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      message.error("User not found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/farmers/analyses", { ...values, userId });

      if (response.status === 200 || response.data.success) {
        setIsModalVisible(true);
        form.resetFields();
        setTimeout(() => {
          setIsModalVisible(false);
          closeForm();
        }, 2000);
      } else {
        message.error("Failed to submit soil analysis. Please try again later.");
      }
    } catch (error) {
      message.error("Error submitting form. Please check your input.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card bordered style={{ maxWidth: 500, margin: "auto", padding: 20, borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>🌾 Soil Analysis Form</h2>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Crop Name" name="cropName" rules={[{ required: true, message: "Please select a crop!" }]}>
          <Select placeholder="Select Crop">
            <Option value="Wheat">Wheat</Option>
            <Option value="Rice">Rice</Option>
            <Option value="Maize">Maize</Option>
            <Option value="Cotton">Cotton</Option>
            <Option value="Sugarcane">Sugarcane</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Soil Type" name="soilType" rules={[{ required: true, message: "Please select a soil type!" }]}>
          <Select placeholder="Select Soil Type">
            <Option value="Black">Black</Option>
            <Option value="Red">Red</Option>
            <Option value="Alluvial">Alluvial</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Latitude" name="latitude" rules={[{ required: true, message: "Latitude is required!" }]}>
          <Input placeholder="Enter Latitude or use Map" />
        </Form.Item>

        <Form.Item label="Longitude" name="longitude" rules={[{ required: true, message: "Longitude is required!" }]}>
          <Input placeholder="Enter Longitude or use Map" />
        </Form.Item>

        <Button type="dashed" onClick={handleAutoCoordinates} loading={loadingLocation} block icon={<EnvironmentOutlined />}>📍 Get Current Location</Button>

        <Form.Item label="Crop Age (in days)" name="cropAge" rules={[{ required: true, message: "Please enter crop age!" }]}>
          <InputNumber min={1} max={365} style={{ width: "100%" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={isSubmitting}>
          🌱 Analyze
        </Button>
      </Form>

      <MapContainer center={position} zoom={13} style={{ height: "300px", width: "100%", marginTop: "20px", borderRadius: "8px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position}><Popup>Your selected location</Popup></Marker>
        <ResetCenter />
        <MapClickHandler />
      </MapContainer>

      <Modal title="✅ Submission Successful" open={isModalVisible} onOk={closeForm} onCancel={closeForm} centered>
        <p>Your soil analysis request has been submitted successfully! 🎉</p>
      </Modal>
    </Card>
  );
};

export default SoilAnalysisForm;