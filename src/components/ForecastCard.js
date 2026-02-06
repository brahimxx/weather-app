import { useRef, useEffect } from "react";
import Weathericon from "../assets/animated_weather/clear-day.svg";
import React from "react";

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

const date = new Date();
const hour = date.getHours();

function ForecastCard({
  hourInfo,
  index,
  city,
  is_today,
  is_week,
  daysInfo,
  onHourSelect,
  isSelected,
}) {
  const conditionCode =
    hourInfo?.condition?.code || daysInfo?.day?.condition?.code;
  const isDay = hourInfo?.is_day === 1 || daysInfo;
  const iconFileName = conditionCodeToIcon[conditionCode]
    ? isDay
      ? conditionCodeToIcon[conditionCode].day
      : conditionCodeToIcon[conditionCode].night
    : "clear-day.svg";
  const iconSrc = icons[iconFileName] || Weathericon;

  const targetDivRef = useRef(null);
  const cardRef = useRef(null);

  const handleClick = () => {
    if (onHourSelect && hourInfo && !is_week) {
      onHourSelect(hourInfo);
    }
  };

  useEffect(() => {
    if (targetDivRef.current) {
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [city]);

  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [isSelected]);

  let forecastTime;
  const cardClassName =
    "forecast-card-div" + (isSelected ? " selected-forecastcard" : "");

  const isCurrentHour = hour === index && is_today;

  if (isCurrentHour) {
    forecastTime = "now";
  } else {
    if (index === 23) {
      forecastTime = "00:00";
    } else {
      forecastTime = String(index + 1).padStart(2, "0") + ":00";
    }
  }

  const baseCardClass =
    "min-w-[65px] min-h-[80px] max-h-[120px] flex flex-col justify-center items-center gap-1 rounded-2xl p-1 transition-all duration-300 cursor-pointer flex-shrink-0 scroll-snap-align-start hover:-translate-y-1 md:min-w-[70px] md:min-h-[90px] md:py-2 md:px-4 max-[480px]:min-w-14 max-[480px]:min-h-[75px] max-[480px]:p-1 max-[480px]:rounded-xl";
  const isHighlighted = cardClassName.includes("selected");

  const isWeekView = is_week === 2;
  const topText = isWeekView
    ? new Date(daysInfo.date).toLocaleDateString("en-US", { weekday: "short" })
    : forecastTime;
  const tempValue = isWeekView ? daysInfo.day.maxtemp_c : hourInfo?.temp_c;

  const cardStyle = {
    background: isHighlighted ? "var(--bg-selected)" : "var(--bg-glass)",
    backdropFilter: "blur(10px)",
    border: isHighlighted ? "2px solid var(--bg-selected)" : "",
    transform: isHighlighted ? "translateY(-2px)" : "none",
  };

  const handleMouseEnter = (e) => {
    if (!isHighlighted) {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
      e.currentTarget.style.background = "var(--bg-glass-hover)";
    }
  };

  const handleMouseLeave = (e) => {
    if (!isHighlighted) {
      e.currentTarget.style.boxShadow = "var(--shadow-sm)";
      e.currentTarget.style.background = "var(--bg-glass)";
    }
  };

  const topSpanClass = `text-[11px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center md:text-[11px] max-[480px]:text-[10px] ${isSelected ? "text-accent-start font-bold" : "text-text-primary"}`;

  return (
    <div
      className={baseCardClass}
      ref={(el) => {
        if (hour === index && is_today === 1) {
          targetDivRef.current = el;
        }
        cardRef.current = el;
      }}
      onClick={handleClick}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={topSpanClass}>{topText}</span>
      <img
        src={iconSrc}
        alt="weather icon"
        className="w-8 h-8 flex-shrink-0 md:w-9 md:h-9 max-[480px]:w-7 max-[480px]:h-7"
        style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))" }}
      />
      <div>
        <span className="text-[13px] font-bold text-text-primary md:text-sm max-[480px]:text-xs">
          {tempValue}
        </span>
        <span className="text-[10px] align-super font-semibold text-text-secondary max-[480px]:text-[7px]">
          °C
        </span>
      </div>
    </div>
  );
}

export default ForecastCard;
