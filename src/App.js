import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import { LocationProvider } from "./context/LocationContext";
import { ThemeProvider } from "./context/ThemeContext";
import WeatherApp from "./WeatherApp";
import LocationSelection from "./pages/LocationSelection";

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
