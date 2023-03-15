import React, { useContext, useState } from "react";
import { Box, TextField } from "@mui/material";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/services/api";
import { toast } from "react-toastify";
import { UserRole } from "../../types";
import MenuItem from "@mui/material/MenuItem";
import { canThisRoleEdit } from "../../helper/roleAuthor";
import { AuthContext } from "../../context/authContext";

interface RoleField {
  id: string;
  userRole: string;
}
export default function RoleField({ id, userRole }: RoleField) {
  const [role, setRole] = useState(userRole);

  const { currentUserRole } = useContext(AuthContext);

  const [updateUser] = useUpdateUserMutation();
  return (
    <Box sx={{ m: "10px" }}>
      <TextField
        name="role"
        color="primary"
        variant="standard"
        select
        value={role}
        onChange={(e) => {
          const value = e.target.value;
          if (value === role) return;

          const allowRoleEdit = canThisRoleEdit({
            role: currentUserRole,
            roleToEdit: role,
          });

          if (!allowRoleEdit) {
            setRole(userRole);
            return;
          }

          updateUser({
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
        <MenuItem
          sx={{
            "&:hover": {
              color: "#4F45F6",
              backgroundColor: "#D8D6FD",
            },
          }}
          value="staff"
        >
          Staff
        </MenuItem>
        <MenuItem
          sx={{
            "&:hover": {
              color: "#4F45F6",
              backgroundColor: "#D8D6FD",
            },
          }}
          value="manager"
        >
          Manager
        </MenuItem>
      </TextField>
    </Box>
  );
}
