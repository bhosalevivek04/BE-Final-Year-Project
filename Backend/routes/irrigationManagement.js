// backend/routes/irrigationManagement.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Enable CORS and JSON parsing middleware for this router
router.use(cors());
router.use(bodyParser.json());

router.post("/irrigation-management", async (req, res) => {
  const { cropType, city, soilType, latitude, longitude, temperature, age, soilMoisture } = req.body;

  // Validate incoming data
  if (
    !cropType ||
    !city ||
    !soilType ||
    !latitude ||
    !longitude ||
    !temperature ||
    !age ||
    !soilMoisture
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Build dynamic prompt for irrigation management insights
    const prompt = `
For a ${cropType} farm in ${city} (${latitude}, ${longitude}) with ${soilType} soil, ${soilMoisture}% moisture, crop age ${age} days, and ${temperature}°C temperature:

Irrigation Insights:  
Assess whether irrigation is required based on the crop type, soil type, growth stage, and current soil moisture levels.  
- **Wheat:** Requires moderate irrigation; optimal soil moisture varies by soil type (Sandy: 45-55%, Loamy: 50-60%, Clay: 55-65%).  
- **Maize:** Requires moderate to high irrigation; optimal soil moisture depends on soil type (Sandy: 55-65%, Loamy: 60-70%, Clay: 65-75%).  
- **Bajra:** Has low to moderate irrigation needs; optimal soil moisture varies (Sandy: 35-45%, Loamy: 40-50%, Clay: 45-55%).  
- **Rice:** Requires high irrigation; ideal soil moisture depends on soil type (Sandy: 65-75%, Loamy: 70-80%, Clay: 75-85%).

Provide an optimal watering schedule considering crop requirements, soil properties, and temperature influence.
- Recommend appropriate irrigation frequency based on soil type (Sandy soils dry faster, requiring frequent irrigation; Clay soils retain moisture longer, reducing irrigation needs).
- Suggest practical water conservation techniques such as drip irrigation for water-efficient crops like maize and wheat, minimal watering strategies for bajra, and controlled flooding for rice.
- Highlight adjustments considering temperature variations, ensuring efficient water management to maintain ideal crop growth conditions.

Ensure recommendations are concise, actionable, and avoid symbols or bullet points.
    `;

    const apiKey = process.env.GEMINI_API_KEY;

    // Make request to Gemini API for processing
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const geminiText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received";

    console.log("Processed Irrigation Management Insights:", geminiText);

    res.status(200).json({
      message: "Irrigation management insights processed successfully.",
      insights: geminiText,
    });
  } catch (error) {
    console.error(
      "Error processing irrigation data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Error processing irrigation data. Please try again.",
      error: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;