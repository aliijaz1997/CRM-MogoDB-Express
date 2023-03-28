import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Typography } from "@mui/material";

const DottedLoader: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(5px)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ marginBottom: "1rem" }} />
        <Typography variant="subtitle1" align="center">
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

const Loader: React.FC = () => {
  return (
    <Box>
      <DottedLoader message="Please Wait!" />
    </Box>
  );
};

export default Loader;
