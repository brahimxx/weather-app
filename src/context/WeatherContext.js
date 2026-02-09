import { createContext, useState, useContext } from "react";

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState("Algiers");

  const updateCity = (newCity) => {
    setCity(newCity);
  };

  return (
    <WeatherContext.Provider value={{ city, updateCity }}>
      {children}
    </WeatherContext.Provider>
  );
};
