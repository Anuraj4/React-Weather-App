// Weather.js
import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);

  const API_KEY = 'd2c3eb4dafca8e344f7259c8d93fe813';
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  const getWeatherData = async () => {
    try {
      const response = await axios.get(`${API_URL}?q=${city}&appid=${API_KEY}`);
      setWeatherData(response.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeatherData}>Get Weather</button>

      {weatherData && (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp} K</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default Weather;
