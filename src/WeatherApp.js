import { useState, useEffect } from "react";
import fetchData from "./services/api";
import Header from "./components/Header/Header";
import WeatherTitle from "./components/WeatherTitle/WeatherTitle";
import TheWeather from "./components/TheWeather/TheWeather";
import StatCardsContainer from "./components/StatCardsContainer/StatCardsContainer";
import TabNav from "./components/TabNav/TabNav";
import ForecastCardsContainer from "./components/ForecastCardsContainer/ForecastCardsContainer";

function WeatherApp() {
  const [city, setCity] = useState("Algiers");
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    const getWeather = async () => {
      const data = await fetchData("current", city); // Pass "current" for current weather data
      setWeatherInfo(data);
    };
    getWeather();
  }, [city]);

  const handleClick = (newCity) => {
    console.log(newCity);
    setCity(newCity); // Update the city state
  };

  const [value, setValue] = useState(0); // the nav bar handler
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Header onClick={handleClick} />
      <WeatherTitle weatherInfo={weatherInfo} />
      <TheWeather weatherInfo={weatherInfo} />
      <StatCardsContainer weatherInfo={weatherInfo} />
      <TabNav onChange={handleChange} value={value} />
      <ForecastCardsContainer city={city} navBarState={value} />
    </>
  );
}

export default WeatherApp;
