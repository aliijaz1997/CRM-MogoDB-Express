import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { UserRole, UserType } from "../../types";
import { Button, MenuItem, TextField } from "@mui/material";
import { toast } from "react-toastify";
import { canThisRoleEdit } from "../../helper/roleAuthor";
import { useUpdateUserMutation } from "../../store/services/api";
import { AuthContext } from "../../context/authContext";
import { Edit, Update } from "@mui/icons-material";

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
  const [name, setName] = React.useState(user.name);
  const [role, setRole] = React.useState(user.role);

  const { user: currentUser } = React.useContext(AuthContext);

  const [updateUser] = useUpdateUserMutation();

  React.useEffect(() => {
    setName(user.name);
    setRole(user.role);
  }, [user]);

  const handleUpdateUser = () => {
    if (user) {
      if (currentUser) {
        const allowRoleEdit = canThisRoleEdit({
          role: currentUser.role,
          roleToEdit: user.role,
        });
        if (!allowRoleEdit) {
          setName(user.name);
          setRole(user.role);
          return;
        }
      }
      updateUser({ body: { _id: user._id, name, role } })
        .then(() => {
          toast.success("User updated Successfully");
        })
        .catch((err) => {
          toast.error(`Error Occurred: ${err}`);
        });
    }
  };
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
        <Box sx={{ display: "flex", m: "15px" }}>
          <TextField
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            sx={{ m: "5px" }}
            size="small"
          />
          <TextField
            size="small"
            value={user.email}
            sx={{ m: "5px" }}
            InputProps={{ readOnly: true }}
          />
        </Box>
        <Box>
          <TextField
            name="role"
            color="primary"
            variant="standard"
            size="small"
            select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as UserRole);
            }}
          >
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="staff">Staff</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
        </Box>
        <Button
          sx={{ alignSelf: "flex-start", m: "10px" }}
          variant="contained"
          onClick={handleUpdateUser}
          startIcon={<Edit />}
        >
          Update
        </Button>
      </Box>
    </Modal>
  );
}
