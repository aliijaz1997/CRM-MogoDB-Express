import React from "react";
import UsersTable from "../../src/components/Tables/usersTable";
import { Box, TextField, Typography } from "@mui/material";
import { useGetUsersQuery } from "../../src/store/services/api";
import Loader from "../../src/components/loader";
import { UserRole } from "../../src/types";

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
