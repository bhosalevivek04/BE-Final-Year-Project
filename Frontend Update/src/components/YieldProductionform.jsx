// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/SoilAnalysisForm.css';
// import { useNavigate } from 'react-router-dom';

// const YieldProductionForm = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     phoneNumber: '',
//     cropType: '',
//     season: '',
//     area: '',
//     soilType: '',
//     city: '',
//     latitude: '',
//     longitude: '',
//     temperature: '',
//     date: new Date().getFullYear(),
//     age: '',
    
//   });

//   const [analysisData, setAnalysisData] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isPhoneSubmitted, setIsPhoneSubmitted] = useState(false);
  

//   const cropTypes = ['Maize', 'Wheat', 'Cotton', 'Rice', 'Sugarcane'];
//   const seasons = ['Rabi', 'Kharif', 'Whole Year'];
//   const soilTypes = ['Red', 'Black', 'Alluvial'];

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     // Validation for negative numbers
//     if (name === 'area' || name === 'age') {
//       if (parseFloat(value) < 0) return;
//     }

//     setFormData(prevState => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const getCurrentLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           // Get weather data using coordinates
//           fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=d887d60da51df1eb3236014a853b63bc`)
//             .then(res => res.json())

//             .then(data => {
//               setFormData(prevState => ({
//                 ...prevState,
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude,
//                 temperature: data.main.temp
//               }));
//             })
//             .catch(error => {
//               console.error("Error fetching temperature:", error);
//               setFormData(prevState => ({
//                 ...prevState,
//                 latitude: position.coords.latitude,
//                 longitude: position.coords.longitude
//               }));
//             });
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//           alert("Unable to retrieve location. Please check your device settings.");
//         }
//       );
//     } else {
//       alert("Geolocation is not supported by this browser.");
//     }
//   };

//   const handleDateClick = () => {
//     setFormData(prevState => ({
//       ...prevState,
//       date: new Date().getFullYear()
//     }));
//   };

//   const fetchCoordinatesFromCity = async (cityName) => {
//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`);
//       const data = await response.json();
      

//       if (data.length > 0) {
//         const { lat, lon } = data[0];
//         // Fetch weather data using the coordinates
//         fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=d887d60da51df1eb3236014a853b63bc`)
//           .then(res => res.json())

//           .then(weatherData => {
//             setFormData(prevState => ({
//               ...prevState,
//               latitude: lat,
//               longitude: lon,
//               temperature: weatherData.main.temp
//             }));
//           });
//       } else {
//         alert("City not found. Please check the spelling and try again.");
//       }
//     } catch (error) {
//       console.error("Error fetching coordinates:", error);
//       alert("Error fetching coordinates. Please try again.");
//     }
//   };

//   const handleCitySubmit = (e) => {
//     e.preventDefault();
//     if (formData.city) {
//       fetchCoordinatesFromCity(formData.city);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:5000/api/yield-production', formData);
//       console.log('Form submitted successfully:', response.data);
//       setAnalysisData(response.data);
//       alert('Form submitted successfully!');
//       setIsSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Error submitting form. Please try again.');
//     }
//   };

//   const handlePhoneSubmit = async () => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/submit-phone', {
//         phoneNumber: formData.phoneNumber,
//         name: formData.name
//       });
//       console.log('Phone number submitted successfully:', response.data);
//       alert('Phone number submitted successfully!');
//       setIsPhoneSubmitted(true);
//     } catch (error) {
//       console.error('Error submitting phone number:', error);
//       alert('Error submitting phone number. Please try again.');
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2 className="form-title">Yield Production Form</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Crop Type</label>
//           <select
//             name="cropType"
//             value={formData.cropType}
//             onChange={handleInputChange}
//             required
//             disabled={isSubmitted || isPhoneSubmitted}
//           >
//             <option value="">Select Crop Type</option>
//             {cropTypes.map(crop => (
//               <option key={crop} value={crop}>{crop}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Season</label>
//           <select
//             name="season"
//             value={formData.season}
//             onChange={handleInputChange}
//             required
//             disabled={isSubmitted || isPhoneSubmitted}
//           >
//             <option value="">Select Season</option>
//             {seasons.map(season => (
//               <option key={season} value={season}>{season}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>Area (in hectare)</label>
//           <input
//             type="number"
//             name="area"
//             value={formData.area}
//             onChange={handleInputChange}
//             min="0"
//             step="0.01"
//             required
//             disabled={isSubmitted || isPhoneSubmitted}
//           />
//         </div>

//         <div className="form-group">
//           <label>Soil Type</label>
//           <select
//             name="soilType"
//             value={formData.soilType}
//             onChange={handleInputChange}
//             required
//             disabled={isSubmitted || isPhoneSubmitted}
//           >
//             <option value="">Select Soil Type</option>
//             {soilTypes.map(soil => (
//               <option key={soil} value={soil}>{soil}</option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group">
//           <label>City</label>
//           <div style={{ display: 'flex', gap: '10px' }}>
//             <input
//               type="text"
//               name="city"
//               value={formData.city}
//               onChange={handleInputChange}
//               placeholder="Enter city name"
//               disabled={isSubmitted || isPhoneSubmitted}
//             />
//             {/* <button
//               type="button"
//               onClick={handleCitySubmit}
//               className="submit-btn"
//               style={{ padding: '5px 10px' }}
//             >
//               Get Location
//             </button> */}
//           </div>
//         </div>

