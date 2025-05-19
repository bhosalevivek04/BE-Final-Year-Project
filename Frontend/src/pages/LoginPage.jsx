import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Checkbox, Typography, message, Card, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, FieldTimeOutlined } from '@ant-design/icons';

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/introduction';

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/introduction', { replace: true });
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    const { identifier, password } = values;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(identifier.trim());
    const loginData = {
      password: password.trim(),
      ...(isEmail ? { email: identifier.trim() } : { mobile: identifier.trim() }),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/farmers/login', loginData, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.farmer.mobile);
        localStorage.setItem('userEmail', response.data.farmer.email);
        message.success('✅ Welcome back, Farmer!');
        navigate(from, { replace: true });
      } else {
        message.error('❌ Invalid credentials. Try again!');
      }
    } catch (err) {
      message.error(err.response?.data?.message || '❌ Login failed. Try again!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <Title level={2} style={{ textAlign: 'center' }}>🌾 Farmer Login</Title>
        <Form name="login-form" layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="📧 Email or 📱 Mobile"
            name="identifier"
            rules={[{ required: true, message: 'Enter your email or mobile!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter email or mobile" />
          </Form.Item>

          <Form.Item
            label="🔒 Password"
            name="password"
            rules={[{ required: true, message: 'Enter your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading} icon={<LoginOutlined />} style={styles.button}>
              {loading ? <Spin /> : 'Login'}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="default" onClick={() => navigate('/registration')} block icon={<FieldTimeOutlined />} style={styles.registerButton}>
              New? Register Here
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
    background: 'linear-gradient(to right, #d4fc79, #96e6a1)',
  },
  card: {
    width: 400,
    padding: '20px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '12px',
    background: '#fff',
  },
  button: {
    background: 'linear-gradient(to right, #43cea2, #185a9d)',
    border: 'none',
    color: '#fff',
  },
  registerButton: {
    background: '#f4f4f4',
    color: '#000',
  },
};

export default LoginPage;
