import React, { useState } from "react";
import { InboxOutlined, SendOutlined, SmileOutlined, RobotOutlined } from "@ant-design/icons";
import { Upload, Button, Card, Input, Typography, message, Row, Col, Avatar } from "antd";
import axios from "axios";

const { Dragger } = Upload;
const { Text } = Typography;

const PlantDiseaseDiagnosis = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = ({ file, onSuccess }) => {
    if (!file.type.startsWith("image/")) {
      message.error("📸 Only image files are allowed!");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    onSuccess("File uploaded successfully.");
  };

  const handleDiagnosis = async () => {
    if (!image) {
      message.error("🖼️ Please upload an image first.");
      return;
    }

    setLoading(true);
    setDiagnosis("");
    const formData = new FormData();
    formData.append("image", image);

    try {
      const { data } = await axios.post("http://127.0.0.1:5002/diagnose", formData);
      setDiagnosis(data.disease);
      addToChat("user", `🌱 My plant's issue: ${data.disease}`);
      const chatResponse = await axios.post("http://127.0.0.1:5002/chat", { message: data.disease });
      addToChat("bot", `🤖 ${chatResponse.data.response}`);
    } catch (error) {
      message.error("⚠️ Error occurred while diagnosing.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    addToChat("user", `😊 ${chatInput}`);
    setChatInput("");

    try {
      const { data } = await axios.post("http://127.0.0.1:5002/chat", { message: chatInput });
      addToChat("bot", `🤖 ${data.response}`);
    } catch {
      message.error("⚠️ Failed to get response from the server.");
    }
  };

  const addToChat = (sender, message) => {
    setChatHistory((prev) => [...prev, { sender, message }]);
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh", padding: "20px" }}>
      <Col xs={24} lg={20}>
        <Row gutter={20}>
          <Col xs={24} md={12}>
            <Card title="🌿 Plant Disease Diagnosis" bordered>
              <Dragger customRequest={handleUpload} showUploadList={false}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
                </p>
                <p className="ant-upload-text">Click or drag an image to upload 📷</p>
              </Dragger>
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: "50%", display: "block", margin: "15px auto" }} />}
              <Button type="primary" block onClick={handleDiagnosis} style={{ marginTop: "15px" }} loading={loading}>
                🔍 Diagnose
              </Button>
              {diagnosis && <Text strong style={{ display: "block", marginTop: "15px" }}>🩺 Diagnosis: {diagnosis}</Text>}
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="💬 Chatbot" bordered>
              <div style={{ maxHeight: "400px", overflowY: "auto", padding: "10px", background: "#f9f9f9", borderRadius: "8px", display: "flex", flexDirection: "column" }}>
                {chatHistory.map((chat, index) => (
                  <div key={index} style={{ display: "flex", justifyContent: chat.sender === "user" ? "flex-end" : "flex-start", marginBottom: "12px" }}>
                    <Avatar icon={chat.sender === "user" ? <SmileOutlined /> : <RobotOutlined />} style={{ marginRight: "8px" }} />
                    <div style={{ maxWidth: "75%", padding: "10px", borderRadius: "12px", wordBreak: "break-word", background: chat.sender === "user" ? "#d1e7dd" : "#ffffff", boxShadow: "0px 2px 10px rgba(0,0,0,0.1)", position: "relative" }}>
                      {chat.message}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Type a message..." style={{ flex: 1, borderRadius: "8px" }} />
                <Button type="primary" icon={<SendOutlined />} onClick={handleChatSubmit} style={{ borderRadius: "8px" }} />
              </div>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default PlantDiseaseDiagnosis;
