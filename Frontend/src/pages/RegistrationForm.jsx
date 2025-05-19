import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/farmers/register', values, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 201) {
        message.success('✅ Registration successful! Redirecting...');
        localStorage.setItem('userEmail', values.email);
        setTimeout(() => navigate('/login'), 1500);
      } else {
        message.error('❌ Registration failed. Please try again.');
      }
    } catch (error) {
      message.error(error.response?.data?.error || '❌ Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={styles.title}>🚜 Farmer Registration</Title>
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name!' }]} hasFeedback>
            <Input prefix={<UserOutlined />} placeholder="Full Name" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item name="mobile" rules={[{ required: true, pattern: /^[0-9]{10}$/, message: 'Enter a valid 10-digit number!' }]} hasFeedback>
            <Input prefix={<PhoneOutlined />} placeholder="Mobile Number" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Enter a valid email!' }]} hasFeedback>
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, min: 6, message: 'Password must be at least 6 characters!' }]} hasFeedback>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" style={styles.input} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" loading={loading} block style={styles.registerButton}>
              {loading ? 'Registering...' : '🚀 Register'}
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="default" size="large" block icon={<LoginOutlined />} onClick={() => navigate('/login')} style={styles.loginButton}>
              Already have an account? Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(to right, #74ebd5, #acb6e5)',
    padding: '20px',
  },
  card: {
    maxWidth: 400,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    padding: '20px',
    background: '#fff',
   
  },
  title: {
    color: '#333',
    marginBottom: '20px',
  },
  input: {
    borderRadius: '8px',
    padding: '10px',
  },
  registerButton: {
    background: 'linear-gradient(45deg, #4CAF50, #2E7D32)',
    border: 'none',
    color: '#fff',
  },
  loginButton: {
    background: '#f4f4f4',
    color: '#000',
    borderRadius: '8px',
  },
};

export default RegistrationForm;
