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
      <div className="flex justify-center items-center h-screen bg-bg-secondary">
        <div className="relative flex flex-col items-center gap-4">
          <img
            src={require("./assets/logo.png")}
            alt="Weather App Logo"
            className="w-24 h-24 object-contain animate-pulse"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
          />
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
    <div className="bg-bg-secondary flex flex-col h-full w-full relative overflow-hidden">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 md:p-5 lg:p-8 flex flex-col gap-4 pb-[130px]"> {/* pb matches graph height + text */}
        <Header
          onClick={updateCity}
          weatherInfo={weatherInfo}
          onLocationClick={handleLocationClick}
        />

        <div className="flex flex-col gap-4">
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
        </div>
      </div>

      {/* Temperature Graph */}
      {weatherInfo?.forecast?.forecastday && graphData.length > 0 && (
        <div className="min-h-[180px] absolute bottom-0 left-0 right-0 w-full h-[120px] bg-gradient-to-t from-bg-secondary to-transparent z-10 pointer-events-none">
          {/* Wrapper to restore pointer events for graph interaction */}
          <div className="w-full h-full pointer-events-auto">
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
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
