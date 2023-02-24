import React from "react";
import UsersTable from "../src/components/usersTable";
import { Box } from "@mui/material";
export default function Admin() {
  return (
    <Box
      sx={{
        p: "20px",
        backgroundColor: "#4f4e4b",
        height: "100vh",
      }}
    >
      <UsersTable />
    </Box>
  );
}
