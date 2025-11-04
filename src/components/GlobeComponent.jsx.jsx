import React, { useRef, useState, useEffect } from "react";
import Globe from "react-globe.gl";
import axios from "axios";
import { Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import WeatherCard from "./WeatherCard";

export default function GlobeComponent() {
  const globeEl = useRef();
  const [focused, setFocused] = useState(false);
  const [cityData, setCityData] = useState(null);
  const [zoomed, setZoomed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchCity = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=ec4a538a2c976ea4e6c793c318b63f81`
      );

      if (geoRes.data.length > 0) {
        const cityMatch = geoRes.data[0];
        const { lat, lon } = cityMatch;
        await fetchData(lat, lon);
      }
    } catch (error) {
      console.error("Error searching city:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (lat, lon) => {
    setLoading(true);
    try {
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=ec4a538a2c976ea4e6c793c318b63f81&units=metric`
      );
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=ec4a538a2c976ea4e6c793c318b63f81`
      );

      const cityName = geoRes.data[0]?.name || weatherRes.data.name;
      const { main, weather } = weatherRes.data;

      setCityData({
        city: cityName,
        temp: main.temp,
        desc: weather[0].description,
        humidity: main.humidity,
        feels_like: main.feels_like,
        pressure: main.pressure,
        icon: weather[0]?.icon,
        main: weather[0]?.main,
      });
      setSearchQuery(cityName);

      if (globeEl.current) {
        globeEl.current.pointOfView({ lat, lng: lon, altitude: 0.5 }, 2000);
        setTimeout(() => setZoomed(true), 1200);
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setZoomed(false);
    setTimeout(() => {
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.2 }, 2500);
      setTimeout(() => setCityData(null), 600);
    }, 200);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        bgcolor: "#000",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "calc(100% - 32px)", sm: "520px", md: "640px" },
          zIndex: 10,
          mt: 2,
        }}
      >
        <SearchBar
          focused={focused}
          setFocused={setFocused}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchCity={searchCity}
          loading={loading}
        />
      </Box>

      <Globe
        ref={globeEl}
        width={dimensions.width}
        height={dimensions.height}
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        onGlobeClick={(coords) => fetchData(coords.lat, coords.lng)}
        backgroundColor="rgba(0,0,0,0)"
      />

      <AnimatePresence>
        {zoomed && cityData && (
          <WeatherCard data={cityData} onClose={handleReset} />
        )}
      </AnimatePresence>
    </Box>
  );
}
