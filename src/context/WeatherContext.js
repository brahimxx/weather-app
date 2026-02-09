import { createContext, useState, useContext } from "react";

const WeatherContext = createContext();

export const useWeather = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState("Algiers");
  const [coordinates, setCoordinates] = useState(null); // { lat, lon }
  const [locationInfo, setLocationInfo] = useState(null); // Geoapify location info

  /**
   * Update city by name (for text search)
   */
  const updateCity = (newCity) => {
    setCity(newCity);
    setCoordinates(null);
    setLocationInfo(null); // Clear location info
  };

  /**
   * Update by coordinates with Geoapify location info
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {Object|null} geoLocationInfo - Location info from Geoapify { name, region, country }
   */
  const updateByCoordinates = (lat, lon, geoLocationInfo = null) => {
    setCoordinates({ lat, lon });
    // Use coordinate string for weather API
    setCity(`${lat},${lon}`);
    // Store the Geoapify location info for display
    if (geoLocationInfo) {
      setLocationInfo(geoLocationInfo);
    }
  };

  /**
   * Get the query string for weather API
   * Prioritizes coordinates if available
   */
  const getWeatherQuery = () => {
    if (coordinates) {
      return `${coordinates.lat},${coordinates.lon}`;
    }
    return city;
  };

  return (
    <WeatherContext.Provider
      value={{
        city,
        coordinates,
        locationInfo,
        updateCity,
        updateByCoordinates,
        getWeatherQuery,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;
