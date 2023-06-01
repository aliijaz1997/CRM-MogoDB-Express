import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
} from "@mui/material";
import * as React from "react";
import { UserType } from "../../types";
import { validatePhoneNumber } from "../../helper/phoneValidation";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import { useGetUsersQuery } from "../../store/services/api";
import Loader from "../loader";
import { Add, ArrowForward } from "@mui/icons-material";

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
  const [action, setAction] = React.useState("none");
  const { data, isLoading } = useGetUsersQuery({ client: false });

  const { users: admins } = data ?? {};

  if (isLoading) return <Loader />;
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
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        {action === "none" && (
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            <IconButton
              onClick={() => {
                setAction("client");
              }}
            >
              <Add sx={{ fontSize: 48, color: "blue" }} />
            </IconButton>
            <IconButton
              onClick={() => {
                setAction("admin");
              }}
            >
              <ArrowForward sx={{ fontSize: 48, color: "green" }} />
            </IconButton>
          </Box>
        )}
        {action === "client" && (
          <>
            {" "}
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
                  setAction("none");
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
            <Button
              onClick={() => {
                setAction("none");
              }}
            >
              Back
            </Button>
          </>
        )}
        {admins && admins.length > 0 && action === "admin" && (
          <>
            <TextField
              select
              fullWidth
              value={"none"}
              onChange={(e) => {
                const phone = e.target.value;
                if (validatePhoneNumber(phone)) {
                  socket.emit("transfer-request", {
                    to: {
                      name: admins.find((a) => a.phoneNumber === phone)?.name,
                      phoneNumber: phone,
                    },
                    from: {
                      name: user?.name,
                      phoneNumber: user?.phoneNumber,
                    },
                  });
                  setAction("none");
                } else {
                  toast.warning("You are trying to call an invalid number");
                }
              }}
            >
              <MenuItem value="none">None</MenuItem>
              {admins.map((admin) => {
                return (
                  <MenuItem key={admin._id} value={admin.phoneNumber}>
                    {admin.name}
                  </MenuItem>
                );
              })}
            </TextField>
            <Button
              onClick={() => {
                setAction("none");
              }}
            >
              Back
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OnGoingCall;
