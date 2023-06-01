import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from "@mui/material";
import { Socket } from "socket.io-client";

interface TransferDialogProps {
  caller: { name: string; phoneNumber: string };
  newCaller: { name: string; phoneNumber: string };
  open: boolean;
  socket: Socket<any, any>;
  onClose: () => void;
}

const TransferDialog: React.FC<TransferDialogProps> = ({
  caller,
  newCaller,
  open,
  socket,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Transfer Call</DialogTitle>
      <DialogContent>
        <Typography>
          Caller: {caller.name} {"("} {caller.phoneNumber} {")"}
        </Typography>
        <Typography>
          New Caller: {newCaller.name} {"("} {newCaller.phoneNumber} {")"}
        </Typography>
        <Typography>{caller.name} is requesting a call transfer.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            socket.emit("transfer-request-accepted", { caller, newCaller });
          }}
          variant="contained"
          color="primary"
        >
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferDialog;
