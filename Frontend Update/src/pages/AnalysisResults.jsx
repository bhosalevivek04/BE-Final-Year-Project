import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spin, Card, Row, Col, Button, Typography, Alert } from 'antd';
import { EnvironmentOutlined, HeatMapOutlined, FieldTimeOutlined, CloudOutlined, ExperimentOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const AnalysisResults = () => {
  const location = useLocation();
  const { formData } = location.state || {};
  const [diseaseData, setDiseaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMarathi, setIsMarathi] = useState(false);

  useEffect(() => {
    if (formData?.cropName && formData?.cropAge) {
      fetchDiseaseData(formData.cropName, formData.cropAge);
    }
  }, [formData]);

  const fetchDiseaseData = async (cropName, cropAge) => {
    try {
      const response = await axios.post(
        'https://alert-and-diseases-backend.onrender.com/predict-diseases',
        { crop_name: cropName, crop_age: parseInt(cropAge) }
      );
      setDiseaseData(response.data);
    } catch (error) {
      console.error('Error fetching disease data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!formData) {
    return <Alert message="No analysis data found" type="warning" showIcon />;
  }

  const details = [
    { label: '🌾 Crop Name', value: formData.cropName, icon: <HeatMapOutlined /> },
    { label: '📅 Crop Age', value: formData.cropAge, icon: <FieldTimeOutlined /> },
    { label: '🪵 Soil Type', value: formData.soilType, icon: <CloudOutlined /> },
    { label: '🌍 Latitude', value: formData.latitude, icon: <EnvironmentOutlined /> },
    { label: '📍 Longitude', value: formData.longitude, icon: <EnvironmentOutlined /> }
  ];

  return (
    <div style={{ 
      maxWidth: 1100, 
      margin: '30px auto', 
      padding: 20, 
      borderRadius: '12px', 
      background: 'linear-gradient(to bottom, #ffffff, #f0f5ff)', 
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.1)' 
    }}>
      <Card title={<Title level={3} style={{ textAlign: 'center', color: '#1890ff' }}>🌱 Analysis Results 🌱</Title>} bordered>
        {formData.error_message && (
          <Alert message={formData.error_message} type="error" showIcon style={{ marginBottom: 20 }} />
        )}

        <Row gutter={[16, 16]}>
          {details.map((detail, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <Card 
                hoverable 
                style={{ 
                  textAlign: 'center', 
                  backgroundColor: '#f0f5ff', 
                  borderRadius: 10, 
                  transition: '0.3s',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  padding: '10px'
                }}
              >
                <div style={{ fontSize: '26px', color: '#1890ff', marginBottom: '5px' }}>{detail.icon}</div>
                <Text strong style={{ fontSize: '16px' }}>{detail.label}</Text>
                <p style={{ fontSize: '15px', fontWeight: '500', color: '#555' }}>{detail.value || 'N/A'}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="🦠 Potential Diseases & Prevention" bordered style={{ marginTop: 20 }}>
        <Button type="primary" style={{ marginBottom: 10 }} onClick={() => setIsMarathi(!isMarathi)}>
          {isMarathi ? 'Change to English' : 'Change to Marathi'}
        </Button>

        {loading ? (
          <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
        ) : diseaseData?.diseases?.diseases.length > 0 ? (
          diseaseData.diseases.diseases.map((disease, index) => (
            <Card key={index} hoverable style={{ 
              marginTop: 16, 
              borderRadius: 10, 
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
            }}>
              <Title level={4} style={{ color: '#ff4d4f' }}>
                {isMarathi ? disease.marathi_translation?.नाव : disease.name}
              </Title>
              <Text strong>{isMarathi ? 'लक्षणे:' : 'Symptoms:'}</Text>
              <p style={{ color: '#333' }}>{isMarathi ? disease.marathi_translation?.लक्षणे : disease.symptoms}</p>
              <Text strong>{isMarathi ? 'प्रतिबंध:' : 'Prevention:'}</Text>
              <p style={{ color: '#333' }}>{isMarathi ? disease.marathi_translation?.प्रतिबंध : disease.prevention}</p>
            </Card>
          ))
        ) : (
          <Alert message="No disease predictions available." type="info" showIcon />
        )}
      </Card>

      <Card title="🌿 Recommendations" bordered style={{ marginTop: 20 }}>
        <ul style={{ fontSize: '16px', fontWeight: '500', color: '#444' }}>
          <li>💧 Adjust irrigation schedule based on soil moisture levels</li>
          <li>🔍 Monitor for early signs of predicted diseases</li>
          <li>🧪 Consider soil amendments to improve nutrient content</li>
          <li>🔄 Implement crop rotation to prevent soil depletion</li>
        </ul>
      </Card>
    </div>
  );
};

export default AnalysisResults;
