import { useState } from 'react';
import axios from 'axios';
import '../styles/SoilAnalysisForm.css';

const IrrigationManagement = () => {
  const [formData, setFormData] = useState({
    cropType: '',
    city: '',
    soilType: '',
    latitude: '',
    longitude: '',
    temperature: '',
    age: '',
    soilMoisture: '',
    name: '',
    phoneNumber: ''
  });
  const [analysisData, setAnalysisData] = useState(null);
  const [smsStatus, setSmsStatus] = useState('');

  const cropTypes = ['Maize', 'Wheat', 'Cotton', 'Rice', 'Sugarcane'];
  const soilTypes = ['Red', 'Black', 'Alluvial'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age' && parseFloat(value) < 0) return;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=d887d60da51df1eb3236014a853b63bc`)
            .then((res) => res.json())
            .then((data) => {
              setFormData((prevState) => ({
                ...prevState,
                latitude,
                longitude,
                temperature: data.main.temp,
              }));
            })
            .catch((error) => {
              console.error("Error fetching temperature:", error);
              setFormData((prevState) => ({
                ...prevState,
                latitude,
                longitude,
              }));
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve location. Please check your device settings.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const getSoilMoisture = async () => {
    try {
      const response = await axios.get('https://iot-backend-6oxx.onrender.com/api/sensor-data/latest');
      setFormData((prevState) => ({
        ...prevState,
        soilMoisture: response.data.soilmoisture,
      }));
    } catch (error) {
      console.error('Error fetching soil moisture:', error);
      alert('Error fetching soil moisture. Please try again.');
    }
  };

  const fetchLocationFromCity = async (cityName) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=d887d60da51df1eb3236014a853b63bc`)
          .then((res) => res.json())
          .then((weatherData) => {
            setFormData((prevState) => ({
              ...prevState,
              latitude: lat,
              longitude: lon,
              temperature: weatherData.main.temp,
            }));
          });
      } else {
        alert("City not found. Please check the spelling and try again.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Error fetching location. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/irrigation-management', formData);
      console.log('Form submitted successfully:', response.data);
      setAnalysisData(response.data);
      alert('Irrigation management form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const handlePhoneSubmit = async () => {
    const phoneRegex = /^(\+91)?[0-9]{10}$/; // Allows optional +91 prefix and 10 digits
    if (!formData.name || !formData.phoneNumber) {
      alert('Please enter both your name and phone number.');
      return;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      alert('Please enter a valid phone number (10 digits, optionally prefixed with +91).');
      return;
    }
    try {
      const response = await axios.post(
        'https://sms-backend-jc6r.onrender.com/api/farmer-number',
        {
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Farmer info submitted successfully:', response.data);
      setSmsStatus('Farmer information submitted successfully!');
    } catch (error) {
      console.error('Error submitting farmer information:', error.response || error.message);
      setSmsStatus('Error submitting farmer information. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Irrigation Management Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Crop Type */}
        <div className="form-group">
          <label>Crop Type</label>
          <select name="cropType" value={formData.cropType} onChange={handleInputChange} required>
            <option value="">Select Crop Type</option>
            {cropTypes.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
        </div>

        {/* Soil Type */}
        <div className="form-group">
          <label>Soil Type</label>
          <select name="soilType" value={formData.soilType} onChange={handleInputChange} required>
            <option value="">Select Soil Type</option>
            {soilTypes.map((soil) => (
              <option key={soil} value={soil}>
                {soil}
              </option>
            ))}
          </select>
        </div>

        {/* City and Location */}
        <div className="form-group">
          <label>City</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city name"
            />
            {/* <button
              type="button"
              onClick={() => fetchLocationFromCity(formData.city)}
              className="submit-btn"
              style={{ padding: '5px 10px' }}
            >
              Get Location
            </button> */}
          </div>
        </div>

        {/* Current Location and Temperature */}
        <div className="form-group">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="submit-btn"
            style={{ marginBottom: '10px' }}
          >
            Get Current Location & Temperature
          </button>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <input type="text" name="latitude" value={formData.latitude} placeholder="Latitude" readOnly />
            <input type="text" name="longitude" value={formData.longitude} placeholder="Longitude" readOnly />
          </div>
        </div>

        {/* Temperature */}
        <div className="form-group">
          <label>Temperature (°C)</label>
          <input
            type="text"
            name="temperature"
            value={formData.temperature}
            placeholder="Auto-filled from location"
            readOnly
          />
        </div>

        {/* Age */}
        <div className="form-group">
          <label>Age (in Days)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            min="0"
            required
          />
        </div>

        {/* Soil Moisture */}
        <div className="form-group">
          <label>Soil Moisture (%)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              name="soilMoisture"
              value={formData.soilMoisture}
              placeholder="Click button to fetch soil moisture"
              readOnly
            />
            <button
              type="button"
              onClick={getSoilMoisture}
              className="submit-btn"
              style={{ padding: '5px 10px' }}
            >
              Get Soil Moisture
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Submit Irrigation Data
        </button>
      </form>

      {/* SMS Service Section */}
      <div className="sms-container" style={{ marginTop: '2rem' }}>
        <h2>Farmer Contact Details for SMS Alerts</h2>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
        </div>
        <button type="button" onClick={handlePhoneSubmit} className="submit-btn">
          Save Farmer Info
        </button>
        {smsStatus && <p>{smsStatus}</p>}
      </div>

      {/* Display Analysis Data */}
      {analysisData && (
        <div className="analysis-data">
          <h2>Analysis Data</h2>
          <p>Insights: {analysisData.insights}</p>
          <p>Message: {analysisData.message}</p>
        </div>
      )}
    </div>
  );
};

export default IrrigationManagement;
