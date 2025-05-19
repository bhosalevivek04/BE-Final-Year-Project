import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Row, Col, Card, Button, Modal, Spin, Typography, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SoilAnalysisForm from "../components/SoilAnalysisForm";

const { Title } = Typography;

const CropManagement = () => {
  const [cards, setCards] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = useMemo(() => localStorage.getItem("userId"), []);

  useEffect(() => {
    fetchData();
  }, [userId]);

  // Function to fetch updated data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const [analysesResponse, sensorResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/farmers/analyses", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`https://iot-backend-6oxx.onrender.com/api/sensor-data/user/${userId}`),
      ]);

      const sensorData = Array.isArray(sensorResponse.data) ? sensorResponse.data[0] : sensorResponse.data || {};

      const updatedCards = analysesResponse.data.map((item) => ({
        ...item,
        soilMoisture: sensorData.soilmoisture || "No data",
        temperature: sensorData.temperature || "No data",
        humidity: sensorData.humidity || "No data",
      }));

      setCards(updatedCards);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const submissionData = { ...formData, userId };

      await axios.post("http://localhost:5000/api/farmers/analyses", submissionData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsFormVisible(false);

      // ✅ Fetch fresh data from backend after submission (No page reload)
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("Failed to submit soil analysis. Please try again later.");
    }
  };

  const handleCardClick = (data) => {
    navigate(`/dashboard/analysis/${data._id || data.id}`, { state: { formData: data } });
  };

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `url('/assets/background4.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Flex justify="space-between" align="center" style={{ marginBottom: "20px" }}>
        <Title level={2} style={{ color: "#fff" }}>Soil Analysis</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsFormVisible(true)}>
          Add New Entry
        </Button>
      </Flex>

      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
          {cards.map((data) => (
            <Col xs={24} sm={12} md={8} lg={6} key={data._id || data.id}>
              <Card
                hoverable
                onClick={() => handleCardClick(data)}
                style={{
                  backdropFilter: "blur(15px)",
                  background: "rgba(255, 255, 255, 0)", // Glassmorphism effect
                  borderRadius: "15px",
                  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.2)",
                  padding: "16px",
                  minHeight: "180px",
                  transition: "transform 0.2s ease-in-out",
                }}
                bodyStyle={{
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                 
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px", color: "#fff" }}>
                  🌱 {data.cropName}
                </p>
                <p style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>
                  🏞️ Soil: {data.soilType}
                </p>
                <p style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>
                  💧 Moisture: {data.soilMoisture}
                </p>
                <p style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>
                  🌡️ Temp: {data.temperature}
                </p>
                <p style={{ fontSize: "16px", color: "#fff", fontWeight: "500" }}>
                  🌫️ Humidity: {data.humidity}
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Add Soil Analysis"
        open={isFormVisible}
        footer={null}
        onCancel={() => setIsFormVisible(false)}
        centered
        width={1000}
      >
        <SoilAnalysisForm closeForm={() => setIsFormVisible(false)} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
};

export default CropManagement;
