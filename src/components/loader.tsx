import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#F8F8F8AD",
      }}
    >
      <CircularProgress
        color="info"
        thickness={2}
        sx={{
          position: "absolute",
          left: "50%",
          top: "30%",
          width: "100px !important",
          height: "100px !important",
          zIndex: "9999",
        }}
      />
    </Box>
  );
}
