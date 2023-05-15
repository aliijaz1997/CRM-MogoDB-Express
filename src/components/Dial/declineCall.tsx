import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface Props {
  open: boolean;
  receiver: string;
  caller: string;
  onClose: () => void;
}

const DeclinedCallDialog: React.FC<Props> = ({
  open,
  onClose,
  caller,
  receiver,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Call Declined</DialogTitle>
      <DialogContent>
        <p>
          {receiver} has declined {caller} call.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeclinedCallDialog;
