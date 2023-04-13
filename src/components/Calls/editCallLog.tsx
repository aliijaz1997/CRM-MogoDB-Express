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
import { CallLog, ModifiedCallLog, Status } from "../../types/";
import { useUpdateCallLogMutation } from "../../store/services/api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
interface EditCallLogModalProps {
  open: boolean;
  onClose: () => void;
  callLog: ModifiedCallLog;
}

export const EditCallLogModal: React.FC<EditCallLogModalProps> = ({
  open,
  onClose,
  callLog,
}) => {
  const [updatedCallLog, setUpdatedCallLog] =
    useState<ModifiedCallLog>(callLog);
  const [notesError, setNotesError] = useState(false);

  const [updateCallLog, { isLoading }] = useUpdateCallLogMutation();

  useEffect(() => {
    setUpdatedCallLog(callLog);
  }, [callLog]);

  const handleUpdateCallLog = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (notesError) return;
    await updateCallLog({ ...updatedCallLog, _id: updatedCallLog.id });
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Call Log</DialogTitle>
      <form onSubmit={handleUpdateCallLog}>
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
            select
            label="Status"
            value={updatedCallLog.status}
            onChange={(event) => {
              const status = event.target.value as CallLog["status"];
              setUpdatedCallLog((prev) => ({ ...prev, status }));
            }}
            fullWidth
            margin="normal"
          >
            <MenuItem value={Status.PENDING}>Pending</MenuItem>
            <MenuItem value={Status.COMPLETED}>Completed</MenuItem>
            <MenuItem value={Status.CANCELLED}>Cancelled</MenuItem>
          </TextField>
          <TextField
            label="Notes"
            multiline
            rows={4}
            value={updatedCallLog.notes}
            onChange={(event) => {
              const notes = event.target.value;

              setUpdatedCallLog((prev) => ({ ...prev, notes }));
              if (notes) {
                setNotesError(false);
              } else {
                setNotesError(true);
              }
            }}
            fullWidth
            margin="normal"
            error={notesError}
            helperText={notesError && "Please enter the notes"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
