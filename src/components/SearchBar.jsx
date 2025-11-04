import React from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const MotionDiv = motion.div;

export default function SearchBar({
  focused,
  setFocused,
  searchQuery,
  setSearchQuery,
  searchCity,
  loading,
}) {
  return (
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
                  sx={{ color: "rgba(255,255,255,0.7)", mr: 1 }}
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
                  }}
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
            "& fieldset": {
              borderColor: "rgba(255,255,255,0.18)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255,255,255,0.45)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(138,180,255,0.95)",
              borderWidth: "1.6px",
            },
            "& input": {
              color: "white",
            },
          },
        }}
      />
    </MotionDiv>
  );
}
