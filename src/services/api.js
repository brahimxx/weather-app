import axios from "axios";

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

const fetchData = async (endpoint, param) => {
  if (!param) return null;
  try {
    const isForecast = endpoint === "forecast";
    const response = await axios.get(
      `https://api.weatherapi.com/v1/${endpoint}.json`,
      {
        params: {
          key: apiKey,
          q: param.trim(),
          ...(isForecast ? { days: 7 } : {}),
        },
      },
    );
    if (isForecast) {
      // Validating forecast data
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching ", endpoint, " data:", error);
    throw error;
  }
};

export default fetchData;
