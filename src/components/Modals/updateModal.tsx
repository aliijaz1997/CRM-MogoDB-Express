import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { UserType } from "../../types";
import NameField from "../Description/name";
import { TextField } from "@mui/material";
import RoleField from "../Description/role";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface UserModalUpdateProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  user: UserType;
}
export default function UpdateUserModal({
  setOpen,
  open,
  user,
}: UserModalUpdateProps) {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          color="primary"
          variant="h3"
          component="h2"
        >
          User details
        </Typography>
        <Box sx={{ display: "flex", m: "10px" }}>
          <NameField id={user._id} userName={user.name} userRole={user.role} />
          <TextField
            sx={{ m: "10px" }}
            value={user.email}
            InputProps={{ readOnly: true }}
          />
        </Box>
        <Box sx={{ display: "flex" }}>
          <RoleField id={user._id} userRole={user.role} />
        </Box>
      </Box>
    </Modal>
  );
}
