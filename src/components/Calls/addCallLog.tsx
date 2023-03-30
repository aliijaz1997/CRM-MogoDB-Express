import { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { CallLog, Status, UserRole } from "../../types/index";
import {
  useCreateCallLogMutation,
  useGetUsersQuery,
} from "../../store/services/api";
import Loader from "../loader";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { AuthContext } from "../../context/authContext";

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
  serialNumber: 0,
  client: { _id: "", name: "" },
  createdBy: { _id: "", name: "" },
  status: Status.PENDING,
};

export const AddCallLogModal: React.FC<AddCallLogModalProps> = ({
  open,
  onClose,
}) => {
  const { user } = useContext(AuthContext);
  const [callLog, setCallLog] = useState<Omit<CallLog, "_id">>({
    ...initialValueCall,
    createdBy: { _id: user?._id as string, name: user?.name as string },
  });

  const [createCallLog, { isLoading }] = useCreateCallLogMutation();
  const { data: users = [] } = useGetUsersQuery();

  const clientUsers = users.filter((u) => u.role === UserRole.Client);

  const handleCreateCallLog = async () => {
    if (user) {
      await createCallLog({
        ...callLog,
        createdBy: { _id: user._id, name: user.name },
      });
    }
    onClose();
    setCallLog(initialValueCall);
  };

  if (!user) return <Loader />;

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
          select
          label="Type"
          value={callLog.client._id}
          onChange={(event) => {
            const _id = event.target.value;
            const selectedUser = clientUsers.find((u) => u._id === _id);
            if (selectedUser) {
              setCallLog((prev) => ({
                ...prev,
                client: { _id: selectedUser._id, name: selectedUser.name },
              }));
            }
          }}
          fullWidth
          margin="normal"
        >
          {clientUsers.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name}
            </MenuItem>
          ))}
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
