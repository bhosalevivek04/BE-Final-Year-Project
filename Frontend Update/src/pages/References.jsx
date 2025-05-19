import React from "react";
import { Card, Row, Col, Typography } from "antd";
import styles from "../styles/References.module.css"; // Updated to use CSS Module

const { Title, Text } = Typography;

const references = [
  {
    title: "Crop Data",
    description: "Google Drive Folder: Crop Soil Irrigation Data",
    link: "https://drive.google.com/drive/folders/1BkhYlFRN2aHc_BD9Fr03DLepj3AA6V1l",
    buttonText: "Access Data",
  },
  {
    title: "Soil Moisture Study",
    description:
      "Impact of Soil Moisture on Crop Yields in Major Rainfed Growing Regions of Peninsular India",
    link: "https://www.researchgate.net/publication/353087392_Impact_of_Soil_Moisture_on_Crop_Yields_in_Major_Rainfed_Growing_Regions_of_Peninsular_India",
    buttonText: "Read Study",
  },
  {
    title: "Yield Study",
    description:
      "Impact of Soil Moisture Data Characteristics on the Sensitivity to Crop Yields Under Drought and Excess Moisture Conditions",
    link: "https://www.mdpi.com/2072-4292/11/4/372",
    buttonText: "View Article",
  },
];

const References = () => {
  return (
    <main className={styles.referencePage}>
      <Title level={1} className={styles.pageTitle}>References</Title>
      <Row gutter={[24, 24]} justify="center">
        {references.map((ref, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card className={styles.referenceCard} hoverable>
              <Title level={4} className={styles.cardTitle}>{ref.title}</Title>
              <Text className={styles.cardDescription}>{ref.description}</Text>
              <br />
              <a
                href={ref.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardButton}
              >
                {ref.buttonText}
              </a>
            </Card>
          </Col>
        ))}
      </Row>
    </main>
  );
};

export default References;
