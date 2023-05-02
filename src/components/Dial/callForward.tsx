import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  styled,
} from "@mui/material";
import CallIcon from "@mui/icons-material/Call";
import ForwardIcon from "@mui/icons-material/Forward";
import { green } from "@mui/material/colors";

interface CallForwardingDialogProps {
  open: boolean;
  onClose: () => void;
}

const CallForwardingDialog: React.FC<CallForwardingDialogProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Call Forwarding</DialogTitle>
      <DialogContent>
        <DialogContentText>Admin is calling to Client</DialogContentText>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton size="large">
            <CallIcon fontSize="large" color="primary" />
          </IconButton>
          <StyledForwardIcon fontSize="large" color="primary" />
          <IconButton size="large">
            <CallIcon fontSize="large" color="primary" />
          </IconButton>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallForwardingDialog;

const StyledForwardIcon = styled(ForwardIcon)({
  fontSize: "5rem",
  color: green[500],
  margin: "1.5rem",
  animation: "ring 1s infinite",
  "@keyframes ring": {
    "0%": {
      transform: "scale(0.9)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(1.4)",
      opacity: 0,
    },
  },
});
