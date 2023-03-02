import React, { useState, useContext } from "react";
import { Box, TextField, Typography } from "@mui/material";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/services/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { UserRole } from "../../types";
import MenuItem from "@mui/material/MenuItem";

interface RoleField {
  id: string;
}
export default function RoleField({ id }: RoleField) {
  const { idToken: token } = useContext(AuthContext);

  const { data: user } = useGetUserByIdQuery({
    id,
    token,
  });
  const [updateUser] = useUpdateUserMutation();
  return (
    <Box sx={{ m: "10px" }}>
      {user && (
        <TextField
          name="role"
          color="primary"
          variant="standard"
          select
          defaultValue={user.role}
          onChange={(e) => {
            const value = e.target.value;
            if (value === user.role) return;
            updateUser({
              token,
              body: { _id: id, role: value as UserRole },
            })
              .then(() => {
                toast.success("User is updated successfully");
              })
              .catch((err) => {
                toast.error(`Error Occurred: ${err}`);
              });
          }}
        >
          <MenuItem
            sx={{
              "&:hover": {
                color: "#4F45F6",
                backgroundColor: "#D8D6FD",
              },
            }}
            value="client"
          >
            Client
          </MenuItem>
          <MenuItem
            sx={{
              "&:hover": {
                color: "#4F45F6",
                backgroundColor: "#D8D6FD",
              },
            }}
            value="admin"
          >
            Admin
          </MenuItem>
        </TextField>
      )}
    </Box>
  );
}
