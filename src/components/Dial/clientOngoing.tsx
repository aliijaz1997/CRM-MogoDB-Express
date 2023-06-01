import { SwapHoriz, TransferWithinAStation } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import * as React from "react";

interface DialogProps {
  callerName: string;
  receiverName: string;
  newCallerName: string;
  transferCall: boolean;
  time: string;
  onCancel: () => void;
  open: boolean;
  onClose: () => void;
  totalClients: { name: string; phoneNumber: string }[];
}

const OnGoingCallClient: React.FC<DialogProps> = ({
  callerName,
  receiverName,
  time,
  newCallerName,
  transferCall,
  totalClients,
  onCancel,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {transferCall ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <div className="icon-container">
            <SwapHoriz color="success" />
          </div>
          <Typography variant="body1" className="transfer-text">
            {callerName} is transferring call to {newCallerName}...
          </Typography>
        </Box>
      ) : (
        <Box>
          <DialogTitle>
            {callerName} &lt; {receiverName} - {time}
          </DialogTitle>
          <DialogContent>
            <div>Call is ongoing</div>
            {totalClients.length > 0 && (
              <Box>
                Other users who are attending this call are{" "}
                {totalClients.map((client) => client.name).join(",")}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancel} variant="contained" color="secondary">
              End Call
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default OnGoingCallClient;