//         <div className="form-group">
//           <button
//             type="button"
//             onClick={getCurrentLocation}
//             className="submit-btn"
//             style={{ marginBottom: '10px' }}
//           >
//             Get Current Location & Temperature
//           </button>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
//             <input
//               type="text"
//               name="latitude"
//               value={formData.latitude}
//               placeholder="Latitude"
//               readOnly
//             />
//             <input
//               type="text"
//               name="longitude"
//               value={formData.longitude}
//               placeholder="Longitude"
//               readOnly
//             />
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Temperature (°C)</label>
//           <input
//             type="text"
//             name="temperature"
//             value={formData.temperature}
//             placeholder="Auto-filled from location"
//             readOnly
//           />
//         </div>

//         <div className="form-group">
//           <label>Date (Year)</label>
//           <input
//             type="number"
//             name="date"
//             value={formData.date}
//             onClick={handleDateClick}
//             readOnly
//           />
//         </div>

//         <div className="form-group">
//           <label>Age (in Days)</label>
//           <input
//             type="number"
//             name="age"
//             value={formData.age}
//             onChange={handleInputChange}
//             min="0"
//             required
//             disabled={isSubmitted || isPhoneSubmitted}
//           />
//         </div>

//         <button type="submit" className="submit-btn" disabled={isSubmitted}>
//           Submit
//         </button>
//       </form>
//       {analysisData && (
//         <div className="analysis-data">
//           <h2>Analysis Data</h2>
//           <p>Insights: {analysisData.insights}</p>
//           <p>Message: {analysisData.message}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default YieldProductionForm;


import React, { useState } from 'react';
import axios from 'axios';
import '../styles/SoilAnalysisForm.css';

const YieldProductionForm = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    season: '',
    area: '',
    soilType: '',
    cropYear: new Date().getFullYear(),
    daysSincePlanting: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cropTypes = ['Maize', 'Wheat', 'Cotton', 'Rice', 'Sugarcane'];
  const seasons = ['Rabi', 'Kharif', 'Whole Year'];
  const soilTypes = ['Red', 'Black', 'Alluvial'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'area' || name === 'daysSincePlanting') {
      if (parseFloat(value) < 0) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5001/api/predict-yield', {
        Crop_Year: formData.cropYear,
        Season: formData.season,
        Crop: formData.cropType,
        Area: formData.area,
        Soil_Type: formData.soilType,
        days_since_planting: formData.daysSincePlanting || null
      });

      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Error getting prediction. Please check inputs.');
    }
    setIsLoading(false);
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Crop Yield Prediction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Crop Type</label>
          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Crop</option>
            {cropTypes.map(crop => (
              <option key={crop} value={crop}>{crop}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Season</label>
          <select
            name="season"
            value={formData.season}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Season</option>
            {seasons.map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Area (hectares)</label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Soil Type</label>
          <select
            name="soilType"
            value={formData.soilType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Soil Type</option>
            {soilTypes.map(soil => (
              <option key={soil} value={soil}>{soil}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Crop Year</label>
          <input
            type="number"
            name="cropYear"
            value={formData.cropYear}
            onChange={handleInputChange}
            min="1997"
            max="2030"
            required
          />
        </div>

        <div className="form-group">
          <label>Days Since Planting</label>
          <input
            type="number"
            name="daysSincePlanting"
            value={formData.daysSincePlanting}
            onChange={handleInputChange}
            min="0"
            placeholder="For precise irrigation advice"
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Predicting...' : 'Predict Yield'}
        </button>
      </form>

      {prediction && (
        <div className="prediction-results">
          <h3>Prediction Results</h3>
          <div className="prediction-card">
            <h4>Yield Estimate</h4>
            <p>
              <strong>{prediction.prediction.crop}</strong> in <strong>{prediction.prediction.season}</strong> season
            </p>
            <p className="yield-value">
              {prediction.prediction.yield_tonnes.toLocaleString()} tonnes
            </p>
          </div>

          <div className="irrigation-card">
            <h4>Irrigation Advice</h4>
            {prediction.irrigation_recommendation.note ? (
              <>
                <p>{prediction.irrigation_recommendation.note}</p>
                <ul>
                  {prediction.irrigation_recommendation.all_phases.map((phase, i) => (
                    <li key={i}>
                      <strong>{phase.phase}</strong>: Irrigate every {phase.irrigation_frequency} days
                      (Moisture: {phase.optimal_moisture.min}-{phase.optimal_moisture.max})
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p>
                  Current phase: <strong>{prediction.irrigation_recommendation.current_phase}</strong>
                </p>
                <p>
                  Irrigate every <strong>{prediction.irrigation_recommendation.irrigation_frequency} days</strong>
                </p>
                <p>
                  Maintain moisture between <strong>
                  {prediction.irrigation_recommendation.optimal_moisture.min}-{
                  prediction.irrigation_recommendation.optimal_moisture.max}</strong>
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default YieldProductionForm;