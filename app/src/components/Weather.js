
// Weather.js
import React, { useState } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [isCelsius, setIsCelsius] = useState(false);

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
    const convertTemperature = () => {
        if (weatherData) {
            if (isCelsius) {
                // Convert to Kelvin
                const kelvinTemp = weatherData.main.temp + 273.15;
                setWeatherData({
                    ...weatherData,
                    main: {
                        ...weatherData.main,
                        temp: kelvinTemp,
                    },
                });
            } else {
                // Convert to Celsius
                const celsiusTemp = weatherData.main.temp - 273.15;
                setWeatherData({
                    ...weatherData,
                    main: {
                        ...weatherData.main,
                        temp: celsiusTemp,
                    },
                });
            }

            setIsCelsius(!isCelsius); // Toggle between Celsius and Kelvin
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Weather App</h1>
            <div className="d-flex justify-content-center align-items-center mt-3">
                <input
                    type="text"
                    className="form-control narrow-input" // Add a custom class (e.g., "narrow-input")
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button className="btn btn-primary ml-2" onClick={getWeatherData}>
                    Get Weather
                </button>
            </div>

            {weatherData && (
                <div className="mt-4">
                    <h2 className="text-center">{weatherData.name}</h2>
                    <p className="text-center" id='temp'>
                        Temperature: {weatherData.main.temp.toFixed(2)} {isCelsius ? '°C' : 'K'}
                    </p>
                    <button className="btn btn-primary ml-2" onClick={convertTemperature}>
                        Convert to {isCelsius ? 'Kelvin' : 'Celsius'}
                    </button>
                    {/* Add more details as needed */}
                </div>
            )}
        </div>
    );
};

export default Weather;