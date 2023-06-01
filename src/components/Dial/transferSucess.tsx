import * as React from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  styled,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Styled component for the icon
const IconWrapper = styled("div")`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  svg {
    font-size: 48px;
    color: green;
  }
`;

interface TransferDialogProps {
  open: boolean;
  newCaller: string;
  onClose: () => void;
}

const TransferSuccessDialog: React.FC<TransferDialogProps> = ({
  open,
  newCaller,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Call Transferred</DialogTitle>
      <DialogContent>
        <IconWrapper>
          <CheckCircleIcon />
        </IconWrapper>
        <Typography variant="body1" gutterBottom>
          Call has been transferred to:
        </Typography>
        <Typography variant="h6">{newCaller}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferSuccessDialog;
