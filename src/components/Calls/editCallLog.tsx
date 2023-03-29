import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { CallLog } from "../../types/";
import { useUpdateCallLogMutation } from "../../store/services/api";
import dayjs from "dayjs";
import Loader from "../loader";
import formatDateTime from "../../helper/getDate";

interface EditCallLogModalProps {
  open: boolean;
  onClose: () => void;
  callLog: CallLog;
}

export const EditCallLogModal: React.FC<EditCallLogModalProps> = ({
  open,
  onClose,
  callLog,
}) => {
  const [updatedCallLog, setUpdatedCallLog] = useState<CallLog>(callLog);

  const [updateCallLog, { isLoading }] = useUpdateCallLogMutation();

  useEffect(() => {
    setUpdatedCallLog(callLog);
  }, [callLog]);

  const handleUpdateCallLog = async () => {
    await updateCallLog(updatedCallLog);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Call Log</DialogTitle>
      <DialogContent>
        <TextField
          label="Date"
          type="datetime-local"
          value={dayjs(updatedCallLog.createdAt)
            .tz("Asia/Karachi")
            .format("YYYY-MM-DDTHH:mm")}
          onChange={(event) => {
            const date = new Date(event.target.value);
            setUpdatedCallLog((prev) => ({
              ...prev,
              createdAt: date.toISOString(),
            }));
          }}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Duration (in minutes)"
          type="number"
          value={updatedCallLog.duration}
          onChange={(event) => {
            const duration = parseInt(event.target.value, 10);
            setUpdatedCallLog((prev) => ({ ...prev, duration }));
          }}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Type"
          value={updatedCallLog.type}
          onChange={(event) => {
            const type = event.target.value as CallLog["type"];
            setUpdatedCallLog((prev) => ({ ...prev, type }));
          }}
          fullWidth
          margin="normal"
        >
          <MenuItem value="incoming">Incoming</MenuItem>
          <MenuItem value="outgoing">Outgoing</MenuItem>
        </TextField>
        <TextField
          label="Notes"
          multiline
          rows={4}
          value={updatedCallLog.notes}
          onChange={(event) => {
            const notes = event.target.value;
            setUpdatedCallLog((prev) => ({ ...prev, notes }));
          }}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleUpdateCallLog} disabled={isLoading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
