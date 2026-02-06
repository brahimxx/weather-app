import React from "react";
import Weathericon from "../assets/icons/cludy.png";

const conditionCodeToIcon = {
  1000: { day: "clear-day.svg", night: "clear-night.svg" },
  1003: { day: "cloudy-1-day.svg", night: "cloudy-1-night.svg" },
  1006: { day: "cloudy-2-day.svg", night: "cloudy-2-night.svg" },
  1009: { day: "cloudy-3-day.svg", night: "cloudy-3-night.svg" },
  1030: { day: "fog-day.svg", night: "fog-night.svg" },
  1063: { day: "rainy-1-day.svg", night: "rainy-1-night.svg" },
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

const importIcons = (requireContext) => {
  let icons = {};
  requireContext.keys().forEach((item) => {
    icons[item.replace("./", "")] = requireContext(item);
  });
  return icons;
};

const icons = importIcons(
  require.context("../assets/animated_weather", false, /\.(svg)$/),
);

const TheWeather = ({ weatherInfo, selectedHourData }) => {
  // Use selectedHourData if available, otherwise use current weather
  const displayData = selectedHourData || weatherInfo?.current;

  const conditionCode = displayData?.condition?.code;
  const isDay = displayData?.is_day === 1;
  const iconFileName = conditionCodeToIcon[conditionCode]
    ? isDay
      ? conditionCodeToIcon[conditionCode].day
      : conditionCodeToIcon[conditionCode].night
    : "clear-day.svg";
  const iconSrc = icons[iconFileName] || Weathericon;

  return (
    <div
      className="min-h-[170px] flex flex-row justify-between items-center text-text-primary rounded-[30px] p-2 px-4 md:p-4 md:px-6 max-[480px]:p-2"
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex flex-col  gap-1">
        <p className="text-[clamp(8px,2vw,14px)] text-text-secondary font-medium m-0">
          {displayData?.condition?.text || "Rainy"}
        </p>
        <div className="text-[clamp(36px,8vw,48px)] font-semibold text-text-primary leading-none">
          <span>{displayData?.temp_c || "19"}</span>
          <span className="text-[0.4em] align-super font-medium">°C</span>
        </div>
      </div>
      <img
        src={iconSrc}
        alt="Weather Icon"
        className="w-[120px] h-full"
        style={{ filter: "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))" }}
      />
    </div>
  );
};

export default TheWeather;
