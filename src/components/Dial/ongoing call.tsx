import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import * as React from "react";
import { UserType } from "../../types";
import { validatePhoneNumber } from "../../helper/phoneValidation";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";

interface DialogProps {
  caller: { name: string; phoneNumber: string };
  receivers?: { name: string; phoneNumber: string }[];
  time?: Record<string, string>;
  open: boolean;
  clients: UserType[];
  socket: Socket<any, any>;
  user?: UserType;
}

const OnGoingCall: React.FC<DialogProps> = ({
  caller,
  receivers,
  time,
  open,
  clients,
  socket,
  user,
}) => {
  return (
    <Dialog open={open} onClose={() => {}}>
      {receivers &&
        time &&
        receivers.map((rec) => {
          return (
            <Box sx={{ display: "flex" }}>
              <DialogTitle>
                {caller.name} &lt; {rec.name} - {time[rec.phoneNumber]}
              </DialogTitle>
              <Button
                onClick={() => {
                  socket.emit("end-call", { to: rec, from: caller });
                }}
                color="error"
              >
                End Call
              </Button>
            </Box>
          );
        })}
      <DialogContent>
        <div>Call is ongoing</div>
      </DialogContent>
      <DialogActions>
        <TextField
          select
          fullWidth
          value={"none"}
          onChange={(e) => {
            const phone = e.target.value;
            if (validatePhoneNumber(phone)) {
              socket.emit("call-to-client", {
                to: {
                  name: clients?.find((c) => c.phoneNumber === phone)?.name,
                  phoneNumber: phone,
                },
                from: {
                  name: user?.name,
                  phoneNumber: user?.phoneNumber,
                },
              });
            } else {
              toast.warning("You are trying to call an invalid number");
            }
          }}
        >
          <MenuItem value="none">None</MenuItem>
          {clients.map((client) => {
            return (
              <MenuItem key={client._id} value={client.phoneNumber}>
                {client.name}
              </MenuItem>
            );
          })}
        </TextField>
      </DialogActions>
    </Dialog>
  );
};

export default OnGoingCall;
