import React from "react";
import UsersTable from "../../src/components/Tables/usersTable";
import { Box, Typography } from "@mui/material";

export interface SearchType {
  name: string;
  email: string;
  role: string;
}
export default function ManageUsers() {
  return (
    <Box>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "left",
          m: 3,
        }}
        variant="h3"
        component="h1"
      >
        Admin Panel
      </Typography>
      <UsersTable />
    </Box>
  );
}
