import React from "react";
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  Grid,
  Link,
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
import { useGetUserByIdQuery } from "../src/store/services/api";
import { UserRole } from "../src/types";

interface LoginProps {}

const Login: LoginProps = () => {
  const { currentUser, login } = React.useContext(AuthContext);
  const router = useRouter();
  const token = useSelector<RootState>((state) => state.auth.token);

  const { data: user } = useGetUserByIdQuery({
    id: currentUser?.uid as string,
  });

  React.useEffect(() => {
    token
      ? user?.role !== UserRole.Client
        ? router.push("/admin")
        : router.push("/")
      : router.push("/login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, user]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    login(email, password)
      .then((res) => {
        toast.success("Logged in successfully");
      })
      .catch((err) => {
        toast.error("You have provided wrong email or password");
      });
  };
  return (
    <Box sx={{ height: "100vh" }}>
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
          Sign in
        </Typography>
        <form onSubmit={handleSubmit}>
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Box>
  );
};

export default Login;
