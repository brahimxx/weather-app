import { useRef, useEffect } from "react";
import Weathericon from "../assets/animated_weather/clear-day.svg";
import React from "react";

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
const hour = date.getHours(); // Get the current hour (0-23)

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
  const isDay = hourInfo?.is_day === 1 || daysInfo; // Check if it's day or night
  const iconFileName = conditionCodeToIcon[conditionCode]
    ? isDay
      ? conditionCodeToIcon[conditionCode].day // Use day icon if it's day
      : conditionCodeToIcon[conditionCode].night // Use night icon if it's night
    : "clear-day.svg"; // Default icon if no match
  const iconSrc = icons[iconFileName] || Weathericon; // Fallback to default icon if not found

  const targetDivRef = useRef(null); // Reference to the specific div
  const cardRef = useRef(null); // Reference for selected card

  const handleClick = () => {
    if (onHourSelect && hourInfo && !is_week) {
      onHourSelect(hourInfo);
    }
  };

  useEffect(() => {
    if (targetDivRef.current) {
      // Scroll to the div when the component mounts
      targetDivRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [city]);

  // Scroll to center when selected
  useEffect(() => {
    if (isSelected && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [isSelected]);

  let forecastTime,
    cardClassName = "forecast-card-div";

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

  if (isSelected) {
    cardClassName += " selected-forecastcard";
  }

  const baseCardClass =
    "min-w-[65px] min-h-[80px] max-h-[120px] flex flex-col justify-center items-center gap-1 rounded-2xl p-1 transition-all duration-300 cursor-pointer flex-shrink-0 scroll-snap-align-start hover:-translate-y-1 md:min-w-[70px] md:min-h-[90px] md:py-1 md:px-2 max-[480px]:min-w-14 max-[480px]:min-h-[75px] max-[480px]:p-1 max-[480px]:rounded-xl";
  const isHighlighted = cardClassName.includes("selected");

  return (
    <>
      {is_week !== 2 ? (
        <div
          className={baseCardClass}
          ref={(el) => {
            if (hour === index && is_today === 1) {
              targetDivRef.current = el;
            }
            cardRef.current = el;
          }}
          onClick={handleClick}
          style={{
            background: isHighlighted
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
            border: isHighlighted
              ? "2px solid rgba(132, 126, 234, 0.8)"
              : "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: isHighlighted
              ? "rgba(102, 126, 234, 0.3) 0px 5px 15px"
              : "rgba(0, 0, 0, 0.08) 0px 4px 12px",
            transform: isHighlighted ? "translateY(-2px)" : "none",
          }}
          onMouseEnter={(e) => {
            if (!isHighlighted) {
              e.currentTarget.style.boxShadow =
                "rgba(0, 0, 0, 0.1) 0px 8px 24px";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isHighlighted) {
              e.currentTarget.style.boxShadow =
                "rgba(0, 0, 0, 0.08) 0px 4px 12px";
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
            }
          }}
        >
          <span
            className={`text-[11px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center md:text-xs max-[480px]:text-[10px] ${isSelected ? "text-accent-start font-bold" : "text-text-primary"}`}
          >
            {forecastTime}
          </span>
          <img
            src={iconSrc}
            alt="weather icon"
            className="w-8 h-8 flex-shrink-0 md:w-9 md:h-9 max-[480px]:w-7 max-[480px]:h-7"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))" }}
          />
          <div>
            <span className="text-[13px] font-bold text-text-primary md:text-sm max-[480px]:text-xs">
              {hourInfo.temp_c}
            </span>
            <span className="text-[10px] align-super font-semibold text-text-secondary max-[480px]:text-[7px]">
              °C
            </span>
          </div>
        </div>
      ) : (
        <div
          className={baseCardClass}
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.1) 0px 8px 24px";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "rgba(0, 0, 0, 0.08) 0px 4px 12px";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)";
          }}
        >
          <span className="text-[11px] font-semibold text-text-primary whitespace-nowrap overflow-hidden text-ellipsis max-w-full text-center md:text-xs max-[480px]:text-[10px]">
            {new Date(daysInfo.date).toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </span>
          <img
            src={iconSrc}
            alt="weather icon"
            className="w-8 h-8 flex-shrink-0 md:w-9 md:h-9 max-[480px]:w-7 max-[480px]:h-7"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))" }}
          />
          <div>
            <span className="text-[13px] font-bold text-text-primary md:text-sm max-[480px]:text-xs">
              {daysInfo.day.maxtemp_c}
            </span>
            <span className="text-[10px] align-super font-semibold text-text-secondary max-[480px]:text-[7px]">
              °C
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default ForecastCard;
