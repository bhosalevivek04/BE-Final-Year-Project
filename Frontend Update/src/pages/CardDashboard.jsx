import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import '../styles/Card1.css';

const { Title, Paragraph } = Typography;

const CardDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Yield Production',
      description: 'Track and manage your crop yield production data',
      route: '/yield-production',
    },
    {
      title: 'Crop Recommendation',
      description: 'Get personalized crop recommendations based on your conditions',
      route: '/crop-recommendation',
    },
    {
      title: 'Plant Disease Diagnosis',
      description: 'Identify plant diseases and get treatment recommendations',
      route: '/plant-disease-diagnosis',
    }
    
  ];

  return (
    <div className="dashboard-container">
      <Row gutter={[16, 16]} justify="center">
        {cards.map((card, index) => (
          <Col xs={24} sm={12} md={8} lg={6} key={index}>
            <Card
              hoverable
              onClick={() => navigate(card.route)}
              style={{
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.9)',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease-in-out',
                width:"300px"
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <Title level={4} style={{ marginBottom: 10 }}>{card.title}</Title>
              <Paragraph style={{ color: '#555' }}>{card.description}</Paragraph>
              <RightOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CardDashboard;
