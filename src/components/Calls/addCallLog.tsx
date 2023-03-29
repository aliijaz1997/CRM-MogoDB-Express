import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { CallLog } from "../../types/index";
import { useCreateCallLogMutation } from "../../store/services/api";
import Loader from "../loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface AddCallLogModalProps {
  open: boolean;
  onClose: () => void;
}

const initialValueCall: Omit<CallLog, "_id"> = {
  createdAt: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
  duration: 0,
  type: "outgoing",
  notes: "",
};

export const AddCallLogModal: React.FC<AddCallLogModalProps> = ({
  open,
  onClose,
}) => {
  const [callLog, setCallLog] =
    useState<Omit<CallLog, "_id">>(initialValueCall);

  const [createCallLog, { isLoading }] = useCreateCallLogMutation();

  const handleCreateCallLog = async () => {
    await createCallLog(callLog);
    onClose();
    setCallLog(initialValueCall);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Call Log</DialogTitle>
      <DialogContent>
        <TextField
          label="Date and Time"
          type="datetime-local"
          value={dayjs(callLog.createdAt)
            .tz("Asia/Karachi")
            .format("YYYY-MM-DDTHH:mm")}
          onChange={(event) => {
            const date = new Date(event.target.value);
            setCallLog((prev) => ({
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
          value={callLog.duration}
          onChange={(event) => {
            const duration = parseInt(event.target.value, 10);
            setCallLog((prev) => ({ ...prev, duration }));
          }}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Type"
          value={callLog.type}
          onChange={(event) => {
            const type = event.target.value as CallLog["type"];
            setCallLog((prev) => ({ ...prev, type }));
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
          value={callLog.notes}
          onChange={(event) => {
            const notes = event.target.value;
            setCallLog((prev) => ({ ...prev, notes }));
          }}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleCreateCallLog} disabled={isLoading}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
