import axios from "axios";

const apiKey = "146d64d41c6c4b8b895150423240609";

const fetchData = async (endpoint, param) => {
  if (!param) return null;
  try {
    const response = await axios.get(
      `http://api.weatherapi.com/v1/${endpoint}.json?key=${apiKey}&q=${param}&days=8`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ", endpoint, " data:", error);
    throw error;
  }
};

export default fetchData;
