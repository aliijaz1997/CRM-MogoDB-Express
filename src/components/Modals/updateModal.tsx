import * as React from "react";
import { ModifiedUser } from "../../types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import { canThisRoleEdit } from "../../helper/roleAuthor";
import { useUpdateUserMutation } from "../../store/services/api";
import { AuthContext } from "../../context/authContext";
import { Edit } from "@mui/icons-material";

interface UserModalUpdateProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  user: ModifiedUser;
}
export default function UpdateUserModal({
  setOpen,
  open,
  user,
}: UserModalUpdateProps) {
  const [name, setName] = React.useState(user.name);
  const [nameError, setNameError] = React.useState(false);

  const { user: currentUser } = React.useContext(AuthContext);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  React.useEffect(() => {
    setName(user.name);
  }, [user]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.value;
    setName(inputName);
    if (!inputName.match(/^[a-zA-Z0-9 ]+$/)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleUpdateUser = () => {
    if (user) {
      if (currentUser) {
        const allowRoleEdit = canThisRoleEdit({
          role: currentUser.role,
          roleToEdit: user.role,
        });
        if (!allowRoleEdit) {
          setName(user.name);
          return;
        }
      }
      updateUser({ body: { _id: user.id, name } })
        .then(() => {
          toast.success("User updated Successfully");
        })
        .catch((err) => {
          toast.error(`Error Occurred: ${err}`);
        });
    }
  };
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle> User details</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={handleNameChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          margin="normal"
          error={nameError}
          helperText={nameError && "Please enter a valid name."}
        />
        <TextField
          label="Email"
          variant="outlined"
          value={user.email}
          InputLabelProps={{
            shrink: true,
            required: true,
          }}
          fullWidth
          margin="normal"
          disabled={true}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpdateUser}
          startIcon={<Edit />}
          disabled={isLoading || nameError}
          variant="contained"
        >
          update
        </Button>
      </DialogActions>
    </Dialog>
  );
}
