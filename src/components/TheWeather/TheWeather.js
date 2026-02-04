import "./TheWeather.css";
import Weathericon from "../../assets/icons/cludy.png"; // Fallback icon

// Map condition codes to day and night specific icons
const conditionCodeToIcon = {
  1000: { day: "clear-day.svg", night: "clear-night.svg" }, // Clear
  1003: { day: "cloudy-1-day.svg", night: "cloudy-1-night.svg" }, // Partly cloudy
  1006: { day: "cloudy-2-day.svg", night: "cloudy-2-night.svg" }, // Cloudy
  1009: { day: "cloudy-3-day.svg", night: "cloudy-3-night.svg" }, // Overcast
  1030: { day: "fog-day.svg", night: "fog-night.svg" }, // Mist
  1063: { day: "rainy-1-day.svg", night: "rainy-1-night.svg" }, // Patchy rain possible

  1066: { day: "snowy-1-day.svg", night: "snowy-1-night.svg" },
  1069: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1072: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1087: {
    day: "isolated-thunderstorms-day.svg",
    night: "isolated-thunderstorms-night.svg",
  },
  1114: { day: "snowy-3-day.svg", night: "snowy-3-night.svg" },
  1117: { day: "snowy-3-day.svg", night: "snowy-3-night.svg" },
  1135: { day: "fog.svg", night: "fog.svg" },
  1147: { day: "frost.svg", night: "frost.svg" },
  1150: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1153: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1168: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1171: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1180: { day: "rainy-1-day.svg", night: "rainy-1-night.svg" },
  1183: { day: "rainy-1.svg", night: "rainy-1.svg" },
  1186: { day: "rainy-2-day.svg", night: "rainy-2-night.svg" },
  1189: { day: "rainy-2.svg", night: "rainy-2.svg" },
  1192: { day: "rainy-3-day.svg", night: "rainy-3-night.svg" },
  1195: { day: "rainy-3.svg", night: "rainy-3.svg" },
  1198: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1201: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1204: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },

  1207: { day: "rain-and-sleet-mix.svg", night: "rain-and-sleet-mix.svg" },
  1210: { day: "snowy-1-day.svg", night: "snowy-1-night.svg" },
  1213: { day: "snowy-1.svg", night: "snowy-1.svg" },
  1216: { day: "snowy-2-day.svg", night: "snowy-2-night.svg" },
  1219: { day: "snowy-2.svg", night: "snowy-2.svg" },
  1222: { day: "snowy-3-day.svg", night: "snowy-3-night.svg" },
  1225: { day: "snowy-3.svg", night: "snowy-3.svg" },
  1237: { day: "hail.svg", night: "hail.svg" },
  1240: { day: "rainy-1-day.svg", night: "rainy-1-night.svg" },
  1243: { day: "rainy-3-day.svg", night: "rainy-3-night.svg" },
  1246: { day: "rainy-3-day.svg", night: "rainy-3-night.svg" },
  1249: { day: "rain-and-snow-mix.svg", night: "rain-and-snow-mix.svg" },
  1252: { day: "rain-and-snow-mix.svg", night: "rain-and-snow-mix.svg" },
  1255: { day: "snowy-1-day.svg", night: "snowy-1-night.svg" },
  1258: { day: "snowy-2-day.svg", night: "snowy-2-night.svg" },
  1261: { day: "hail.svg", night: "hail.svg" },
  1264: { day: "hail.svg", night: "hail.svg" },
  1273: {
    day: "scattered-thunderstorms-day.svg",
    night: "scattered-thunderstorms-night.svg",
  },
  1276: { day: "thunderstorms.svg", night: "thunderstorms.svg" },
  1279: {
    day: "scattered-thunderstorms-day.svg",
    night: "scattered-thunderstorms-night.svg",
  },
  1282: { day: "snowy-3.svg", night: "snowy-3.svg" },
};

// Function to import all icons from the folder
const importIcons = (requireContext) => {
  let icons = {};
  requireContext.keys().forEach((item) => {
    icons[item.replace("./", "")] = requireContext(item);
  });
  return icons;
};

// Import icons from the animated_weather folder
const icons = importIcons(
  require.context("../../assets/animated_weather", false, /\.(svg)$/)
);

const TheWeather = ({ weatherInfo }) => {
  const conditionCode = weatherInfo?.current?.condition?.code;
  const isDay = weatherInfo?.current?.is_day === 1; // Check if it's day or night
  const iconFileName = conditionCodeToIcon[conditionCode]
    ? isDay
      ? conditionCodeToIcon[conditionCode].day // Use day icon if it's day
      : conditionCodeToIcon[conditionCode].night // Use night icon if it's night
    : "clear-day.svg"; // Default icon if no match
  const iconSrc = icons[iconFileName] || Weathericon; // Fallback to default icon if not found

  return (
    <>
      <div className="theweader-div">
        <img src={iconSrc} alt="Weather Icon" />

        <div className="theweader-div-text">
          <div className="temp">
            <span className="temperature">
              {weatherInfo?.current?.temp_c || "19"}
            </span>
            <span className="degree-symbol">°C</span>
          </div>
          <p className="weather-description">
            {weatherInfo?.current?.condition?.text || "Rainy"}
          </p>
        </div>
      </div>
    </>
  );
};

export default TheWeather;
