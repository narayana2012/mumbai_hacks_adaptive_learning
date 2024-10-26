import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState("");

  const handleStartLearning = () => {
    navigate(`/home?field=${selectedField}`);
  };

  const handleChange = (event) => {
    setSelectedField(event.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      width={"70%"}
      padding={2}
      sx={{ margin: "auto" }}
    >
      <Typography variant="h6" gutterBottom>
        An adaptive learning app using a multi-step process to ensure
        understanding. Students start with standard explanations and are tested
        on comprehension. If needed, simpler content with detailed examples
        follows. For further support, dialogue-based, byte-by-byte guided
        learning is provided to ensure mastery at each step.
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel id="field-select-label">Select Field</InputLabel>
        <Select
          labelId="field-select-label"
          value={selectedField}
          onChange={handleChange}
          label="Select Field"
        >
          <MenuItem value="Civil Engineer">Civil Engineer</MenuItem>
          <MenuItem value="Sales">Sales</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleStartLearning}
        disabled={!selectedField}
      >
        Start my learning
      </Button>
    </Box>
  );
};

export default Intro;
