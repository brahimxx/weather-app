import { useState, useEffect } from "react";
import fetchData from "./services/api";
import Header from "./components/Header";
import WeatherTitle from "./components/WeatherTitle";
import TheWeather from "./components/TheWeather";
import StatCardsContainer from "./components/StatCardsContainer";
import ForecastCardsContainer from "./components/ForecastCardsContainer";

function WeatherApp() {
  const [city, setCity] = useState("Algiers");
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHourData, setSelectedHourData] = useState(null);

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
    setSelectedHourData(null); // Reset selected hour when city changes
  };

  const handleHourSelect = (hourData) => {
    setSelectedHourData(hourData);
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
    <div className="flex flex-col justify-between p-2 h-full overflow-hidden md:p-5 md:h-[90vh] lg:p-8 ">
      <Header onClick={handleClick} />
      <WeatherTitle weatherInfo={weatherInfo} />
      <TheWeather
        weatherInfo={weatherInfo}
        selectedHourData={selectedHourData}
      />
      <StatCardsContainer
        weatherInfo={weatherInfo}
        selectedHourData={selectedHourData}
      />
      <ForecastCardsContainer city={city} onHourSelect={handleHourSelect} />
    </div>
  );
}

export default WeatherApp;
