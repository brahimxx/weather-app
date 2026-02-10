import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import fetchData from "./services/api";
import Header from "./components/Header";
import TheWeather from "./components/TheWeather";
import StatCardsContainer from "./components/StatCardsContainer";
import ForecastCardsContainer from "./components/ForecastCardsContainer";
import TemperatureGraph from "./components/TemperatureGraph";
import { useWeather } from "./context/WeatherContext";

function WeatherApp() {
  const { city, updateCity } = useWeather();
  const navigate = useNavigate();
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHourData, setSelectedHourData] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [forecastTab, setForecastTab] = useState(0);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData("forecast", city);
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

  const handleHourSelect = (hourData, index) => {
    setSelectedHourData(hourData);
    setSelectedCardIndex(index);
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

  // Format data for the temperature graph based on active tab
  const graphData = useMemo(() => {
    if (!weatherInfo?.forecast?.forecastday) return [];

    const formatTime = (timeStr) => {
      const date = new Date(timeStr);
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    };

    const formatDay = (dateStr) => {
      return new Date(dateStr).toLocaleDateString("en-US", {
        weekday: "short",
      });
    };

    switch (forecastTab) {
      case 0: // Today - hourly data
        return (
          weatherInfo.forecast.forecastday[0]?.hour?.map((h) => ({
            time: formatTime(h.time),
            temp: h.temp_c,
          })) || []
        );

      case 1: // Tomorrow - hourly data
        return (
          weatherInfo.forecast.forecastday[1]?.hour?.map((h) => ({
            time: formatTime(h.time),
            temp: h.temp_c,
          })) || []
        );

      case 2: // 3 Days - daily averages
        return weatherInfo.forecast.forecastday.map((day) => ({
          time: formatDay(day.date),
          temp: day.day.avgtemp_c,
          min: day.day.mintemp_c,
          max: day.day.maxtemp_c,
        }));

      default:
        return [];
    }
  }, [weatherInfo, forecastTab]);

  // Get current hour index for marker (only for Today tab)
  const currentHourIndex = forecastTab === 0 ? new Date().getHours() : null;

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
    <div className="bg-bg-secondary flex flex-col justify-between p-2 h-full overflow-hidden md:p-5 md:h-[90vh] lg:p-8 relative">
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
      <ForecastCardsContainer
        city={city}
        onHourSelect={handleHourSelect}
        forecastInfo={weatherInfo}
        activeTab={forecastTab}
        onTabChange={(val) => {
          setForecastTab(val);
          setSelectedCardIndex(null); // Reset selection on tab change
          setSelectedHourData(null);
        }}
        selectedCardIndex={selectedCardIndex}
      />
      <div className="h-[40px]"></div>

      {/* Temperature Graph */}
      {weatherInfo?.forecast?.forecastday && graphData.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 w-full h-[120px]">
          <TemperatureGraph
            data={graphData}
            activeTab={forecastTab}
            currentHourIndex={currentHourIndex}
            selectedIndex={selectedCardIndex}
            onPointSelect={(index) => {
              let selectedData = null;

              switch (forecastTab) {
                case 0: // Today
                  selectedData = weatherInfo.forecast.forecastday[0]?.hour?.[index];
                  break;
                case 1: // Tomorrow
                  selectedData = weatherInfo.forecast.forecastday[1]?.hour?.[index];
                  break;
                case 2: // 3 Days
                  selectedData = weatherInfo.forecast.forecastday[index];
                  break;
                default:
                  break;
              }

              if (selectedData) {
                handleHourSelect(selectedData, index);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
