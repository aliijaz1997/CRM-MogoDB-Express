import React, { useState, useContext } from "react";
import { Box, TextField } from "@mui/material";
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

  const { user: currentUser } = useContext(AuthContext);

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
            if (user) {
              if (e.key === "Enter" && name !== user.name) {
                if (currentUser) {
                  const allowRoleEdit = canThisRoleEdit({
                    role: currentUser.role,
                    roleToEdit: userRole,
                  });
                  if (!allowRoleEdit) {
                    setName(user.name);
                    return;
                  }
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
            }
          }}
          onBlur={() => {
            if (user) {
              if (name !== user.name) {
                if (currentUser) {
                  const allowRoleEdit = canThisRoleEdit({
                    role: currentUser.role,
                    roleToEdit: userRole,
                  });
                  if (!allowRoleEdit) {
                    setName(user.name);
                    return;
                  }
                }
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
