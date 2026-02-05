import { useState, useEffect } from "react";
import fetchData from "../services/api";
import ForecastCard from "./ForecastCard";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function ForecastCardsContainer({ city, onHourSelect }) {
  const [forecastInfo, setForecastInfo] = useState(null);
  const [value, setValue] = useState(0);
  const [selectedHour, setSelectedHour] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSelectedHour(null); // Reset selection when changing tabs

    // When switching to Today tab, auto-select current hour
    if (newValue === 0 && forecastInfo) {
      const currentHour = new Date().getHours();
      const currentHourData =
        forecastInfo?.forecast?.forecastday?.[0]?.hour?.[currentHour];
      if (currentHourData && onHourSelect) {
        setTimeout(() => {
          setSelectedHour(currentHour);
          onHourSelect(currentHourData);
        }, 100);
      }
    }
  };

  const handleHourClick = (hourData, hourIndex) => {
    setSelectedHour(hourIndex);
    if (onHourSelect) {
      onHourSelect(hourData);
    }
  };

  useEffect(() => {
    const getForecast = async () => {
      const data = await fetchData("forecast", city);
      setForecastInfo(data);

      // Auto-select current hour on Today tab when city changes
      const currentHour = new Date().getHours();
      const currentHourData =
        data?.forecast?.forecastday?.[0]?.hour?.[currentHour];
      if (currentHourData && onHourSelect) {
        setSelectedHour(currentHour);
        onHourSelect(currentHourData);
      }
    };
    getForecast();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city]);

  const containerClass =
    "flex flex-row gap-1 w-full overflow-x-auto overflow-y-hidden m-0 py-1 px-4 min-h-0 md:gap-2 md:py-1 md:px-4 max-[480px]:gap-1 max-[480px]:p-1 max-[480px]:px-2" +
    " [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden [scroll-snap-type:x_mandatory]";

  return (
    <div className="flex flex-col gap-2">
      <Box
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          padding: { xs: "3px", sm: "4px" },
          boxShadow: "rgba(0, 0, 0, 0.08) 0px 5px 15px",
          "& .MuiTabs-indicator": {
            height: "100%",
            background: "rgba(255, 255, 255, 0.45)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "8px",
            boxShadow: "rgba(0, 0, 0, 0.08) 0px 4px 12px",
            zIndex: 0,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          },
          "& .MuiTabs-flexContainer": {
            position: "relative",
            zIndex: 1,
          },
          "& .MuiTab-root": {
            color: "#1e293b",
            fontWeight: 500,
            fontFamily: "'Poppins', sans-serif",
            textTransform: "none",
            fontSize: { xs: "11px", sm: "12px", md: "13px" },
            padding: { xs: "6px 12px", sm: "8px 16px" },
            borderRadius: "8px",
            transition: "color 0.3s ease-in-out",
            zIndex: 1,
            "&.Mui-selected": {
              fontWeight: 600,
            },
            "&:hover:not(.Mui-selected)": {
              background: "rgba(6, 182, 212, 0.1)",
            },
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          aria-label="weather forecast tabs"
        >
          <Tab label="Today" />
          <Tab label="Tomorrow" />
          <Tab label="3 Days" />
        </Tabs>
        {value === 0 && (
          <div className={containerClass}>
            {forecastInfo?.forecast.forecastday[0].hour.map(
              (hourInfo, index) => (
                <ForecastCard
                  key={index}
                  hourInfo={hourInfo}
                  index={index}
                  city={city}
                  is_today={1}
                  onHourSelect={(data) => handleHourClick(data, index)}
                  isSelected={selectedHour === index}
                />
              ),
            )}
          </div>
        )}

        {value === 1 && (
          <div className={containerClass}>
            {forecastInfo?.forecast.forecastday[1].hour.map(
              (hourInfo, index) => (
                <ForecastCard
                  key={index}
                  hourInfo={hourInfo}
                  index={index}
                  city={city}
                  onHourSelect={(data) => handleHourClick(data, index)}
                  isSelected={selectedHour === index}
                />
              ),
            )}
          </div>
        )}
        {value === 2 && (
          <div className={containerClass}>
            {forecastInfo?.forecast.forecastday.map((daysInfo, index) => (
              <ForecastCard
                key={index}
                daysInfo={daysInfo}
                index={index}
                city={city}
                is_week={value}
              />
            ))}
          </div>
        )}
      </Box>
    </div>
  );
}

export default ForecastCardsContainer;
