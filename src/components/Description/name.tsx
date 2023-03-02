import React, { useState, useContext } from "react";
import { Box, TextField, Typography } from "@mui/material";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../../store/services/api";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";

interface NameField {
  id: string;
  userName: string;
}
export default function NameField({ id, userName }: NameField) {
  const [name, setName] = useState(userName);
  const [canEdit, setCanEdit] = useState(false);

  const { data: user } = useGetUserByIdQuery({
    id,
  });
  const [updateUser] = useUpdateUserMutation();
  return (
    <Box sx={{ m: "10px" }}>
      {canEdit ? (
        <TextField
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
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
            updateUser({ body: { _id: id, name } })
              .then(() => {
                toast.success("User updated Successfully");
              })
              .catch((err) => {
                toast.error(`Error Occurred: ${err}`);
              });
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
