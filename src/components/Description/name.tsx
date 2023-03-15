import React, { useState, useContext } from "react";
import { Box, TextField, Typography } from "@mui/material";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/services/api";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import { canThisRoleEdit } from "../../helper/roleAuthor";

interface NameField {
  id: string;
  userName: string;
  userRole: string;
}
export default function NameField({ id, userName, userRole }: NameField) {
  const [name, setName] = useState(userName);
  const [canEdit, setCanEdit] = useState(false);

  const { currentUserRole } = useContext(AuthContext);

  const [updateUser] = useUpdateUserMutation();
  const { data: user } = useGetUserByIdQuery({
    id,
  });
  return (
    <Box sx={{ m: "10px" }}>
      {canEdit ? (
        <TextField
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name !== userName) {
              const allowRoleEdit = canThisRoleEdit({
                role: currentUserRole,
                roleToEdit: userRole,
              });
              if (!allowRoleEdit) {
                setName(userName);
                return;
              }

              updateUser({ body: { _id: id, name } })
                .then(() => {
                  toast.success("User updated Successfully");
                })
                .catch((err) => {
                  toast.error(`Error Occurred: ${err}`);
                });

              setCanEdit(false);
            }
          }}
          onBlur={() => {
            if (name !== userName) {
              const allowRoleEdit = canThisRoleEdit({
                role: currentUserRole,
                roleToEdit: userRole,
              });

              if (!allowRoleEdit) {
                setName(userName);
                return;
              }
              updateUser({ body: { _id: id, name } })
                .then(() => {
                  toast.success("User updated Successfully");
                })
                .catch((err) => {
                  toast.error(`Error Occurred: ${err}`);
                });
            }
            setCanEdit(false);
          }}
        />
      ) : (
        user && (
          <TextField
            value={user.name}
            InputProps={{ readOnly: true }}
            onClick={() => {
              setCanEdit(true);
            }}
          />
        )
      )}
    </Box>
  );
}
