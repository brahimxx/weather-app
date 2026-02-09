import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SearchBar from "../components/SearchBar";
import { useWeather } from "../context/WeatherContext";
import { useUserLocation } from "../context/LocationContext";
import UserLocation from "../components/UserLocation";
import { reverseGeocode } from "../services/locationService";

// Fix for default marker icon in leaflet with webpack/react
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationMarker = ({ position, setPosition, setLocationString }) => {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocationString(`${e.latlng.lat},${e.latlng.lng}`);
      map.setView(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position} />;
};

// Component to handle map centering when user location is available
const MapCenterHandler = ({ userLat, userLon }) => {
  const map = useMap();
  
  useEffect(() => {
    if (userLat && userLon) {
      map.setView([userLat, userLon], 13);
    }
  }, [userLat, userLon, map]);
  
  return null;
};

const LocationSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateByCoordinates } = useWeather();
  const { latitude, longitude, hasLocation, requestLocation } = useUserLocation();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);

  // Set initial map position from route state or user location
  useEffect(() => {
    if (location.state?.lat && location.state?.lon) {
      const { lat, lon } = location.state;
      setMarkerPosition({ lat, lng: lon });
      setSelectedLocation(`${lat},${lon}`);
    }
  }, [location.state]);

  // Request user location on mount for distance-based sorting
  useEffect(() => {
    if (!hasLocation) {
      requestLocation();
    }
  }, [hasLocation, requestLocation]);

  const handleSearch = (query, locationName) => {
    // Query is in format "lat,lon" from SearchBar
    const [lat, lon] = query.split(",").map(Number);
    if (!isNaN(lat) && !isNaN(lon)) {
      updateByCoordinates(lat, lon, locationName);
    } else {
      // Fallback for text query (shouldn't happen with new system)
      updateByCoordinates(null, null);
    }
    navigate("/");
  };

  const handleUserLocation = (coords, locationInfo) => {
    // coords is in format "lat,lon", locationInfo from Geoapify reverse geocode
    const [lat, lon] = coords.split(",").map(Number);
    updateByCoordinates(lat, lon, locationInfo);
    navigate("/");
  };

  const handleMapSelection = async () => {
    if (markerPosition) {
      const lat = markerPosition.lat;
      const lon = markerPosition.lng || markerPosition.lon;
      
      // Get location name via reverse geocoding
      const locationInfo = await reverseGeocode(lat, lon);
      updateByCoordinates(lat, lon, locationInfo);
      navigate("/");
    }
  };

  // Default center - use user location if available, otherwise Algiers
  const defaultCenter = hasLocation 
    ? [latitude, longitude] 
    : [36.7538, 3.0588];

  return (
    <div className="h-screen w-full relative overflow-hidden bg-primary">
      {/* Full Screen Map Layer */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          style={{ height: "100%", width: "100%", background: "#1a1a1a" }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={markerPosition}
            setPosition={setMarkerPosition}
            setLocationString={setSelectedLocation}
          />
          {/* Center map when user location becomes available */}
          <MapCenterHandler userLat={latitude} userLon={longitude} />
        </MapContainer>
      </div>

      {/* UI Overlay Layer - Header */}
      <div
        className="absolute top-0 left-0 bg-red-300 right-0 z-[2000] p-4 flex items-center justify-between shadow-sm"
        style={{
          backdropFilter: "blur(10px)",
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-full text-text-primary hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-2 group"
        >
          <svg
            className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="hidden sm:inline font-medium">Back</span>
        </button>
        <h1 className="text-xl font-bold text-text-primary absolute left-1/2 transform -translate-x-1/2">
          Select Location
        </h1>
        <div
          className="flex justify-center items-center w-10 h-10 p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: "var(--bg-glass)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--border-primary)",
            boxShadow: "var(--shadow-sm)",
          }}
          title="Use my current location"
        >
          <UserLocation onClick={handleUserLocation} />
        </div>
      </div>

      {/* UI Overlay Layer - Search Bar */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-[1002] pointer-events-none">
        <div className="pointer-events-auto">
          <SearchBar onClick={handleSearch} />
        </div>
      </div>

      {/* UI Overlay Layer - Bottom Actions */}
      <div className="absolute bottom-24 left-0 right-0 flex flex-col items-center gap-4 z-[1000] pointer-events-none">
        {!selectedLocation && (
          <div className="bg-black/60 text-white px-6 py-3 rounded-full backdrop-blur-md text-sm font-medium animate-bounce shadow-lg">
            Tap anywhere on the map to pin
          </div>
        )}
        
        <button
          onClick={handleMapSelection}
          disabled={!selectedLocation}
          className={`
            pointer-events-auto
            px-8 py-4 rounded-full font-bold text-lg shadow-xl
            transition-all duration-300 transform
            flex items-center gap-2
            ${selectedLocation 
              ? 'translate-y-0 opacity-100 bg-accent-start text-white hover:bg-accent-end hover:scale-105 hover:shadow-2xl' 
              : 'translate-y-10 opacity-0 bg-gray-500'}
          `}
        >
          <span>Confirm Location</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LocationSelection;
