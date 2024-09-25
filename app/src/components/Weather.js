// Weather.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Weather.css';


const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(false);
  const [loading, setLoading] = useState(true);
  const [favoriteLocations, setFavoriteLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showForecast, setShowForecast] = useState(false);

  const API_KEY = 'd2c3eb4dafca8e344f7259c8d93fe813';
  const API_URL = `https://api.openweathermap.org/data/2.5/weather`;
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast`;
  

  useEffect(() => {
    const storedLocations = JSON.parse(localStorage.getItem('favoriteLocations')) || [];
    setFavoriteLocations(storedLocations);
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setLoading(true);
      getWeatherData(selectedLocation);
      getForecastData(selectedLocation);
    } else {
      fetchWeatherByGeolocation(); // Fetch weather data using geolocation if no specific location is selected
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

  const getForecastData = async (location) => {
    try {
      const response = await axios.get(`${FORECAST_API_URL}?q=${location}&appid=${API_KEY}`);
      setForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
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
      <h2 className="text-center">Weather App</h2>

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

      {showForecast && forecastData && (
        <div className="mt-4">
          <h3 className="text-center">5-Day Forecast</h3>
          <div className="d-flex justify-content-center">
            <ul>
              {forecastData.list.slice(0, 5).map((item) => (
                <li key={item.dt}>
                  {new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}:{' '}
                  {item.main.temp.toFixed(2)} {isCelsius ? '°C' : 'K'}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-3 d-flex justify-content-center">
        <button className="btn btn-info" onClick={() => setShowForecast(!showForecast)}>
          {showForecast ? 'Hide Forecast' : 'Show 5-Day Forecast'}
        </button>
      </div>
      {loading && <p className="text-center mt-3">Loading...</p>}
      {!loading && (
        <div className="mt-4">
          <h3 className="text-center">Favorite Locations</h3>
          <div className="d-flex justify-content-center" id='fav'>
            <select
              className="form-control"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="" disabled >
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
