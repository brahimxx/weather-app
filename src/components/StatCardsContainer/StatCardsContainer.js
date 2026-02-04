import "./StatCardsContainer.css";
import StatCard from "../StatCard/StatCard";
import rainIcon from "../../assets/animated_weather/raindrops.svg";
import windIcon from "../../assets/animated_weather/wind.svg";
import humidityIcon from "../../assets/animated_weather/humidity.svg";

const StatCardsContainer = ({ weatherInfo }) => {
  return (
    <div className="stats-container">
      <StatCard
        icon={rainIcon}
        label="Precipitation"
        value={weatherInfo?.current.precip_mm + " cm"}
      />
      <StatCard
        icon={humidityIcon}
        label="Humidity"
        value={weatherInfo?.current.humidity + " %"}
      />
      <StatCard
        icon={windIcon}
        label="Wind"
        value={weatherInfo?.current.wind_kph + " km/h"}
      />
    </div>
  );
};

export default StatCardsContainer;
