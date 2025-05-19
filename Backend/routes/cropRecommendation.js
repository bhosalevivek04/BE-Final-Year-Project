// // backend/routes/cropRecommendation.js
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const axios = require("axios");
// const dotenv = require("dotenv");

// dotenv.config();

// const router = express.Router();

// // Enable CORS and JSON parsing middleware for this router
// router.use(cors());
// router.use(bodyParser.json());

// router.post("/crop-recommendation", async (req, res) => {
//   const { season, area, soilType, city, latitude, longitude, temperature, date } = req.body;

//   // Validate incoming data
//   if (!season || !area || !soilType || !city || !latitude || !longitude || !temperature || !date) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     // Define list of Ahmednagar district cities
//     const ahmednagarCities = [
//       "Ahmednagar", "Akole taluka", "Bhandardara", "Bhingar", "Deolali Pravara",
//       "Ghulewadi", "Guruwar Peth", "Jamkhed taluka", "Kopargaon", "Kopargaon taluka",
//       "Loni, Ahmednagar", "Meherabad", "Miri, Ahmednagar", "Nagapur", "Nagar taluka",
//       "Nevasa", "Nevasa taluka", "Nighoj", "Parner taluka", "Pathardi", "Pathardi taluka",
//       "Puntamba", "Rahata taluka", "Rahta Pimplas", "Rahuri", "Rahuri taluka", "Sangamner",
//       "Shevgaon", "Shevgaon taluka", "Shirdi", "Shrigonda", "Shrigonda taluka",
//       "Shrirampur", "Shrirampur (Rural)", "Shrirampur taluka", "Siddhatek", "Singnapur",
//       "Takali Dhokeshwar", "Tisgaon"
//     ];

//     // Build dynamic prompt for crop recommendation
//     const prompt = `
// First, check if ${city} is in Ahmednagar district by verifying against the following list: 
// ${ahmednagarCities.join(", ")}.

// If ${city} is in Ahmednagar district, provide the result in the following format:

// For a farm located in ${city} with an area of ${area} hectares during the ${season} season, with ${soilType} soil and an average temperature of ${parseFloat(temperature).toFixed(2)}°C, recommend the most suitable crop among wheat, maize, bajra, and rice for optimum yield production.

// For a farm located in ${city} with an area of ${area} hectares during the ${season} season, with ${soilType} soil and an average temperature of ${parseFloat(temperature / 100).toFixed(2)}°C, recommend the most suitable crop among wheat, maize, bajra, and rice for optimum yield production.

// Insights:
// 1. Consider the local climate, soil type, and seasonal conditions.
// 2. Provide a concise recommendation along with a brief explanation of why the recommended crop is best suited based on typical agronomic data.
// 3. Do not reveal any internal calculation details.
// 4. Provide output without any symbols, number allowed and full stop also allowed.
// 5. Use number to give proper result.

// If ${city} is **not** in Ahmednagar district, return the following message instead:

// "We do not have information for ${city} as it is outside Ahmednagar district."

// **Ensure all numerical values remain in numeric format (e.g., "10" instead of "ten", "30.54" instead of "thirty point fifty four").**

// Please generate the output strictly in the given format.
//     `;

//     const apiKey = process.env.GEMINI_API_KEY;

//     // Make request to Gemini API for processing
//     const geminiResponse = await axios.post(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
//       {
//         contents: [{ parts: [{ text: prompt }] }],
//       },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     const geminiText =
//       geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
//       "No response received";

//     console.log("Processed Crop Recommendation Insights:", geminiText);

//     res.status(200).json({
//       message: "Crop recommendation processed successfully.",
//       insights: geminiText,
//     });
//   } catch (error) {
//     console.error(
//       "Error processing crop recommendation data:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({
//       message: "Error processing crop recommendation data. Please try again.",
//       error: error.response ? error.response.data : error.message,
//     });
//   }
// });

// module.exports = router;


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

router.post("/crop-recommendation", async (req, res) => {
  const { season, area, soilType, city, latitude, longitude, temperature, date } = req.body;

  // Validate incoming data
  if (!season || !area || !soilType || !city || !latitude || !longitude || !temperature || !date) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
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

    // Build dynamic prompt using the temperature as provided by the frontend
    const prompt = `
First, check if ${city} is in Ahmednagar district by verifying against the following list: 
${ahmednagarCities.join(", ")}.

If ${city} is in Ahmednagar district, provide the result in the following format:

For a farm located in ${city} with an area of ${area} hectares during the ${season} season, with ${soilType} soil and an average temperature of ${temperature} degrees Celsius, recommend the most suitable crop among wheat, maize, bajra, and rice for optimum yield production.

Insights:
1. Consider the local climate, soil type, and seasonal conditions.
2. Provide a concise recommendation along with a brief explanation of why the recommended crop is best suited based on typical agronomic data.
3. Do not reveal any internal calculation details.
4.Do not use bold characters.
5. Use number to give proper result.

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

    console.log("Processed Crop Recommendation Insights:", geminiText);

    res.status(200).json({
      message: "Crop recommendation processed successfully.",
      insights: geminiText,
    });
  } catch (error) {
    console.error(
      "Error processing crop recommendation data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Error processing crop recommendation data. Please try again.",
      error: error.response ? error.response.data : error.message,
    });
  }
});

module.exports = router;