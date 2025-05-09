import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const App = () => {
  const [city, setCity] = useState("Patna");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [useGPS, setUseGPS] = useState(false);
  const [coords, setCoords] = useState({ lat: 25.6, lon: 85.1 });

  const apiKey = "6c7aebf36562f0abfe4f944d865d69ff";

  const weatherEmojis = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Haze: "🌁",
    Mist: "🌫️",
    Fog: "🌫️",
    Sand: "🏜️",
    Dust: "💨",
    Smoke: "🚬",
  };

  const getBackgroundImage = (condition) => {
    return `/backgrounds/${condition?.toLowerCase() || "default"}.jpg`;
  };

  const fetchWeather = useCallback(async () => {
    try {
      const query = useGPS
        ? `lat=${coords.lat}&lon=${coords.lon}`
        : `q=${city}`;
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?${query}&appid=${apiKey}&units=metric`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?${query}&appid=${apiKey}&units=metric`
      );
      setWeather(res.data);
      const daily = forecastRes.data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(daily);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }, [city, coords, useGPS]);

  useEffect(() => {
    if (useGPS) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, [useGPS]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  const backgroundStyle = {
    backgroundImage: `url('${getBackgroundImage(weather?.weather[0]?.main)}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  };

  return (
    <div style={backgroundStyle}>
      <div className="glass-box text-pink-300">
        <h1 className="text-5xl font-bold neon-text mb-6 hover:scale-105 transition-transform">Weather App</h1>

        <div className="input-container">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 rounded text-black w-full"
            placeholder="Enter city"
          />
          <button onClick={fetchWeather}>Search</button>
          <label className="ml-3">
            <input
              type="checkbox"
              checked={useGPS}
              onChange={() => setUseGPS(!useGPS)}
              className="mr-1"
            />
            Use GPS
          </label>
        </div>

        {weather && (
          <div className="weather-info">
            <h2 className="city-name text-panel">{weather.name}</h2>
            <p className="temp text-panel">{Math.round(weather.main.temp)}°C</p>
            <p className="description text-panel">
              {weather.weather[0].main} {weatherEmojis[weather.weather[0].main] || "❓"}
            </p>
            <p className="humidity text-panel">
              Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()} | Sunset:{" "}
              {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
            </p>
          </div>
        )}

        {forecast.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 neon-text">5-Day Forecast</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="p-3 bg-glass rounded-lg shadow-lg hover:scale-105 transition-transform text-center"
                >
                  <p className="font-semibold text-lg text-panel">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>
                  <p className="text-panel font-bold text-xl">
                    {Math.round(day.main.temp)}°C
                  </p>
                  <p className="text-panel">
                    {day.weather[0].main}{" "}
                    {weatherEmojis[day.weather[0].main] || "❓"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {useGPS && (
          <div className="w-full mt-10 rounded overflow-hidden">
            <MapContainer
              center={[coords.lat, coords.lon]}
              zoom={10}
              style={{ height: "300px", width: "100%" }}
              className="rounded-lg"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lon]}>
                <Popup>Your Location</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
