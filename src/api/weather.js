import axios from "axios";

const API_KEY = "ec4a538a2c976ea4e6c793c318b63f81";

export const getWeatherByCoords = async (lat, lon) => {
  const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
    params: { lat, lon, appid: API_KEY, units: "metric" },
  });
  return res.data;
};
