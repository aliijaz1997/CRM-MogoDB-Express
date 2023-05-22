import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import {
  CheckCircleOutline as CheckCircleOutlineIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

interface CallCompletedModalProps {
  open: boolean;
  callerName: string;
  receiverName: string;
  callDuration: string;
  handleClose: () => void;
}

const CallCompletedModal: React.FC<CallCompletedModalProps> = ({
  open,
  callerName,
  receiverName,
  callDuration,
  handleClose,
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <Typography variant="h6">Call Completed</Typography>
      </DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          <CheckCircleOutlineIcon
            style={{ marginRight: "10px", color: "#4caf50" }}
          />
          <Typography variant="body1">
            Your call has been saved successfully.
          </Typography>
        </div>
        <Typography variant="body1">
          Caller: {callerName} | Receiver: {receiverName}
        </Typography>
        <Typography variant="body1">Duration: {callDuration}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallCompletedModal;
