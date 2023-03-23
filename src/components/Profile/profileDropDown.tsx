import React, { useContext } from "react";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import { AuthContext } from "../../context/authContext";
import { useRouter } from "next/router";

interface ProfileDropDownProps {
  anchorProfileEl: HTMLElement | null;
  setAnchorProfileEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}
const ProfileDropdown = ({
  anchorProfileEl,
  setAnchorProfileEl,
}: ProfileDropDownProps) => {
  const router = useRouter();
  const handleMenuClose = () => {
    setAnchorProfileEl(null);
  };

  const { logout } = useContext(AuthContext);

  return (
    <Menu
      anchorEl={anchorProfileEl}
      open={Boolean(anchorProfileEl)}
      onClose={handleMenuClose}
      sx={{ p: "10px" }}
    >
      <MenuItem
        onClick={() => {
          router.push("/profile");
        }}
      >
        <ListItemIcon>
          <AccountCircle color="primary" />
        </ListItemIcon>
        <ListItemText sx={{ color: "#6a1b9a" }} primary="Profile" />
      </MenuItem>
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <Logout color="secondary" />
        </ListItemIcon>
        <ListItemText sx={{ color: "#d32f2f" }} primary="Log Out" />
      </MenuItem>
    </Menu>
  );
};

export default ProfileDropdown;
