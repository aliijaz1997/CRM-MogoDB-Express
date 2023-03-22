import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import { styled } from "@mui/system";
import { AuthContext } from "../src/context/authContext";
import auth, { storage } from "../src/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { sendPasswordResetEmail, updateProfile, User } from "firebase/auth";
import { toast } from "react-toastify";
import { UserRole } from "../src/types";
import {
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from "../src/store/services/api";
import {
  ArrowBack,
  ArrowForward,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const StyledContainer = styled(Container)`
  padding: 32px;
  border-radius: 16px;
  background-color: lavender;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const StyledAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
  margin-bottom: 16px;
`;

const StyledButton = styled(Button)`
  margin-top: 16px;
`;

const StyledCircularProgress = styled(CircularProgress)`
  margin-right: 8px;
`;

const InputContainer = styled("div")({
  display: "flex",
  margin: "1rem",
  width: "100%",
});

const steps = ["Profile Setting", "Password Setting"];

const ManageProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { data: user } = useGetUserByIdQuery({
    id: currentUser?.uid as string,
  });
  const [name, setName] = useState(user?.name);
  const [role, setRole] = useState(user?.role);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(
    "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
  );
  const [activeStep, setActiveStep] = React.useState(1);
  const [showPassword, setShowPassword] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [updateUser] = useUpdateUserMutation();

  async function handleFileChange(event: any) {
    const file = event.target.files[0];
    const storageRef = ref(storage, `profile/${currentUser?.uid as string}`);
    uploadBytes(storageRef, file).then((result) => {
      getDownloadURL(result.ref).then((photoURL) => {
        updateProfile(currentUser as User, { photoURL }).then(() => {
          setProfileImage(photoURL);
          toast.success("The photo is updated");
        });
      });
    });
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setRole(event.target.value as UserRole);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user) {
      if (user.name === name && user.role === role) return;

      updateUser({ body: { _id: user?._id, name, role } })
        .then(() => {
          toast.success("You're profile has been updated");
          setName(user.name);
          setRole(user.role);
        })
        .catch((err) => toast.error(`Error Occurred: ${err}`));
    }
  };

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.photoURL) {
        setProfileImage(currentUser.photoURL);
      }
    }
  }, [currentUser?.photoURL]);

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (user) {
      sendPasswordResetEmail(auth, user.email)
        .then(() => {
          toast.success("Password changed");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <StyledContainer maxWidth="lg">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
      >
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <StyledAvatar src={profileImage} alt="Profile Picture" />
          <Button variant="contained" component="label">
            Upload Picture
            <input type="file" onChange={handleFileChange} hidden />
          </Button>
        </Grid>
        <Stepper sx={{ mt: 5 }} activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 1 && (
          <form onSubmit={handleSubmit}>
            <Grid item>
              <Box display="flex">
                <InputContainer>
                  <TextField
                    id="name"
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={handleNameChange}
                    margin="normal"
                  />
                </InputContainer>
                {user && (
                  <InputContainer>
                    <TextField
                      id="email"
                      label="Email"
                      type="email"
                      variant="outlined"
                      value={user.email}
                      disabled
                      margin="normal"
                    />
                  </InputContainer>
                )}
              </Box>
              <InputContainer>
                <TextField
                  id="role"
                  value={role}
                  onChange={handleRoleChange}
                  variant="outlined"
                  select
                >
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="staff">Staff</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                </TextField>
              </InputContainer>
            </Grid>
            <Grid item alignItems="left">
              <Button variant="contained" color="primary" type="submit">
                Update
              </Button>
            </Grid>
          </form>
        )}
        {activeStep == 2 && (
          <Box>
            <form onSubmit={handlePasswordChange}>
              <Grid item display="flex">
                <InputContainer>
                  <TextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      autoComplete: "new-password",
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </InputContainer>
                <InputContainer>
                  <TextField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    InputProps={{
                      autoComplete: "new-password",
                      endAdornment: (
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </InputContainer>
              </Grid>
              <Grid item display="flex" alignItems="center">
                <StyledButton
                  variant="contained"
                  color="primary"
                  // onClick={handleSaveProfile}
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <StyledCircularProgress size={16} color="inherit" />
                    ) : null
                  }
                >
                  Save Changes
                </StyledButton>
              </Grid>{" "}
            </form>
          </Box>
        )}
        <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
          <IconButton
            disabled={activeStep === 1}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ flex: "1 1 auto" }} />
          <IconButton
            onClick={handleNext}
            disabled={activeStep === steps.length}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      </Grid>
    </StyledContainer>
  );
};

export default ManageProfile;
