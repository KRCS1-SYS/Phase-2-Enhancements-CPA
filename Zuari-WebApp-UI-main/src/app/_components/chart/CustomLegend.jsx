// CustomLegend.jsx
import React from "react";
import { Stack, Typography, Box } from "@mui/material";

const CustomLegend = ({ payload }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {/* Main Line Legend */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 25,
            height: 2,
            backgroundColor: "#8884d8",
          }}
        />
        <Typography variant="body2">Value</Typography>
      </Stack>

      {/* High Reference Line Legend */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 25,
            height: 0,
            borderTop: "2px dashed red", // Dashed border for High line
            backgroundColor: "transparent",
          }}
        />
        <Typography variant="body2">High</Typography>
      </Stack>

      {/* Low Reference Line Legend */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 25,
            height: 0,
            borderTop: "2px dashed blue", // Dashed border for Low line
            backgroundColor: "transparent",
          }}
        />
        <Typography variant="body2">Low</Typography>
      </Stack>
    </Stack>
  );
};

export default CustomLegend;
