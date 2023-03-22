import { LockOutlined } from "@mui/icons-material";
import { TextField, Button, Avatar, Box } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { toast } from "react-toastify";
import auth from "../src/utils/firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      4;
      toast.success("Reset Password link sent to the email provided");
    } catch (error) {
      console.error(error);
      toast.error(`Error Occurred: ${error}`);
    }
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    handlePasswordReset();
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlined />
      </Avatar>
      {!success ? (
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
            <Button
              sx={{ mt: "10px" }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Reset Password
            </Button>
          </Box>
        </form>
      ) : (
        <p>Password reset email sent. Check your inbox.</p>
      )}
    </Box>
  );
};

export default ForgotPassword;
