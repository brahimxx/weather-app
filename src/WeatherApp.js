import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fetchData from "./services/api";
import Header from "./components/Header";
import TheWeather from "./components/TheWeather";
import StatCardsContainer from "./components/StatCardsContainer";
import ForecastCardsContainer from "./components/ForecastCardsContainer";
import { useWeather } from "./context/WeatherContext";

function WeatherApp() {
  const { city, updateCity } = useWeather();
  const navigate = useNavigate();
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

  const handleHourSelect = (hourData) => {
    setSelectedHourData(hourData);
  };

  const handleLocationClick = () => {
    if (weatherInfo && weatherInfo.location) {
      navigate("/location", {
        state: {
          lat: weatherInfo.location.lat,
          lon: weatherInfo.location.lon,
        },
      });
    } else {
      navigate("/location");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="relative">
          <div
            className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
            style={{
              borderColor:
                "var(--accent-start) var(--accent-end) var(--accent-end) var(--accent-end)",
            }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-b-transparent rounded-full animate-spin"
            style={{
              borderColor:
                "var(--accent-end) var(--accent-end) var(--accent-end) var(--accent-start)",
              animationDirection: "reverse",
              animationDuration: "0.8s",
            }}
          ></div>
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
          <button
            className="mt-4 px-4 py-2 bg-accent-start text-white rounded-lg"
            onClick={() => updateCity("Algiers")}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between p-2 h-full overflow-hidden md:p-5 md:h-[90vh] lg:p-8 relative">
      <Header
        onClick={updateCity}
        weatherInfo={weatherInfo}
        onLocationClick={handleLocationClick}
      />

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
