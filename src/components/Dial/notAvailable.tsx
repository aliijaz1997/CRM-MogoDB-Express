import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";

interface NotAvailableDialogProps {
  open: boolean;
  onClose: () => void;
  to: { name: string; phoneNumber: string };
}

const NotAvailableDialog: React.FC<NotAvailableDialogProps> = ({
  open,
  to,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {to.name} with ph: {to.phoneNumber} is currently Not Available
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Cancel />
          </IconButton>
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ padding: "24px 16px" }}>
        <Typography>
          We're sorry, but the receiver you're trying to contact is not
          available at this time. Please try again later. Thank you
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default NotAvailableDialog;
