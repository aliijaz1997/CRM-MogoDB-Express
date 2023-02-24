import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import { AuthContext } from "../context/authContext";
import { useGetUserByIdQuery } from "../store/services/api";
import { UserRole } from "../types";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout(props: LayoutProps) {
  const { logout, idToken: token, currentUser } = React.useContext(AuthContext);
  const { data: user } = useGetUserByIdQuery({
    id: currentUser?.uid as string,
    token,
  });
  const router = useRouter();
  const showLayout =
    router.pathname.includes("/login") || router.pathname.includes("/register")
      ? false
      : true;

  return showLayout ? (
    <Box>
      <AppBar position="relative" color="primary">
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: "block" }}
          >
            CRM Tool
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            <Button
              sx={{
                mr: "2px",
                backgroundColor: "white",
                color: "grey",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
                },
              }}
              onClick={() => {
                router.push("/");
              }}
            >
              Home
            </Button>
            {user && user.role === UserRole.Admin && (
              <Button
                size="small"
                sx={{
                  mr: "2px",
                  backgroundColor: "white",
                  color: "grey",
                  "&:hover": {
                    backgroundColor: "black",
                    color: "white",
                  },
                }}
                color="primary"
                onClick={() => {
                  router.push("/admin");
                }}
              >
                Admin
              </Button>
            )}
            <Button
              size="small"
              sx={{
                backgroundColor: "white",
                color: "red",
                "&:hover": {
                  backgroundColor: "red",
                  color: "white",
                },
              }}
              color="secondary"
              onClick={logout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {props.children}
    </Box>
  ) : (
    <React.Fragment>{props.children}</React.Fragment>
  );
}
