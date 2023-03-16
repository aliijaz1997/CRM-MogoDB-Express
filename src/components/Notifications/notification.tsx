import { Box, Popover, Typography } from "@mui/material";
import React from "react";
import { useGetNotificationsQuery } from "../../store/services/api";
import Loader from "../loader";

interface PopoverDropdownProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
}

const PopoverDropdown: React.FC<PopoverDropdownProps> = ({
  anchorEl,
  onClose,
}) => {
  const {
    data: notifications,
    isError,
    isLoading,
  } = useGetNotificationsQuery(null);

  if (isError || isLoading || !notifications?.length) return <Loader />;
  return (
    <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={onClose}>
      {notifications.map((item, index) => (
        <Box
          sx={{
            width: "250px",
            borderRadius: "5px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px #6a1b9a",
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
  // Props for MyComponent
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

const NotificationDropDown: React.FC<NotificationDropDownProps> = ({
  anchorEl,
  setAnchorEl,
}) => {
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return <PopoverDropdown anchorEl={anchorEl} onClose={handlePopoverClose} />;
};

export default NotificationDropDown;
