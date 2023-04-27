import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import CLientTable from "../src/components/Tables/clientUserTable";

export default function Client() {
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };

  return (
    <Box>
      <Typography
        sx={{
          display: "flex",
          m: 3,
        }}
        variant="h3"
        component="h1"
      >
        Client Panel
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          onClick={() => {
            setAddModalOpen(true);
          }}
          startIcon={<Add />}
        >
          Add Client
        </Button>
      </Box>
      <CLientTable
        addModalOpen={addModalOpen}
        handleCloseAddModal={handleCloseAddModal}
      />
    </Box>
  );
}
