import React, { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const apiKey = "146d64d41c6c4b8b895150423240609 ";

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {weather && (
        <div>
          {console.log(weather)}
          <h2>{weather.location.name}</h2>
          <p>Temperature: {weather.current.temp_c}°C</p>
          <img src={weather.current.condition.icon} width="100" height="100" />
        </div>
      )}
    </div>
  );
}

export default App;
