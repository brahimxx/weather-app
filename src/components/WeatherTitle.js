const WeatherTitle = ({ weatherInfo }) => {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  return (
    <div className="flex flex-col gap-0.5">
      <h1
        className="text-[clamp(20px,4vw,28px)] font-bold text-text-primary leading-tight"
        style={{ textShadow: "1px 1px 3px rgba(255, 255, 255, 0.3)" }}
      >
        {weatherInfo?.location.name || "Stockholm"}
        {","}
        <br />
        {weatherInfo?.location.country || "Sweden"}
      </h1>
      <p className="text-[clamp(13px,2vw,16px)] font-medium text-text-secondary m-0">
        {formattedDate}
      </p>
    </div>
  );
};

export default WeatherTitle;
