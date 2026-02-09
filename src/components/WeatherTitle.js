const WeatherTitle = ({ weatherInfo }) => {
  return (
    <div className="flex flex-row  gap-0.5">
      <h1
        className="text-[15px] font-bold text-text-primary leading-tight"
        style={{ textShadow: "1px 1px 3px rgba(255, 255, 255, 0.3)" }}
      >
        {weatherInfo?.location.name || "Stockholm"}
        {", "}
        {weatherInfo?.location.country || "Sweden"}
      </h1>
    </div>
  );
};

export default WeatherTitle;
