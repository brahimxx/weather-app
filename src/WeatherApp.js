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
  const [appReady, setAppReady] = useState(false);
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

  // Ensure app is fully ready before hiding loading screen
  useEffect(() => {
    if (!loading && weatherInfo) {
      // Delay to ensure all components are mounted and animations complete
      // Graph has 500ms transition, so we wait 600ms to be safe
      const timer = setTimeout(() => {
        setAppReady(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loading, weatherInfo]);

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
    <>
      {/* Loading Screen Overlay - fades out when app is ready */}
      <div
        className={`fixed inset-0 flex justify-center items-center bg-bg-secondary z-50 transition-opacity duration-500 ${
          loading || !appReady ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative flex flex-col items-center gap-4">
          <img
            src={require("./assets/logo.png")}
            alt="Weather App Logo"
            className="w-24 h-24 object-contain animate-pulse"
            style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))" }}
          />
        </div>
      </div>

      {/* Main App Content - renders underneath loading screen */}
      <div className="overflow-hidden bg-bg-secondary h-dvh flex flex-col min-h-[700px] w-full gap-4 relative">
        {/* Scrollable Content Area */}
        <div className="overflow-y-auto pt-2 md:pt-5 lg:pt-8 px-2 md:px-5 lg:px-8 flex flex-col gap-4">
          {/* pb matches graph height + text */}
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
        </div>
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

        {/* Temperature Graph */}
        {weatherInfo?.forecast?.forecastday && graphData.length > 0 && (
          <div className=" absolute bottom-0 left-0 right-0 w-full h-full max-h-[190px] bg-gradient-to-t from-bg-secondary to-transparent z-10 pointer-events-none">
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
                      selectedData =
                        weatherInfo.forecast.forecastday[0]?.hour?.[index];
                      break;
                    case 1: // Tomorrow
                      selectedData =
                        weatherInfo.forecast.forecastday[1]?.hour?.[index];
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
    </>
  );
}

export default WeatherApp;
