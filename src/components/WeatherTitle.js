import { useWeather } from "../context/WeatherContext";

const WeatherTitle = ({ weatherInfo }) => {
  const { locationInfo } = useWeather();

  // Prefer Geoapify location info if available, otherwise fall back to WeatherAPI
  const displayName = locationInfo?.name || weatherInfo?.location?.name || "Stockholm";
  const displayCountry = locationInfo?.country || weatherInfo?.location?.country || "Sweden";

  return (
    <div className="flex flex-row  gap-0.5">
      <h1
        className="text-[15px] font-bold text-text-primary leading-tight"
        style={{ textShadow: "1px 1px 3px rgba(255, 255, 255, 0.3)" }}
      >
        {displayName}
        {", "}
        {displayCountry}
      </h1>
    </div>
  );
};

export default WeatherTitle;
