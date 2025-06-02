import React, { useState } from "react";
import { InboxOutlined, SendOutlined, SmileOutlined, RobotOutlined, TranslationOutlined } from "@ant-design/icons";
import { Upload, Button, Card, Input, Typography, message, Row, Col, Avatar, Divider, Switch, Space } from "antd";
import axios from "axios";

const { Dragger } = Upload;
const { Title, Text } = Typography;

const PlantDiseaseDiagnosis = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMarathi, setIsMarathi] = useState(false); // NEW

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
    setError("");
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post("http://127.0.0.1:5002/diagnose", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let disease = response.data.disease;

      // If Marathi is selected, translate the disease name to Marathi only (no explanation)
      if (isMarathi) {
        const translatePrompt = `फक्त मराठी रोगाचे वाक्य म्हणून सांगा: "${disease}". कोणतीही इंग्रजी, स्पष्टीकरण, किंवा अतिरिक्त माहिती देऊ नका.`;
        const translateResponse = await axios.post("http://127.0.0.1:5002/chat", { message: translatePrompt });
        // Take only the first line/word, in case the model adds extra info
        disease = translateResponse.data.response.split(/[.\n]/)[0].trim();
      }

      setDiagnosis(disease);

      // Automatically send the diagnosis to the chatbot
      setChatHistory((prev) => [...prev, { sender: "user", message: disease }]);
      const chatPrompt = isMarathi
        ? `I have detected the following plant disease with image data: ${disease}. Please provide advice or information for this disease. Reply in Marathi.`
        : `I have detected the following plant disease with image data: ${disease}. Please provide advice or information for this disease.`;
      const chatResponse = await axios.post(
        "http://127.0.0.1:5002/chat",
        { message: chatPrompt }
      );
      setChatHistory((prev) => [...prev, { sender: "bot", message: chatResponse.data.response }]);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setError("");
    setChatHistory((prev) => [...prev, { sender: "user", message: chatInput }]);
    setChatInput("");

    try {
      const chatPrompt = isMarathi
        ? `${chatInput} (Reply in Marathi)`
        : chatInput;
      const response = await axios.post("http://127.0.0.1:5002/chat", { message: chatPrompt });
      setChatHistory((prev) => [...prev, { sender: "bot", message: response.data.response }]);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f8fb", padding: "40px 0" }}>
      <Row justify="center" align="top">
        <Col xs={24} lg={20}>
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              padding: 0,
              background: "#fff",
            }}
          >
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <div style={{ padding: "32px 24px" }}>
                  <Title level={2} style={{ marginBottom: 0, color: "#1890ff" }}>
                    🌱 Plant Disease Diagnosis
                  </Title>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    Upload a plant image to detect possible diseases.
                  </Text>
                  <Divider />
                  <Dragger customRequest={handleUpload} showUploadList={false} style={{ marginBottom: 16 }}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
                    </p>
                    <p className="ant-upload-text">Click or drag an image to upload</p>
                  </Dragger>
                  {imagePreview && (
                    <div style={{ textAlign: "center", margin: "20px 0" }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: "60%",
                          maxHeight: "220px",
                          objectFit: "contain",
                          border: "1px solid #eee",
                          borderRadius: 8,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                      />
                    </div>
                  )}
                  <Button
                    type="primary"
                    block
                    onClick={handleDiagnosis}
                    style={{ marginTop: 10, fontWeight: 600, fontSize: 16 }}
                    loading={loading}
                  >
                    Diagnose
                  </Button>
                  {diagnosis && (
                    <Text strong style={{ display: "block", marginTop: 24, fontSize: 17, color: "#52c41a" }}>
                      🩺 Diagnosis: {diagnosis}
                    </Text>
                  )}
                  {error && (
                    <Text type="danger" style={{ marginTop: 16, display: "block" }}>
                      ⚠️ {error}
                    </Text>
                  )}
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div style={{ padding: "32px 24px", height: "100%" }}>
                  <Space align="center" style={{ marginBottom: 8 }}>
                    <Title level={2} style={{ marginBottom: 0, color: "#1890ff", display: "inline-block" }}>
                      🤖 Plant Doctor Chatbot
                    </Title>
                    <Switch
                      checked={isMarathi}
                      onChange={setIsMarathi}
                      checkedChildren="Marathi"
                      unCheckedChildren="English"
                      style={{ marginLeft: 16 }}
                    />
                  </Space>
                  <Text type="secondary" style={{ fontSize: 16 }}>
                    Ask questions or get advice about plant diseases.
                  </Text>
                  <Divider />
                  <div
                    style={{
                      maxHeight: "340px",
                      overflowY: "auto",
                      padding: "10px",
                      background: "#f9f9f9",
                      borderRadius: "8px",
                      marginBottom: 16,
                      minHeight: 120,
                      border: "1px solid #f0f0f0",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {chatHistory.length === 0 && (
                      <Text type="secondary" style={{ textAlign: "center", width: "100%" }}>
                        Start a conversation about plant health!
                      </Text>
                    )}
                    {chatHistory.map((chat, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: chat.sender === "user" ? "flex-end" : "flex-start",
                          marginBottom: "12px",
                        }}
                      >
                        <Avatar
                          icon={chat.sender === "user" ? <SmileOutlined /> : <RobotOutlined />}
                          style={{
                            marginRight: chat.sender === "user" ? 0 : 8,
                            marginLeft: chat.sender === "user" ? 8 : 0,
                            background: chat.sender === "user" ? "#d1e7dd" : "#e6f7ff",
                          }}
                        />
                        <div
                          style={{
                            maxWidth: "75%",
                            padding: "10px",
                            borderRadius: "12px",
                            wordBreak: "break-word",
                            background: chat.sender === "user" ? "#e6fffb" : "#fff",
                            boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
                            fontSize: 15,
                          }}
                        >
                          {chat.message}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={isMarathi ? "रोगाचे नाव किंवा प्रश्न टाका..." : "Type a message or disease name..."}
                      style={{ flex: 1, borderRadius: "8px" }}
                      onPressEnter={handleChatSubmit}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={handleChatSubmit}
                      style={{ borderRadius: "8px" }}
                    />
                  </div>
                  {error && (
                    <Text type="danger" style={{ marginTop: "10px", textAlign: "center", display: "block" }}>
                      ⚠️ {error}
                    </Text>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlantDiseaseDiagnosis;
