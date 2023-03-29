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
  Call,
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
import Logo from "../../../public/crm-browser-icon.svg";
import Image from "next/image";

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

  const notificationCount = sortedNotifications.filter((n) => !n.seen).length;
  const showSelectedNav = (path: string) => {
    return router.pathname.includes(path) ? true : false;
  };

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
          {!open && <Image alt="Logo" src={Logo} width={50} height={50} />}
          <Typography
            component="h1"
            variant="h3"
            color="inherit"
            noWrap
            sx={{
              ml: 2.5,
              flexGrow: 1,
              visibility: open ? "hidden" : "visible",
            }}
          >
            CRM
          </Typography>

          <IconButton onClick={handleMenuOpen} color="inherit">
            <AccountCircle />
          </IconButton>
          <IconButton onClick={handlePopoverOpen} color="inherit">
            <Badge badgeContent={notificationCount} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" sx={{ bgColor: "red" }} open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: [1],
          }}
        >
          <Image alt="Logo" src={Logo} width={50} height={50} />
          <Typography
            component="h1"
            variant="h3"
            noWrap
            sx={{
              ml: 2.5,
              flexGrow: 1,
              color: "white",
            }}
          >
            CRM
          </Typography>
          <IconButton sx={{ color: "text.secondary" }} onClick={toggleDrawer}>
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
            sx={{
              color:
                showSelectedNav("/admin") && !showSelectedNav("users")
                  ? "text.primary"
                  : "text.secondary",
              "& .MuiListItemIcon-root": {
                color: "text.secondary",
              },
              bgcolor:
                showSelectedNav("/admin") && !showSelectedNav("users")
                  ? "secondary.light"
                  : "",
              "&:hover": {
                cursor: "pointer",
                "& .MuiListItemIcon-root": {
                  // styles for the ListItemIcon when it's a child of the ListItemButton and is hovered over
                  color: "text.primary",
                },
              },
            }}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
          {user?.role !== UserRole.Client && (
            <ListItemButton
              onClick={() => {
                router.push("/client");
              }}
              sx={{
                color: showSelectedNav("/client")
                  ? "text.primary"
                  : "text.secondary",
                "& .MuiListItemIcon-root": {
                  color: "text.secondary",
                },
                bgcolor: showSelectedNav("/client") ? "secondary.light" : "",
                "&:hover": {
                  cursor: "pointer",
                  "& .MuiListItemIcon-root": {
                    // styles for the ListItemIcon when it's a child of the ListItemButton and is hovered over
                    color: "text.primary",
                  },
                },
              }}
            >
              <ListItemIcon>
                <GroupAdd />
              </ListItemIcon>
              <ListItemText primary="Clients" />
            </ListItemButton>
          )}
          {user?.role !== UserRole.Client && (
            <ListItemButton
              onClick={() => {
                router.push("/admin/users");
              }}
              sx={{
                color: showSelectedNav("/users")
                  ? "text.primary"
                  : "text.secondary",
                "& .MuiListItemIcon-root": {
                  color: "text.secondary",
                },
                bgcolor: showSelectedNav("/users") ? "secondary.light" : "",
                "&:hover": {
                  cursor: "pointer",
                  "& .MuiListItemIcon-root": {
                    // styles for the ListItemIcon when it's a child of the ListItemButton and is hovered over
                    color: "text.primary",
                  },
                },
              }}
            >
              <ListItemIcon>
                <ManageAccounts />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          )}
          {user?.role !== UserRole.Client && (
            <ListItemButton
              onClick={() => {
                router.push("/calls");
              }}
              sx={{
                color: showSelectedNav("/calls")
                  ? "text.primary"
                  : "text.secondary",
                "& .MuiListItemIcon-root": {
                  color: "text.secondary",
                },
                bgcolor: showSelectedNav("/calls") ? "secondary.light" : "",
                "&:hover": {
                  cursor: "pointer",
                  "& .MuiListItemIcon-root": {
                    // styles for the ListItemIcon when it's a child of the ListItemButton and is hovered over
                    color: "text.primary",
                  },
                },
              }}
            >
              <ListItemIcon>
                <Call />
              </ListItemIcon>
              <ListItemText primary="Calls" />
            </ListItemButton>
          )}
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            onClick={logout}
            sx={{
              "& .MuiListItemIcon-root": {
                color: "text.secondary",
              },
              "&:hover": {
                cursor: "pointer",
                "& .MuiListItemIcon-root": {
                  color: "text.primary",
                },
              },
            }}
          >
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
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
        <Container maxWidth="xl" sx={{ mt: 1, mb: 1 }}>
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
  backgroundColor: "white",
  color: theme.palette.primary.main,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    backgroundColor: "white",
    color: theme.palette.primary.main,
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
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondary,
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
