import React, { useMemo } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Badge,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  styled,
} from "@mui/material";
import { AuthContext } from "../../context/authContext";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AccountCircle,
  ChevronLeft,
  GroupAdd,
  Logout,
  ManageAccounts,
  RotateLeft,
} from "@mui/icons-material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  useGetNotificationsQuery,
  useGetUserByIdQuery,
  useTemporaryAuthMutation,
} from "../../store/services/api";
import Copyright from "../copyRight";
import Dashboard from "@mui/icons-material/Dashboard";
import { UserRole } from "../../types";
import { localStorageService } from "../../utils/localStorageService";
import { toast } from "react-toastify";
import Loader from "../loader";
import { useRouter } from "next/router";
import NotificationDropDown from "../Notifications/notification";
import ProfileDropdown from "../Profile/profileDropDown";

interface LayoutProps {
  children: React.ReactNode;
}

const MAX_RECENT_COUNT = 8;

export default function Layout(props: LayoutProps) {
  const [open, setOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [anchorProfileEl, setAnchorProfileEl] =
    React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorProfileEl(event.currentTarget);
  };
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const adminToken = localStorageService.getAdminToken();
  const router = useRouter();

  const { CustomSignIn, logout, currentUser } = React.useContext(AuthContext);
  const {
    data: user,
    isError,
    isLoading,
  } = useGetUserByIdQuery({
    id: currentUser?.uid as string,
  });
  const [temporaryAuth] = useTemporaryAuthMutation();
  const { data: notifications } = useGetNotificationsQuery(null);

  const sortedNotifications = useMemo(() => {
    if (!notifications) return [];
    return [...notifications]
      .sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      })
      .slice(0, MAX_RECENT_COUNT);
  }, [notifications]);

  if (isError || isLoading || !user) {
    return <Loader />;
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px", // keep right padding when drawer closed
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Client Management System
          </Typography>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
          <IconButton onClick={handlePopoverOpen} color="inherit">
            <Badge
              badgeContent={
                sortedNotifications ? sortedNotifications.length : 0
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton color="primary" onClick={toggleDrawer}>
            <ChevronLeft />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          <ListItemButton
            onClick={() => {
              if (user?.role === UserRole.Admin) {
                router.push("/admin");
              } else {
                router.push("/");
              }
            }}
          >
            <ListItemIcon>
              <Dashboard color="primary" />
            </ListItemIcon>
            <ListItemText sx={{ color: "#6a1b9a" }} primary="Dashboard" />
          </ListItemButton>
          {user?.role !== UserRole.Client && (
            <ListItemButton
              onClick={() => {
                router.push("/client");
              }}
            >
              <ListItemIcon>
                <GroupAdd color="primary" />
              </ListItemIcon>
              <ListItemText sx={{ color: "#6a1b9a" }} primary="Clients" />
            </ListItemButton>
          )}
          {user?.role !== UserRole.Client && (
            <ListItemButton
              onClick={() => {
                router.push("/admin/manage");
              }}
            >
              <ListItemIcon>
                <ManageAccounts color="primary" />
              </ListItemIcon>
              <ListItemText sx={{ color: "#6a1b9a" }} primary="Users" />
            </ListItemButton>
          )}
          <Divider sx={{ my: 1 }} />
          <ListSubheader component="div" inset>
            Actions
          </ListSubheader>
          <ListItemButton onClick={logout}>
            <ListItemIcon>
              <Logout color="secondary" />
            </ListItemIcon>
            <ListItemText sx={{ color: "#d32f2f" }} primary="Log Out" />
          </ListItemButton>
          {adminToken && (
            <ListItemButton
              onClick={() => {
                const adminId = localStorageService.getAdminToken();
                temporaryAuth({ id: adminId as string })
                  .then((res: any) => {
                    const token = res?.data.token;
                    CustomSignIn(token);
                    router.push("/client");
                  })
                  .then(() => {
                    localStorageService.removeAdminToken();
                  })
                  .catch((err: any) => {
                    toast.error(`Error Occurred: ${err}`);
                  });
              }}
            >
              <ListItemIcon>
                <RotateLeft />
              </ListItemIcon>
              <ListItemText primary="Return to Admin" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, height: "100vh", overflowX: "auto" }}
      >
        <Toolbar />
        {notifications && (
          <NotificationDropDown
            notifications={sortedNotifications}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
          />
        )}
        <ProfileDropdown
          anchorProfileEl={anchorProfileEl}
          setAnchorProfileEl={setAnchorProfileEl}
        />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          {props.children}
          <Box
            component="footer"
            sx={{
              py: 6,
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="h6" align="center" gutterBottom>
                CRM (Client Relation Management)
              </Typography>
              <Typography variant="subtitle1" align="center" component="p">
                All copy rights are reserved for this web app
              </Typography>
              <Copyright />
            </Container>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
