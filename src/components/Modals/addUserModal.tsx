import { useContext, useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import { AuthContext } from "../../context/authContext";
import { useAddUserMutation } from "../../store/services/api";
import { ErrorResponse, UserRole } from "../../types";
import { toast } from "react-toastify";
import Loader from "../loader";

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

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<Props> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [addUser, { isError, error, isSuccess, isLoading }] =
    useAddUserMutation();
  const { currentUser, user } = useContext(AuthContext);

  useEffect(() => {
    if (isError) {
      toast.error((error as ErrorResponse).data.message);
    }
    if (isSuccess) {
      onClose();
      setName("");
      setEmail("");
      toast.success("User added successfully");
    }
  }, [isError, isSuccess]);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentUser && user) {
      addUser({
        name,
        email,
        role: UserRole.Client,
        addedBy: {
          name: currentUser.displayName as string,
          role: user.role,
        },
      });
    }
  };
  if (isLoading) return <Loader />;
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h3">Add New User</Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ m: "5px" }}>
            <TextField
              label="Name"
              variant="outlined"
              value={name}
              onChange={handleNameChange}
            />
            <TextField
              label="Email"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
            />
          </Box>
          <Button type="submit" variant="contained">
            Add User
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default AddUserModal;
