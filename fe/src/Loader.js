import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Loader = () => {
  const messages = ["Analyzing", "Optimizing", "Composing"];
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prevMessage) => {
        if (prevMessage < messages.length - 1) {
          return prevMessage + 1;
        } else {
          clearInterval(interval); // Stop at "Composing"
          return prevMessage; // Stay on the last message
        }
      });
    }, 2000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [messages.length]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.9)", // subtle overlay effect
      }}
    >
      <CircularProgress size={60} thickness={5} />
      <Typography variant="h6" sx={{ marginTop: 2, color: "text.secondary" }}>
        {messages[currentMessage]}...
      </Typography>
    </Box>
  );
};

export default Loader;
