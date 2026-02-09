import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WeatherProvider } from "./context/WeatherContext";
import WeatherApp from "./WeatherApp";
import LocationSelection from "./pages/LocationSelection";

function App() {
  return (
    <WeatherProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WeatherApp />} />
          <Route path="/location" element={<LocationSelection />} />
        </Routes>
      </Router>
    </WeatherProvider>
  );
}

export default App;
