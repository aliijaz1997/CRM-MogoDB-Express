import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import * as React from "react";

interface DialogProps {
  callerName: string;
  receiverName: string;
  time: string;
  onCancel: () => void;
  open: boolean;
  onClose: () => void;
}

const OnGoingCallClient: React.FC<DialogProps> = ({
  callerName,
  receiverName,
  time,
  onCancel,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {callerName} &lt; {receiverName} - {time}
      </DialogTitle>
      <DialogContent>
        <div>Call is ongoing</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} variant="contained" color="secondary">
          End Call
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OnGoingCallClient;
