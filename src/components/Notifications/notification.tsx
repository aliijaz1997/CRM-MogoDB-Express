import {
  AccountCircle,
  AccountCircleOutlined,
  AccountCircleRounded,
  Person,
} from "@mui/icons-material";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popover,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import { useUpdateNotificationMutation } from "../../store/services/api";
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
  const classes = useStyles({} as any);
  const open = Boolean(anchorEl);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <div className={classes.popover}>
        <Typography className={classes.heading}>Notifications</Typography>
        <Divider />
        <List className={classes.list}>
          {notifications.map((notification) => (
            <ListItemWrapper notification={notification} />
          ))}
        </List>
      </div>
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

interface ListItemProps {
  notification: Notification;
}

const ListItemWrapper: React.FC<ListItemProps> = ({ notification }) => {
  const [updateNotification] = useUpdateNotificationMutation();

  return (
    <ListItem
      onClick={() => {
        updateNotification({ body: { _id: notification._id } });
      }}
      key={notification._id}
      sx={{
        backgroundColor: notification.seen ? "inherit" : "action.hover",
        borderBottom: `1px solid divider`,
      }}
    >
      <ListItemIcon>
        <AccountCircleOutlined />
      </ListItemIcon>
      <ListItemText primary={notification.description} />
    </ListItem>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  popover: {
    padding: "4px",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: "2px",
  },
  list: {
    width: "100%",
    maxWidth: 360,
  },
}));
