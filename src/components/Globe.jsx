import { useRef, useState, useEffect } from "react";
import Globe from "react-globe.gl";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";

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
  const MotionDiv = motion.div;

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

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
        let cityMatch =
          geoRes.data.find(
            (c) =>
              c.name.toLowerCase() === query.toLowerCase() ||
              (c.local_names && Object.values(c.local_names).includes(query))
          ) ||
          geoRes.data.find((c) => c.country === "EG") ||
          geoRes.data[0];

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
      });

      if (globeEl.current) {
        globeEl.current.pointOfView({ lat, lng: lon, altitude: 0.5 }, 2000);
        setTimeout(() => setZoomed(true), 1800);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setZoomed(false);
    setTimeout(() => {
      globeEl.current.pointOfView({ lat: 0, lng: 0, altitude: 2.2 }, 2500);
      setCityData(null);
    }, 800);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        bgcolor: "#000",
        overflow: "hidden",
      }}
    >
      {/* 🔍 Search Bar - Centered in the screen */}
      <Box
        
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="search-bar"
        sx={{
          position: "absolute",
          
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "calc(100% - 32px)", sm: "520px", md: "640px" },
          maxWidth: "90%",
          zIndex: 10,
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          mt: 2,
        }}
      >
        <MotionDiv
          initial={false}
          animate={{
            scale: focused ? 1.02 : 1,
            boxShadow: focused
              ? "0 12px 40px rgba(2,6,23,0.65)"
              : loading
              ? "0 4px 18px rgba(0,0,0,0.25)"
              : "0 6px 28px rgba(0,0,0,0.45)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          style={{ width: "100%", borderRadius: 16 }}
        >
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchCity(searchQuery)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Type a city name..."
            autoComplete="off"
            inputProps={{
              "aria-label": "search-city",
              autoComplete: "off",
            }}
            variant="outlined"
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    sx={{
                      color: focused ? "#8ab4ff" : "white",
                      opacity: focused ? 1 : loading ? 0.6 : 0.85,
                      transition: "all 0.22s ease",
                      fontSize: { xs: "1.2rem", sm: "1.4rem" },
                    }}
                  />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress
                      size={20}
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        mr: 1,
                      }}
                    />
                  ) : searchQuery ? (
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery("")}
                      sx={{
                        color: "white",
                        opacity: 0.85,
                        mr: 0.5,
                        p: 0.6,
                        borderRadius: 1,
                        "&:hover": {
                          opacity: 1,
                          bgcolor: "rgba(255,255,255,0.12)",
                          transform: "scale(1.08)",
                        },
                        "&:active": {
                          transform: "scale(0.97)",
                        },
                      }}
                      aria-label="clear-search"
                    >
                      <CloseIcon sx={{ fontSize: "1.1rem" }} />
                    </IconButton>
                  ) : null}
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: loading
                  ? "rgba(10, 10, 10, 0.55)"
                  : "rgba(6, 6, 6, 0.6)",
                height: { xs: "52px", sm: "58px" },
                borderRadius: "16px",
                color: "white",
                backdropFilter: "blur(12px)",
                transition: "all 0.22s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: loading ? "scale(0.99)" : "scale(1)",
                boxShadow: "none",
                "& fieldset": {
                  borderColor: loading
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(255,255,255,0.18)",
                  borderWidth: "1px",
                  transition: "all 0.2s ease",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.45)",
                },
                "&.Mui-focused": {
                  transform: "scale(1.01)",
                  "& fieldset": {
                    borderColor: "rgba(138,180,255,0.95) !important",
                    borderWidth: "1.6px !important",
                    boxShadow: "0 6px 22px rgba(138,180,255,0.06)",
                  },
                },
                "& input": {
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  color: "white !important",
                  backgroundColor: "transparent !important",
                  WebkitTextFillColor: "white !important",
                  "&::placeholder": {
                    color: "rgba(255,255,255,0.6)",
                    opacity: 1,
                    fontWeight: 300,
                    letterSpacing: "0.02em",
                    transition: "opacity 0.3s ease",
                  },
                  "&:focus::placeholder": {
                    opacity: 0.4,
                  },
                },
              },
            }}
          />
        </MotionDiv>
      </Box>

      {/* 🌍 Globe Component */}
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

      {/* 🌤 Weather Info Card */}
      <AnimatePresence>
        {zoomed && cityData && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 60 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position: "absolute",
              bottom: "5%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10,
              width: "90%",
              maxWidth: "420px",
            }}
          >
            <Card
              sx={{
                borderRadius: { xs: "16px", sm: "20px" },
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(0,0,0,0.65)",
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              <CardContent
                sx={{
                  position: "relative",
                  color: "white",
                  p: { xs: 2, sm: 3 },
                }}
              >
                <IconButton
                  onClick={handleReset}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "1.3rem", sm: "2rem" },
                    mb: 2,
                  }}
                >
                  {cityData.city}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1.8rem", sm: "2.5rem" },
                      }}
                    >
                      {Math.round(cityData.temp)}°C
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        opacity: 0.9,
                        fontSize: { xs: "1rem", sm: "1.1rem" },
                        textTransform: "capitalize",
                      }}
                    >
                      {cityData.desc}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      opacity: 0.85,
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    <Typography variant="body2">
                      Feels like: {Math.round(cityData.feels_like)}°C
                    </Typography>
                    <Typography variant="body2">
                      Humidity: {cityData.humidity}%
                    </Typography>
                    <Typography variant="body2">
                      Pressure: {cityData.pressure} hPa
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </MotionDiv>
        )}
      </AnimatePresence>
    </Box>
  );
}
