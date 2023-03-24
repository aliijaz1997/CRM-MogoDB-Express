import { Box, Popover, Typography } from "@mui/material";
import React from "react";
import { Notification } from "../../types";

interface PopoverDropdownProps {
  anchorEl: HTMLButtonElement | null;
  notifications: Notification[];
  onClose: () => void;
}

const PopoverDropdown: React.FC<PopoverDropdownProps> = ({
  anchorEl,
  notifications,
  onClose,
}) => {
  return (
    <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
      <Typography component="h6" variant="h4">
        Notifications
      </Typography>
      {notifications.map((item, index) => (
        <Box
          sx={{
            width: "250px",
            borderRadius: "5px",
            m: "10px",
          }}
          key={index}
        >
          <Typography sx={{ p: "8px", overflowWrap: "break-word" }}>
            {item.description}
          </Typography>
        </Box>
      ))}
    </Popover>
  );
};

interface NotificationDropDownProps {
  anchorEl: HTMLButtonElement | null;
  notifications: Notification[];
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

const NotificationDropDown: React.FC<NotificationDropDownProps> = ({
  anchorEl,
  notifications,
  setAnchorEl,
}) => {
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <PopoverDropdown
      notifications={notifications}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
    />
  );
};

export default NotificationDropDown;
