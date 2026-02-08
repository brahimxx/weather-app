import { useState } from "react";

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
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        onClick(`${lat},${lon}`);
        setIsLoading(false);
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        alert(
          "Unable to get your location. Please enable location permissions.",
        );
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  return (
    <div
      onClick={handleLocationClick}
      className={`w-full h-full flex items-center justify-center cursor-pointer ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <LocationIcon />
    </div>
  );
}

export default UserLocation;
