import React from "react";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import { AuthContext } from "../src/context/authContext";
import { useRouter } from "next/router";
import Copyright from "../src/components/copyRight";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../src/store/store";

interface RegisterProps {}

const Register: RegisterProps = () => {
  const { currentUser, register } = React.useContext(AuthContext);
  const router = useRouter();
  const token = useSelector<RootState>((state) => state.auth.token);

  React.useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [currentUser, router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const email = data.get("email") as string;
    const password = data.get("password") as string;
    const role = data.get("role") as string;

    if (email && password && role) {
      if (role === "admin") return toast.info("Admin cannot register");
      register(email, password, name, role);
    }
  };
  return (
    <Box sx={{ backgroundColor: "#F4EFEE", height: "100vh" }}>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            required
            fullWidth
            label="Role"
            name="role"
            color="primary"
            variant="standard"
            select
            defaultValue="client"
          >
            <MenuItem
              sx={{
                "&:hover": {
                  color: "#4F45F6",
                  backgroundColor: "#D8D6FD",
                },
              }}
              value="client"
            >
              Client
            </MenuItem>
            <MenuItem
              sx={{
                "&:hover": {
                  color: "#4F45F6",
                  backgroundColor: "#D8D6FD",
                },
              }}
              value="admin"
            >
              Admin
            </MenuItem>
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link href="/login" variant="body2">
                {"Already have been registered? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Box>
  );
};

export default Register;
