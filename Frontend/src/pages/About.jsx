import { Card, Avatar, Row, Col, Typography } from "antd";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import styles from "../styles/About.module.css"; // Using CSS module

const { Title, Text } = Typography;

const About = () => {
  const teamMembers = [
    {
      image: "/Profile/Tejas.jpg",
      name: "Tejas Sunil Nirmal",
      email: "tejasnirmal252@gmail.com",
      role: "Full Stack Developer",
      links: [
        { url: "https://www.linkedin.com/in/tejas-nirmal-89862b291/", icon: <FaLinkedin /> },
        { url: "https://github.com/TejasNirmal29", icon: <FaGithub /> },
      ],
    },
    {
      image: "/Profile/Vivek.jpeg",
      name: "Vivek Shankar Bhosale",
      email: "bhosalevivek04@gmail.com",
      role: "Backend Developer",
      links: [
        { url: "https://www.linkedin.com/in/vivekbhosale04", icon: <FaLinkedin /> },
        { url: "https://github.com/bhosalevivek04", icon: <FaGithub /> },
      ],
    },
    {
      image: "/Profile/Aayush.jpeg",
      name: "Aayush Vijay Bhakare",
      email: "aayushbhakare0000@gmail.com",
      role: "Frontend Developer",
      links: [
        { url: "", icon: <FaLinkedin /> },
        { url: "", icon: <FaGithub /> },
      ],
    },
    {
      image: "/Profile/Piyush.jpeg",
      name: "Piyush Vilas Beldar",
      email: "piyushbeldar2001@gmail.com",
      role: "Frontend Developer",
      links: [
        { url: "", icon: <FaLinkedin /> },
        { url: "", icon: <FaGithub /> },
      ],
    },
  ];

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} justify="center">
        {teamMembers.map((member, index) => (
          <Col xs={24} sm={12} md={12} lg={12} key={index}>
            <Card className={styles.card} hoverable>
              <div className={styles.cardContent}>
                <Avatar src={member.image} size={150} className={styles.avatar} />
                <div className={styles.cardBody}>
                  <Title level={4} className={styles.cardTitle}>{member.name}</Title>
                  <Text type="secondary" className={styles.cardSubtitle}>{member.email}</Text>
                  <Text className={styles.cardText}>{member.role}</Text>
                  <div className={styles.cardLinks}>
                    {member.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.cardLink}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default About;
