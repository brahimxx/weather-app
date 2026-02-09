import axios from "axios";

const GEOAPIFY_API_KEY = process.env.REACT_APP_GEOAPIFY_API_KEY;
const GEOAPIFY_BASE_URL = "https://api.geoapify.com/v1/geocode/autocomplete";

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees) => degrees * (Math.PI / 180);

/**
 * Format distance for display
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
};

/**
 * Search for locations using Geoapify autocomplete API
 * @param {string} query - Search query
 * @param {number|null} userLat - User's latitude (optional)
 * @param {number|null} userLon - User's longitude (optional)
 * @returns {Promise<Array>} Array of location suggestions with distances
 */
export const searchLocations = async (query, userLat = null, userLon = null) => {
  if (!query || query.length < 2) {
    return [];
  }

  if (!GEOAPIFY_API_KEY) {
    console.warn("Geoapify API key not found. Please set REACT_APP_GEOAPIFY_API_KEY in .env");
    return [];
  }

  try {
    const params = {
      text: query.trim(),
      apiKey: GEOAPIFY_API_KEY,
      limit: 10,
      format: "json",
    };

    // Add proximity bias if user location is available
    if (userLat !== null && userLon !== null) {
      params.bias = `proximity:${userLon},${userLat}`;
    }

    const response = await axios.get(GEOAPIFY_BASE_URL, { params });

    if (!response.data?.results) {
      return [];
    }

    // Map and calculate distances
    const locations = response.data.results.map((result) => {
      const location = {
        id: result.place_id,
        name: result.name || result.city || result.formatted?.split(",")[0] || "Unknown",
        fullName: result.formatted || result.name,
        region: result.state || result.county || "",
        country: result.country || "",
        lat: result.lat,
        lon: result.lon,
        distance: null,
        distanceFormatted: null,
      };

      // Calculate distance if user location is available
      if (userLat !== null && userLon !== null) {
        location.distance = calculateDistance(userLat, userLon, result.lat, result.lon);
        location.distanceFormatted = formatDistance(location.distance);
      }

      return location;
    });

    // Sort by distance if available
    if (userLat !== null && userLon !== null) {
      locations.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    return locations;
  } catch (error) {
    console.error("Location search error:", error);
    return [];
  }
};

/**
 * Reverse geocode coordinates to get location name using Geoapify
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Location info with name, region, country
 */
export const reverseGeocode = async (lat, lon) => {
  if (!GEOAPIFY_API_KEY) {
    console.warn("Geoapify API key not found.");
    return null;
  }

  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/reverse",
      {
        params: {
          lat,
          lon,
          apiKey: GEOAPIFY_API_KEY,
          format: "json",
        },
      }
    );

    if (!response.data?.results?.[0]) {
      return null;
    }

    const result = response.data.results[0];
    return {
      name: result.city || result.name || result.suburb || result.district || result.formatted?.split(",")[0] || "Unknown",
      region: result.state || result.county || "",
      country: result.country || "",
      fullName: result.formatted || "",
      lat: result.lat,
      lon: result.lon,
    };
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
};

export default searchLocations;
