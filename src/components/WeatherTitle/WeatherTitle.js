import "./WeatherTitle.css";

const WeatherTitle = ({ weatherInfo }) => {
  const currentDate = new Date(); // Create a new Date object for the current date and time
  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  }; // Define formatting options
  const formattedDate = currentDate.toLocaleDateString("en-US", options);
  return (
    <>
      <div className="title-div">
        <h1 className="weather-title">
          {weatherInfo?.location.name || "Stockholm"}
          {","}
          <br />
          {weatherInfo?.location.country || "Sweden"}
        </h1>
        <p className="title-date">{formattedDate}</p>
      </div>
    </>
  );
};

export default WeatherTitle;
