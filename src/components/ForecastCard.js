import { useRef, useEffect } from "react";

const ICON_BASE_URL = process.env.REACT_APP_WEATHER_ICON_BASE_URL;

const conditionCodeToIcon = {
  1000: { day: "clear-day", night: "clear-night" },
  1003: { day: "partly-cloudy-day", night: "partly-cloudy-night" },
  1006: { day: "cloudy", night: "cloudy" },
  1009: { day: "overcast", night: "overcast" },
  1030: { day: "fog-day", night: "fog-night" },
  1063: { day: "partly-cloudy-day-rain", night: "partly-cloudy-night-rain" },
  1066: { day: "partly-cloudy-day-snow", night: "partly-cloudy-night-snow" },
  1069: { day: "sleet", night: "sleet" },
  1072: { day: "sleet", night: "sleet" },
  1087: { day: "thunderstorms-day", night: "thunderstorms-night" },
  1114: { day: "snow", night: "snow" },
  1117: { day: "snow", night: "snow" },
  1135: { day: "fog", night: "fog" },
  1147: { day: "fog", night: "fog" },
  1150: { day: "drizzle", night: "drizzle" },
  1153: { day: "drizzle", night: "drizzle" },
  1168: { day: "sleet", night: "sleet" },
  1171: { day: "sleet", night: "sleet" },
  1180: { day: "partly-cloudy-day-rain", night: "partly-cloudy-night-rain" },
  1183: { day: "rain", night: "rain" },
  1186: { day: "partly-cloudy-day-rain", night: "partly-cloudy-night-rain" },
  1189: { day: "rain", night: "rain" },
  1192: { day: "rain", night: "rain" },
  1195: { day: "rain", night: "rain" },
  1198: { day: "sleet", night: "sleet" },
  1201: { day: "sleet", night: "sleet" },
  1204: { day: "sleet", night: "sleet" },
  1207: { day: "sleet", night: "sleet" },
  1210: { day: "partly-cloudy-day-snow", night: "partly-cloudy-night-snow" },
  1213: { day: "snow", night: "snow" },
  1216: { day: "partly-cloudy-day-snow", night: "partly-cloudy-night-snow" },
  1219: { day: "snow", night: "snow" },
  1222: { day: "snow", night: "snow" },
  1225: { day: "snow", night: "snow" },
  1237: { day: "hail", night: "hail" },
  1240: { day: "partly-cloudy-day-rain", night: "partly-cloudy-night-rain" },
  1243: { day: "rain", night: "rain" },
  1246: { day: "rain", night: "rain" },
  1249: { day: "sleet", night: "sleet" },
  1252: { day: "sleet", night: "sleet" },
  1255: { day: "partly-cloudy-day-snow", night: "partly-cloudy-night-snow" },
  1258: { day: "snow", night: "snow" },
  1261: { day: "hail", night: "hail" },
  1264: { day: "hail", night: "hail" },
  1273: { day: "thunderstorms-day-rain", night: "thunderstorms-night-rain" },
  1276: { day: "thunderstorms-rain", night: "thunderstorms-rain" },
  1279: { day: "thunderstorms-day-snow", night: "thunderstorms-night-snow" },
  1282: { day: "thunderstorms-snow", night: "thunderstorms-snow" },
};

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
  const iconName = conditionCodeToIcon[conditionCode]
    ? isDay
      ? conditionCodeToIcon[conditionCode].day
      : conditionCodeToIcon[conditionCode].night
    : "clear-day";
  const iconSrc = `${ICON_BASE_URL}${iconName}.svg`;

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
