import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  SvgIcon,
} from "@mui/material";
import { CallMissed } from "@mui/icons-material";

interface Props {
  open: boolean;
  onClose: () => void;
  caller: string;
}

const MiscallDialog: React.FC<Props> = ({ open, caller, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <SvgIcon component={CallMissed} color="error" sx={{ mr: 1 }} />
          <Typography variant="h6">Miscall</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography>{caller} has made a miscall.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MiscallDialog;
