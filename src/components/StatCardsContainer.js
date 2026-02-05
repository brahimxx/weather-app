import StatCard from "./StatCard";
import rainIcon from "../assets/animated_weather/raindrops.svg";
import windIcon from "../assets/animated_weather/wind.svg";
import humidityIcon from "../assets/animated_weather/humidity.svg";

const StatCardsContainer = ({ weatherInfo, selectedHourData }) => {
  // Use selectedHourData if available, otherwise use current weather
  const displayData = selectedHourData || weatherInfo?.current;

  return (
    <div className="flex flex-col gap-1 md:flex-row md:gap-2 max-[480px]:gap-1">
      <StatCard
        icon={rainIcon}
        label="Precipitation"
        value={displayData?.precip_mm + " cm"}
      />
      <StatCard
        icon={humidityIcon}
        label="Humidity"
        value={displayData?.humidity + " %"}
      />
      <StatCard
        icon={windIcon}
        label="Wind"
        value={displayData?.wind_kph + " km/h"}
      />
    </div>
  );
};

export default StatCardsContainer;
