import rainIcon from "../assets/animated_weather/raindrops.svg";
import windIcon from "../assets/animated_weather/wind.svg";
import humidityIcon from "../assets/animated_weather/humidity.svg";

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="flex flex-row p-1 px-2 items-center min-h-[50px] transition-all duration-300 text-text-primary font-medium md:flex-col md:justify-center md:text-center md:p-2 md:min-h-[70px] md:gap-1 max-[480px]:p-1 max-[480px]:min-h-[44px]">
      <div className="flex flex-row items-center gap-2 font-medium text-xs md:flex-col md:gap-0.5 max-[480px]:text-[13px] max-[480px]:gap-1">
        <img
          src={icon}
          alt={`${label} Icon`}
          className="w-7 h-7 p-[5px]  transition-transform duration-300 md:w-12 md:h-12 max-[480px]:p-[5px] "
        />
      </div>

      <p className="text-sm font-semibold text-text-primary m-0 md:text-[15px] max-[480px]:text-sm">
        {value}
      </p>
      <p className="m-0 text-text-secondary md:text-[12px]">
        {label === "Precipitation" ? "Rain" : label}
      </p>
    </div>
  );
};

const StatCardsContainer = ({ weatherInfo, selectedHourData }) => {
  // Use selectedHourData if available, otherwise use current weather
  const displayData = selectedHourData || weatherInfo?.current;

  return (
    <div
      className="flex flex-col rounded-[30px]  md:flex-row justify-around py-1 px-4 "
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(10px)",
      }}
    >
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
