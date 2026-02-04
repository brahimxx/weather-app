import axios from "axios";

const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

const fetchData = async (endpoint, param) => {
  if (!param) return null;
  try {
    const response = await axios.get(
      `https://api.weatherapi.com/v1/${endpoint}.json?key=${apiKey}&q=${param}&days=8`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ", endpoint, " data:", error);
    throw error;
  }
};

export default fetchData;
