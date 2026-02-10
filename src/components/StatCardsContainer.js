const ICON_BASE_URL = process.env.REACT_APP_WEATHER_ICON_OUTLINE_BASE_URL;

const rainIcon = `${ICON_BASE_URL}raindrop.svg`;
const windIcon = `${ICON_BASE_URL}wind.svg`;
const humidityIcon = `${ICON_BASE_URL}humidity.svg`;
const pressureIcon = `${ICON_BASE_URL}barometer.svg`;

const StatCard = ({ icon, label, value }) => {
  return (
    <div className=" flex flex-col justify-center text-center p-2 min-h-[70px] gap-1 items-center transition-all duration-300 text-text-primary font-medium">
      <div className="flex flex-col gap-0.5 items-center font-medium text-xs">
        <img
          src={icon}
          alt={`${label} Icon`}
          className="w-10 h-10 transition-transform duration-300"
        />
      </div>

      <p className="text-[15px] font-semibold text-text-primary m-0">
        {value}
      </p>
      <p className="m-0 text-text-secondary text-[12px]">
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
      className="flex flex-row justify-around py-2 px-4 rounded-[30px]"
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
      <StatCard
        icon={pressureIcon}
        label="Pressure"
        value={displayData?.pressure_mb + " hPa"}
      />
    </div>
  );
};

export default StatCardsContainer;
