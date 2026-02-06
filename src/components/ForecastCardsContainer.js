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
    <div className="h-[200px] flex flex-col gap-2">
      <Box
        sx={{
          "& .MuiButtonBase-root .MuiTouchRipple-root": {
            display: "none",
            backgroundColor: "transparent",
          },
          "& .MuiTabs-indicator": {
            display: "flex",
            justifyContent: "center",
            height: "6px",
            bottom: "4px",
            backgroundColor: "transparent",
            transition: "all 0.3s ease-out",
            "&::before": {
              content: '""',
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--text-secondary)",
              color: "var(--text-primary)",
            },
          },
          "& .MuiTab-root": {
            color: "var(--text-primary)",
            fontWeight: 500,
            fontFamily: "'Poppins', sans-serif",
            textTransform: "none",
            fontSize: { xs: "11px", sm: "12px", md: "13px" },
            padding: { xs: "6px 12px", sm: "8px 16px" },
            transform: "translateY(0) scale(1)",
            backgroundColor: "transparent",
            transition:
              "color 0.18s ease-in-out, transform 0.18s cubic-bezier(0.2,0.8,0.2,1), box-shadow 0.18s",
            cursor: "pointer",
            "&:hover": {
              color: "var(--text-primary)",
            },
            "&:active": {
              transform: "translateY(1px) scale(0.98)",
            },
            "&.Mui-selected": {
              fontWeight: 600,
              color: "var(--text-primary)",
              transform: "translateY(-6px) scale(1.02)",
              boxShadow: "0 8px 20px rgba(2,6,23,0.06)",
              backgroundColor: "transparent",
            },
            "&.Mui-selected, &:active, &:focus": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          aria-label="weather forecast tabs "
        >
          <Tab
            label="Today"
            disableRipple
            disableFocusRipple
            disableTouchRipple
          />
          <Tab
            label="Tomorrow"
            disableRipple
            disableFocusRipple
            disableTouchRipple
          />
          <Tab
            label="3 Days"
            disableRipple
            disableFocusRipple
            disableTouchRipple
          />
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
