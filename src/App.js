import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import { LocationProvider } from "./context/LocationContext";
import WeatherApp from "./WeatherApp";
import LocationSelection from "./pages/LocationSelection";

function App() {
  return (
    <LocationProvider>
      <WeatherProvider>
        <Router>
          <Routes>
            <Route path="/" element={<WeatherApp />} />
            <Route path="/location" element={<LocationSelection />} />
          </Routes>
        </Router>
      </WeatherProvider>
    </LocationProvider>
  );
}

export default App;
