import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  styled,
} from "@mui/material";
import { green } from "@mui/material/colors";
import CallRoundedIcon from "@mui/icons-material/CallRounded";

interface IncomingCallDialogProps {
  open: boolean;
  callerName: string;
  onClose: () => void;
}

const StyledCallIcon = styled(CallRoundedIcon)({
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

const IncomingCallDialog: React.FC<IncomingCallDialogProps> = ({
  open,
  callerName,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Incoming Call</DialogTitle>
      <DialogContent>
        <DialogContentText>{callerName} is calling</DialogContentText>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <StyledCallIcon />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Decline</Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Answer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomingCallDialog;
