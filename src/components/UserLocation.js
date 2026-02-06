import { useState, useEffect } from "react";

const LocationIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="var(--text-primary)"
      strokeWidth="2"
    />
    <path
      d="M12 2v4m0 12v4M2 12h4m12 0h4"
      stroke="var(--text-primary)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

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
    <div
      onClick={() => onClick(location.latitude + "," + location.longitude)}
      className="w-full h-full flex items-center justify-center cursor-pointer"
    >
      <LocationIcon />
    </div>
  );
}

export default UserLocation;
