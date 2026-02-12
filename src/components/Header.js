import WeatherTitle from "./WeatherTitle";
import ThemeToggle from "./ThemeToggle";

const LocationPinIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-accent-start"
  >
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
      fill="currentColor"
    />
  </svg>
);

const Header = ({ weatherInfo, onLocationClick }) => {
  return (
    <div className="flex flex-row justify-between items-center gap-4">
      <div
        onClick={onLocationClick}
        className="flex items-center gap-3 cursor-pointer group p-2 hover:bg-white/5 rounded-lg transition-colors duration-200"
      >
        <div className="p-2 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors sm:block">
          <LocationPinIcon />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
            Current Location
          </span>
          <WeatherTitle weatherInfo={weatherInfo} />
        </div>
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hidden sm:block">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <div>
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Header;
