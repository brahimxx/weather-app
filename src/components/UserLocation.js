import React, { useState, useEffect } from "react";
import CurrentLocation from "../assets/icons/current-location.svg";

function UserLocation({ onClick }) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude + "",
            longitude: position.coords.longitude + "",
          });
        },
        (err) => {
          console.error("Geolocation error:", err.message);
        },
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  }, []);

  return (
    <img
      src={CurrentLocation}
      onClick={() => onClick(location.latitude + "," + location.longitude)}
      className="cursor-pointer"
      alt="Current Location"
    />
  );
}

export default UserLocation;
