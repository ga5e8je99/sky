import React from "react";
import { Card, CardContent, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export default React.memo(function WeatherCard({ data, onClose }) {
  const iconUrl = data?.icon
    ? `https://openweathermap.org/img/wn/${data.icon}@2x.png`
    : null;

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.98, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 40 }}
      transition={{ duration: 0.42, ease: "easeOut" }}
      style={{
        position: "absolute",
        bottom: "7%",
        left: "7%",
        transform: "translateX(-20%)",
        zIndex: 10,
        width: "clamp(320px, 90%, 520px)",
      }}
    >
      <Card
        sx={{
          borderRadius: "16px",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(0,0,0,0.68)",
          color: "white",
        }}
      >
        <CardContent sx={{ position: "relative", p: 2.5 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {iconUrl && (
              <Box
                component="img"
                src={iconUrl}
                alt={data.main}
                sx={{ width: 56, height: 56 }}
              />
            )}
            <Box>
              <Typography variant="h5">{data.city}</Typography>
              <Typography variant="body1" sx={{ textTransform: "capitalize" }}>
                {data.desc}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
              mt: 2,
            }}
          >
            <Typography variant="h4">{Math.round(data.temp)}°C</Typography>
            <Box sx={{ opacity: 0.9 }}>
              <Typography>Feels like: {Math.round(data.feels_like)}°C</Typography>
              <Typography>Humidity: {data.humidity}%</Typography>
              <Typography>Pressure: {data.pressure} hPa</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </MotionDiv>
  );
});
