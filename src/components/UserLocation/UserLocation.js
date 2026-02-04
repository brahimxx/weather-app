import React, { useState, useEffect } from "react";
import CurrentLocation from "../../assets/icons/current-location.svg";
function UserLocation({ onClick }) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude + "",
            longitude: position.coords.longitude + "",
          });
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <img
      src={CurrentLocation}
      onClick={() => onClick(location.latitude + "," + location.longitude)}
      className="location-btn"
    />
  );
}

export default UserLocation;
