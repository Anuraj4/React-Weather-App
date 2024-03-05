// Weather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  const API_KEY = 'd2c3eb4dafca8e344f7259c8d93fe813';
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem('favoriteLocations')) || [];
    setFavoriteLocations(storedLocations);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setLoading(true);
      getWeatherData(selectedLocation);
    } else {
      fetchWeatherByGeolocation(); // Fetch weather data using geolocation if no location selected
    }
  }, [selectedLocation]);

  const getWeatherData = async (location) => {
    try {
      const response = await axios.get(`${API_URL}?q=${location}&appid=${API_KEY}`);
      setWeatherData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const fetchWeatherByGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
          setWeatherData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching weather data:', error);
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        setLoading(false);
      }
    );
  };

  const convertTemperature = () => {
    if (weatherData) {
      if (isCelsius) {
        const kelvinTemp = weatherData.main.temp + 273.15;
        setWeatherData({
          ...weatherData,
          main: {
            ...weatherData.main,
            temp: kelvinTemp,
          },
        });
      } else {
        const celsiusTemp = weatherData.main.temp - 273.15;
        setWeatherData({
          ...weatherData,
          main: {
            ...weatherData.main,
            temp: celsiusTemp,
          },
        });
      }

      setIsCelsius(!isCelsius);
    }
  };

  const addToFavorites = () => {
    if (selectedLocation && !favoriteLocations.includes(selectedLocation)) {
      const updatedFavorites = [...favoriteLocations, selectedLocation];
      setFavoriteLocations(updatedFavorites);
      localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (location) => {
    const updatedFavorites = favoriteLocations.filter((fav) => fav !== location);
    setFavoriteLocations(updatedFavorites);
    localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Weather App</h1>

      <div className="d-flex justify-content-center align-items-center mt-3">
        <input
          type="text"
          className="form-control narrow-input"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button className="btn btn-primary ml-2" onClick={() => setSelectedLocation(city)}>
          Get Weather
        </button>
      </div>

      {weatherData && (
        <div className="mt-4">
          <h2 className="text-center">{weatherData.name}</h2>
          <p className="text-center" id="temp">
            TEMPERATURE: {weatherData.main.temp.toFixed(2)} {isCelsius ? '°C' : 'K'}
          </p>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary ml-2" onClick={convertTemperature}>
              Convert to {isCelsius ? 'Kelvin' : 'Celsius'}
            </button>
          </div>
        </div>
      )}

      {!loading && (
        <div className="mt-4">
          <h3 className="text-center">Favorite Locations</h3>
          <div className="d-flex justify-content-center">
            <select
              className="form-control"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="" disabled>
                Select a favorite location
              </option>
              {favoriteLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <button className="btn btn-primary ml-2" onClick={addToFavorites}>
              Add to Favorites
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => removeFromFavorites(selectedLocation)}
              disabled={!selectedLocation}
            >
              Remove from Favorites
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
