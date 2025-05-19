// backend/routes/yieldProduction.js
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

router.post("/yield-production", async (req, res) => {
  const { cropType, season, area, soilType, city, latitude, longitude, temperature, date, age } = req.body;

  // Validate incoming data
  if (
    !cropType ||
    !season ||
    !area ||
    !soilType ||
    !city ||
    !latitude ||
    !longitude ||
    !temperature ||
    !date ||
    !age
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    let avgYieldPerHectare;

    // Assign average yield per hectare based on crop type
    switch (cropType.toLowerCase()) {
      case "wheat":
        avgYieldPerHectare = 3.0; // Average yield in tons per hectare
        break;
      case "bajra":
        avgYieldPerHectare = 1.25;
        break;
      case "rice":
        avgYieldPerHectare = 3.5;
        break;
      case "maize":
        avgYieldPerHectare = 3.0;
        break;
      default:
        return res.status(400).json({ message: "Unsupported crop type." });
    }

    // Calculate total yield with a small random variation
    const variation = (Math.random() * 1.2) - 0.6;
    const totalYield = (avgYieldPerHectare * area) + variation;

    // Define list of Ahmednagar district cities
    const ahmednagarCities = [
      "Ahmednagar", "Akole taluka", "Bhandardara", "Bhingar", "Deolali Pravara",
      "Ghulewadi", "Guruwar Peth", "Jamkhed taluka", "Kopargaon", "Kopargaon taluka",
      "Loni, Ahmednagar", "Meherabad", "Miri, Ahmednagar", "Nagapur", "Nagar taluka",
      "Nevasa", "Nevasa taluka", "Nighoj", "Parner taluka", "Pathardi", "Pathardi taluka",
      "Puntamba", "Rahata taluka", "Rahta Pimplas", "Rahuri", "Rahuri taluka", "Sangamner",
      "Shevgaon", "Shevgaon taluka", "Shirdi", "Shrigonda", "Shrigonda taluka",
      "Shrirampur", "Shrirampur (Rural)", "Shrirampur taluka", "Siddhatek", "Singnapur",
      "Takali Dhokeshwar", "Tisgaon"
    ];

    // Build dynamic prompt
    const prompt = `
First, check if ${city} is in Ahmednagar district by verifying against the following list: 
${ahmednagarCities.join(", ")}.

If ${city} is in Ahmednagar district, provide the result in the following format:

Output Format:
Crop Type: ${cropType}
Location: ${city}
Area: ${area} hectares
Estimated Total Yield: ${totalYield.toFixed(2)} tons

Insights:
- Ensure timely irrigation to maintain soil moisture and support healthy crop growth.
- Use appropriate fertilizers and pesticides to enhance plant nutrition and protect against pests.
- Monitor weather conditions and take preventive measures to mitigate the effects of climate change.
- Rotate crops or adopt sustainable farming practices to improve soil fertility and long-term yield.

If ${city} is **not** in Ahmednagar district, return the following message instead:

"We do not have information for ${city} as it is outside Ahmednagar district."

**Ensure all numerical values remain in numeric format (e.g., "10" instead of "ten", "30.54" instead of "thirty point fifty four").**

Please generate the output strictly in the given format.
    `;

    const apiKey = process.env.GEMINI_API_KEY;

    // Make request to Gemini API for processing
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const geminiText =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received";

    console.log("Processed Yield Production Insights:", geminiText);

    res.status(200).json({
      // message: "Data processed successfully.",
      avgYieldPerHectare: avgYieldPerHectare.toFixed(2),
      totalYield: totalYield.toFixed(2),
      insights: geminiText,
    });
  } catch (error) {
    console.error(
      "Error processing yield production data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Error processing data. Please try again.",
      error: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;