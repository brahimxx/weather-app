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

const TheWeather = ({ weatherInfo, selectedHourData }) => {
  // Use selectedHourData if available, otherwise use current weather
  const displayData = selectedHourData || weatherInfo?.current;

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    if (isToday) {
      return `Today, ${timeStr}`;
    }

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const dateTimeString = displayData?.time || displayData?.last_updated;

  const conditionCode = displayData?.condition?.code;
  const isDay = displayData?.is_day === 1;
  const iconName = conditionCodeToIcon[conditionCode]
    ? isDay
      ? conditionCodeToIcon[conditionCode].day
      : conditionCodeToIcon[conditionCode].night
    : "clear-day";
  const iconSrc = `${ICON_BASE_URL}${iconName}.svg`;

  return (
    <div
      className="min-h-[150px] flex flex-row justify-between items-center text-text-primary rounded-[30px] p-2 px-4 md:p-2 md:px-6 max-[480px]:p-2"
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="flex flex-col  gap-1">
        <p className="text-sm md:text-base font-semibold text-text-primary m-0">
          {formatDateTime(dateTimeString)}
        </p>
        <p className="text-[clamp(8px,2vw,14px)] text-text-secondary font-medium m-0">
          {displayData?.condition?.text || "Rainy"}
        </p>
        <div className="text-[clamp(36px,8vw,48px)] font-semibold text-text-primary leading-none">
          <span>{Math.round(displayData?.temp_c || 19)}</span>
          <span className="text-[0.4em] align-super font-medium">°C</span>
        </div>
      </div>
      <img
        src={iconSrc}
        alt="Weather Icon"
        className="w-[150px] h-full"
        style={{ filter: "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2))" }}
      />
    </div>
  );
};

export default TheWeather;
