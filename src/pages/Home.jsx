import { useState } from "react";
import { Box, Typography, CircularProgress, Card, CardContent } from "@mui/material";
import GlobeComponent from "../components/GlobeComponent.jsx";
import { getWeatherByCoords } from "../api/weather";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelectCity = async (lat, lon) => {
    setLoading(true);
    const data = await getWeatherByCoords(lat, lon);
    setWeather(data);
    setLoading(false);
  };

  return (
    <Box
      sx={{
       
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        bgcolor: "#000",
      }}
    >
      {/* 🌍 Globe */}
      <GlobeComponent onCitySelect={handleSelectCity} />

      {/* ⏳ Loading Spinner */}
      {loading && (
        <CircularProgress
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
        />
      )}

      {/* ☁️ Weather Info Card */}
      {weather && (
        <Card
          sx={{
            position: "absolute",
            bottom: { xs: 10, sm: 20 },
            left: { xs: "50%", sm: 20 },
            transform: { xs: "translateX(-50%)", sm: "none" },
            width: { xs: "90%", sm: "auto" },
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
            borderRadius: 3,
            boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: "1.3rem", sm: "1.8rem" },
                fontWeight: "bold",
                mb: 1,
              }}
            >
              {weather.name}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", sm: "1.2rem" },
                textTransform: "capitalize",
                opacity: 0.9,
              }}
            >
              {weather.weather[0].description}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: "1.5rem", sm: "2rem" },
                fontWeight: "bold",
              }}
            >
              {Math.round(weather.main.temp)}°C
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
