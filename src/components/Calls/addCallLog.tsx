import { FormEvent, useContext, useState } from "react";
import {
  Autocomplete,
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
import { toast } from "react-toastify";

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
  const [errors, setErrors] = useState({
    client: false,
    notes: false,
  });

  const [createCallLog, { isLoading }] = useCreateCallLogMutation();
  const { data: users = [] } = useGetUsersQuery();

  const clientUsers = users.filter((u) => u.role === UserRole.Client);

  const handleCreateCallLog = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isError = Object.values(errors).includes(true);
    if (!callLog.notes) {
      setErrors((prev) => {
        return { ...prev, notes: true };
      });
    }
    if (!callLog.client._id) {
      setErrors((prev) => {
        return { ...prev, client: true };
      });
    }
    if (user && !isError && callLog.notes && callLog.client._id) {
      await createCallLog({
        ...callLog,
        createdBy: { _id: user._id, name: user.name },
      });
      onClose();
      setCallLog(initialValueCall);
    }
  };

  if (!user) return <Loader />;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Call Log</DialogTitle>
      <form onSubmit={handleCreateCallLog}>
        <DialogContent>
          <TextField
            label="Date and Time"
            name="date"
            type="datetime-local"
            value={dayjs(callLog.createdAt)
              .tz("Asia/Karachi")
              .format("YYYY-MM-DDTHH:mm")}
            onChange={(event) => {
              const date = new Date(event.target.value);
              if (date) {
                setCallLog((prev) => ({
                  ...prev,
                  createdAt: date.toISOString(),
                }));
              }
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
            name="duration"
            value={callLog.duration}
            onChange={(event) => {
              const duration = parseInt(event.target.value, 10);
              if (duration > -1) {
                setCallLog((prev) => ({ ...prev, duration }));
              }
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
          <Autocomplete
            options={clientUsers}
            getOptionLabel={(option) => option.name}
            value={clientUsers.find(
              (option) => option._id === callLog.client._id
            )}
            onChange={(event, value) => {
              if (value) {
                const selectedUser = clientUsers.find(
                  (u) => u._id === value._id
                );
                if (selectedUser) {
                  setCallLog((prev) => ({
                    ...prev,
                    client: { _id: selectedUser._id, name: selectedUser.name },
                  }));
                  setErrors((prev) => {
                    return { ...prev, client: false };
                  });
                } else {
                  setErrors((prev) => {
                    return { ...prev, client: true };
                  });
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Client"
                fullWidth
                margin="normal"
                error={errors.client}
                helperText={errors.client && "Please select the client"}
              />
            )}
          />
          <TextField
            label="Notes"
            multiline
            rows={4}
            value={callLog.notes}
            name="notes"
            onChange={(event) => {
              const notes = event.target.value;
              setCallLog((prev) => ({ ...prev, notes }));
              if (notes) {
                setErrors((prev) => {
                  return { ...prev, [event.target.name]: false };
                });
              } else {
                setErrors((prev) => {
                  return { ...prev, [event.target.name]: true };
                });
              }
            }}
            fullWidth
            margin="normal"
            error={errors.notes}
            helperText={errors.notes && "Please enter the notes"}
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
