import React, { useState } from "react";
import axios from "axios";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]); // ✅ Moved here
  const API_KEY = "6c7aebf36562f0abfe4f944d865d69ff"; // Replace with your actual API key

  // Function to fetch weather data
  const fetchWeather = async () => {
    if (!city) return;

    try {
      // Get current weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(weatherRes.data);

      // Get 5-day forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Filter only 12:00 PM forecast for each day
      const dailyData = forecastRes.data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(dailyData);
    } catch (error) {
      alert("City not found! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-800 to-blue-400 text-white">
      <div className="bg-white text-black rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Weather App</h2>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg transition"
          >
            Get Weather
          </button>
        </div>

        {weather && (
          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold">{weather.name}</h3>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
              className="mx-auto w-32"
            />
            <p className="text-xl font-semibold mt-4">
              Temperature: {weather.main.temp}°C
            </p>
            <p className="text-lg">Humidity: {weather.main.humidity}%</p>
            <p className="text-lg capitalize">
              Weather: {weather.weather[0].description}
            </p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-center">5-Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-black rounded-lg p-4 shadow-md text-center"
                >
                  <p className="font-bold">{new Date(day.dt_txt).toDateString()}</p>
                  <img
                    src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="Icon"
                    className="mx-auto"
                  />
                  <p>Temp: {day.main.temp}°C</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;
