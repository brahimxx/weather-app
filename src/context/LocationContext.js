import { createContext, useState, useContext, useCallback } from "react";

const LocationContext = createContext();

export const useUserLocation = () => useContext(LocationContext);

export const LocationProvider = ({ children }) => {
  const [userPosition, setUserPosition] = useState({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
    permissionStatus: null, // 'granted', 'denied', 'prompt'
  });

  /**
   * Request user's current location via browser Geolocation API
   */
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setUserPosition((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    setUserPosition((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
          permissionStatus: "granted",
        });
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        let status = "denied";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            status = "denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location unavailable";
            status = "granted";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            status = "granted";
            break;
          default:
            break;
        }

        setUserPosition((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
          permissionStatus: status,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // Cache for 5 minutes
      }
    );
  }, []);

  /**
   * Clear user location data
   */
  const clearLocation = useCallback(() => {
    setUserPosition({
      latitude: null,
      longitude: null,
      loading: false,
      error: null,
      permissionStatus: null,
    });
  }, []);

  /**
   * Check if we have a valid user position
   */
  const hasLocation = userPosition.latitude !== null && userPosition.longitude !== null;

  return (
    <LocationContext.Provider
      value={{
        ...userPosition,
        hasLocation,
        requestLocation,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
