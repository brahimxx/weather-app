import { useState, useEffect } from "react";
import "./ForecastCardsContainer.css";
import fetchData from "../../services/api";
import ForecastCard from "../ForecastCard/ForecastCard";

function ForecastCardsContainer({ city, navBarState }) {
  const [forecastInfo, setForecastInfo] = useState(null);

  useEffect(() => {
    const getForecast = async () => {
      const data = await fetchData("forecast", city); // Pass "forecast" for forecast data
      setForecastInfo(data);
    };
    getForecast();
  }, [city]);

  return (
    <>
      {navBarState === 0 && (
        <div className="forecast-container">
          {/* Access forecast for the first day and its hours */}
          {forecastInfo?.forecast.forecastday[0].hour.map((hourInfo, index) => (
            <ForecastCard
              key={index}
              hourInfo={hourInfo} // Pass each hour's weather info
              index={index}
              city={city}
              is_today={1}
            />
          ))}
        </div>
      )}

      {navBarState === 1 && (
        <div className="forecast-container">
          {/* Access forecast for the first day and its hours */}
          {forecastInfo?.forecast.forecastday[1].hour.map((hourInfo, index) => (
            <ForecastCard
              key={index}
              hourInfo={hourInfo} // Pass each hour's weather info
              index={index}
              city={city}
            />
          ))}
        </div>
      )}
      {navBarState === 2 && (
        <div className="forecast-container">
          {/* Access forecast for the first day and its hours */}
          {forecastInfo?.forecast.forecastday.map((daysInfo, index) => (
            <ForecastCard
              key={index}
              daysInfo={daysInfo}
              index={index}
              city={city}
              is_week={navBarState}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default ForecastCardsContainer;
