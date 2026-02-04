import { useState, useEffect } from "react";
import fetchData from "./services/api";
import Header from "./components/Header/Header";
import WeatherTitle from "./components/WeatherTitle/WeatherTitle";
import TheWeather from "./components/TheWeather/TheWeather";
import StatCardsContainer from "./components/StatCardsContainer/StatCardsContainer";
import TabNav from "./components/TabNav/TabNav";
import ForecastCardsContainer from "./components/ForecastCardsContainer/ForecastCardsContainer";

function WeatherApp() {
  const [city, setCity] = useState("Algiers");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData("current", city);
        setWeatherInfo(data);
      } catch (err) {
        setError("Failed to fetch weather data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getWeather();
  }, [city]);

  const handleClick = (newCity) => {
    console.log(newCity);
    setCity(newCity); // Update the city state
  };

  const [value, setValue] = useState(0); // the nav bar handler
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Loading weather data...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "red" }}>{error}</h2>
          <button onClick={() => setCity("Algiers")}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="weather-app-container">
      <Header onClick={handleClick} />
      <WeatherTitle weatherInfo={weatherInfo} />
      <TheWeather weatherInfo={weatherInfo} />
      <StatCardsContainer weatherInfo={weatherInfo} />
      <TabNav onChange={handleChange} value={value} />
      <ForecastCardsContainer city={city} navBarState={value} />
    </div>
  );
}

export default WeatherApp;
