
import { reverseGeocode } from "../services/locationService";
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

const LoadingSpinner = () => (
  <div
    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
    style={{
      borderColor: "var(--text-primary) transparent var(--text-primary) var(--text-primary)",
    }}
  />
);

function UserLocation({ onClick }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLoading(true);

    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });

      if (permissionStatus.state === "denied") {
        alert("Location access is blocked. Please enable permissions in your browser settings to use this feature.");
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error checking permissions:", error);
      // Continue to try getCurrentPosition as fallback if permissions API fails
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // Use Geoapify reverse geocoding to get location name
          const locationInfo = await reverseGeocode(lat, lon);

          // Pass coords and location info to parent
          onClick(`${lat},${lon}`, locationInfo);
        } catch (error) {
          console.error("Reverse geocode error:", error);
          // Still pass coords even if reverse geocode fails
          onClick(`${lat},${lon}`, null);
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err.message);
        // Provide more actionable feedback
        if (err.code === err.PERMISSION_DENIED) {
          alert("Location access was denied. Please check your browser settings to allow location access.");
        } else {
          alert("Unable to get your location. Please check your connection or location settings.");
        }
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div
      onClick={handleLocationClick}
      className={`w-full h-full flex items-center justify-center cursor-pointer transition-all duration-200 ${isLoading ? "opacity-50 pointer-events-none" : "hover:scale-110"
        }`}
      title="Use my current location"
    >
      {isLoading ? <LoadingSpinner /> : <LocationIcon />}
    </div>
  );
}

export default UserLocation;
