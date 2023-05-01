import { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { AuthContext } from "../../context/authContext";
import { useAddUserMutation } from "../../store/services/api";
import { ErrorResponse, UserRole } from "../../types";
import { toast } from "react-toastify";
import Loader from "../loader";
import { validatePhoneNumber } from "../../helper/phoneValidation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddUserModal: React.FC<Props> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

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
    const inputName = e.target.value;
    setName(inputName);
    if (!inputName.match(/^[a-zA-Z0-9 ]+$/)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    if (!inputEmail.match(/\S+@\S+\.\S+/)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputPhoneNumber = event.target.value;
    setPhoneNumber(inputPhoneNumber);
    setIsPhoneNumberValid(validatePhoneNumber(inputPhoneNumber));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.match(/^[a-zA-Z0-9 ]+$/)) {
      setNameError(true);
    }
    if (!email.match(/\S+@\S+\.\S+/)) {
      setEmailError(true);
    }
    if (
      currentUser &&
      user &&
      name.match(/^[a-zA-Z0-9 ]+$/) &&
      email.match(/\S+@\S+\.\S+/) &&
      isPhoneNumberValid
    ) {
      addUser({
        name,
        email,
        role: UserRole.Client,
        addedBy: {
          name: currentUser.displayName as string,
          role: user.role,
        },
        phoneNumber,
      });
    }
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Client</DialogTitle>
      <form onSubmit={handleSubmit}>
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
            value={email}
            onChange={handleEmailChange}
            InputLabelProps={{
              shrink: true,
              required: true,
            }}
            fullWidth
            margin="normal"
            error={emailError}
            helperText={emailError && "Please enter a valid email."}
          />
          <TextField
            label="Phone Number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            error={!isPhoneNumberValid}
            helperText={isPhoneNumberValid ? null : "Invalid phone number"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || nameError || emailError}
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddUserModal;
