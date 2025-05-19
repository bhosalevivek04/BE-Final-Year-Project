import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Button, Avatar, Drawer } from 'antd';
import { UserOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { NavLink, useNavigate } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('authToken'));

  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  const handleMenuClick = (key) => {
    setActiveKey(key);
  };

  const menuItems = [
    { key: '1', label: 'Home', path: '/introduction' },
    { key: '2', label: 'Crop Management', path: '/Cropmanagement' },
    { key: '3', label: 'Services', path: '/services' },
    { key: '4', label: 'Dashboard', path: '/dashboard' },
    { key: '5', label: 'Information', path: '/information' },
    { key: '6', label: 'References', path: '/references' },
    { key: '7', label: 'About', path: '/about' },
  ];

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header style={styles.header}>
        {/* Sidebar Toggle Button */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: '20px', color: '#fff' }} />}
          onClick={() => setVisible(true)}
          style={styles.menuButton}
        />

        {/* Logo */}
        <div className="logo" style={styles.logo}>
          <NavLink to="/" style={{ fontWeight: 'bold', color: '#ffffff', fontSize: '20px', textDecoration: 'none' }}>
            AgroSolutions
          </NavLink>
        </div>

        {/* Navigation Menu */}
        <Menu mode="horizontal" style={styles.menu}>
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              style={activeKey === item.key ? styles.activeNavLink : styles.navLink}
            >
              <NavLink to={item.path} style={activeKey === item.key ? styles.activeNavLink : styles.navLink}>
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>

        {/* User Dropdown or Login */}
        {isLoggedIn ? (
          <Dropdown overlay={userMenu} placement="bottomRight" arrow>
            <Avatar icon={<UserOutlined />} style={styles.avatar} />
          </Dropdown>
        ) : (
          <Button type="primary" onClick={() => navigate('/login')} style={styles.loginButton}>
            Login
          </Button>
        )}
      </Header>

      {/* Sidebar (Drawer) */}
      <Drawer
        title="Menu"
        placement="left"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu theme="light" mode="vertical">
          {menuItems.map((item) => (
            <Menu.Item
              key={item.key}
              onClick={() => handleMenuClick(item.key)}
              style={activeKey === item.key ? styles.activeNavLink : styles.navLink}
            >
              <NavLink to={item.path} style={activeKey === item.key ? styles.activeNavLink : styles.navLink}>
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
        {isLoggedIn && (
          <Button block type="default" icon={<LogoutOutlined />} onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </Button>
        )}
      </Drawer>
    </Layout>
  );
};

const styles = {
  header: {
    background: '#22b13a', // Earthy Green
    color: '#ffffff',
    padding: '0px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    width: '100%',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '22px',
    whiteSpace: 'nowrap',
  },
  menu: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    background: 'transparent',
    fontWeight: 'bold',
    color: 'white',
  },
  navLink: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px',
    padding: '0 10px',
    transition: 'color 0.3s',
    textDecoration: 'none', // ✅ Removes underline
  },
  activeNavLink: {
    color: 'white', // Change color on click
    fontWeight: 'bold',
    fontSize: '20px',
    padding: '0 10px',
    transition: 'color 0.3s',
    textDecoration: 'none', // ✅ Ensures no underline
  },
  avatar: {
    cursor: 'pointer',
    backgroundColor: '#ffffff',
    color: '#22b13a',
  },
  loginButton: {
    fontWeight: 'bold',
    backgroundColor: '#ffffff',
    color: '#22b13a',
    border: 'none',
  },
  menuButton: {
    marginRight: '10px',
    display: 'none',
  },
  sidebar: {
    padding: '10px',
  },
  logoutButton: {
    marginTop: '10px',
    width: '100%',
  },
};

// Responsive Styles
styles.menuButton['@media (max-width: 768px)'] = {
  display: 'inline-block',
};
styles.menu['@media (max-width: 768px)'] = {
  display: 'none',
};

export default Navbar;
