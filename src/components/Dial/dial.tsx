import React, { useContext, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {
  Autocomplete,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@mui/material";
import { Backspace, Call } from "@mui/icons-material";
import { styled } from "@mui/styles";
import { validatePhoneNumber } from "../../helper/phoneValidation";
import CallForwardingDialog from "./callForward";
import { useGetUsersQuery } from "../../store/services/api";
import Loader from "../loader";
import socket from "../../utils/socket";
import { AuthContext } from "../../context/authContext";
import OnGoingCall from "./ongoing call";
import DeclinedCallDialog from "./declineCall";
import { toast } from "react-toastify";
import NotAvailableDialog from "./notAvailable";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}
export default function DialDialog(props: Props) {
  const { isOpen, onClose } = props;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [caller, setCaller] = React.useState({ name: "", phoneNumber: "" });
  const [receiver, setReceiver] = React.useState({ name: "", phoneNumber: "" });
  const [response, setResponse] = useState("none");
  const [timer, setTimer] = useState("00:00:00");
  const { user } = useContext(AuthContext);

  const { data, isLoading } = useGetUsersQuery({
    client: true,
  });
  const { users: clients } = data ?? {};

  useEffect(() => {
    if (socket) {
      socket.on("call-accepted", ({ to, from }) => {
        setOpenModal(false);
        setResponse("accepted");
        setCaller(from);
        setReceiver(to);
      });
      socket.on("call-rejected", ({ to, from }) => {
        setResponse("declined");
        setOpenModal(false);
        setCaller(from);
        setReceiver(to);
      });
      socket.on("not-available", ({ to }) => {
        setResponse("not-available");
        setOpenModal(false);
        setReceiver(to);
      });
      socket.on("update-timer", (timerString) => {
        setTimer(timerString);
      });
    }
  }, [socket]);

  const handleNumberButtonClick = (number: number) => {
    if (phoneNumber.length < 11) {
      setPhoneNumber(phoneNumber + number);
    }
  };

  const handleCallButtonClick = () => {
    if (phoneNumber.length === 11 && validatePhoneNumber(phoneNumber)) {
      setOpenModal(true);
      socket.emit("call-to-client", {
        to: {
          name:
            clients?.find((c) => c.phoneNumber === phoneNumber)?.name ||
            "Unknown",
          phoneNumber,
        },
        from: {
          name: user?.name,
          phoneNumber: user?.phoneNumber,
        },
      });
    } else {
      toast.warning("Please enter 11 char valid phone number");
    }
  };

  const handleBackspaceClick = () => {
    setPhoneNumber((prevPhoneNumber) =>
      prevPhoneNumber.substring(0, prevPhoneNumber.length - 1)
    );
  };

  const handleBackspacePress = (event: { key: string }) => {
    if (event.key === "Backspace") {
      setPhoneNumber((prevPhoneNumber) =>
        prevPhoneNumber.substring(0, prevPhoneNumber.length - 1)
      );
    }
  };
  if (isLoading || !clients) return <Loader />;
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            value={phoneNumber || "none"}
            onChange={(e) => {
              const phone = e.target.value;
              if (validatePhoneNumber(phone)) {
                setPhoneNumber(phone);
              } else {
                setPhoneNumber("");
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
          <TextField
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="backspace"
                    onClick={handleBackspaceClick}
                    disabled={!phoneNumber}
                  >
                    <Backspace />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            fullWidth
            value={phoneNumber}
            onKeyDown={handleBackspacePress}
            onChange={(event) => {
              const phone = event.target.value;
              const onlyNumbers = /^[0-9]+$/;
              if (phoneNumber.length < 11 && onlyNumbers.test(phone)) {
                setPhoneNumber(phone);
              }
            }}
            placeholder="Enter phone number"
            sx={{
              borderRadius: "50px",
              bgcolor: "background.paper",
              "& .MuiInputBase-input": {
                py: 2,
                px: 3,
                fontSize: "24px",
                textAlign: "center",
                color: "text.primary",
              },
            }}
          />
        </Grid>
        <Grid item>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(1)}>
                1
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(2)}>
                2
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(3)}>
                3
              </NumberButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(4)}>
                4
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(5)}>
                5
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(6)}>
                6
              </NumberButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(7)}>
                7
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(8)}>
                8
              </NumberButton>
            </Grid>
            <Grid item>
              <NumberButton onClick={() => handleNumberButtonClick(9)}>
                9
              </NumberButton>
            </Grid>
          </Grid>
          <Grid>
            <Grid item textAlign="center">
              <NumberButton onClick={() => handleNumberButtonClick(0)}>
                0
              </NumberButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justifyContent="center">
            <Grid item>
              <CallButton aria-label="call" onClick={handleCallButtonClick}>
                <Call sx={{ color: "white" }} />
              </CallButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <CallForwardingDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        onCallCancel={(e) => {
          e.preventDefault();
          socket.emit("cancel-call", {
            to: {
              name:
                clients?.find((c) => c.phoneNumber === phoneNumber)?.name ||
                "Unknown",
              phoneNumber,
            },
            from: {
              name: user?.name,
              phoneNumber: user?.phoneNumber,
            },
          });
          setOpenModal(false);
        }}
      />
      <OnGoingCall
        open={response === "accepted"}
        callerName={caller.name}
        receiverName={receiver.name}
        time={timer}
        onCancel={() => {
          setResponse("none");
        }}
        onClose={() => {
          setResponse("none");
        }}
      />
      <DeclinedCallDialog
        open={response === "declined"}
        caller={caller.name}
        receiver={receiver.name}
        onClose={() => {
          setResponse("none");
        }}
      />
      <NotAvailableDialog
        open={response === "not-available"}
        onClose={() => {
          setResponse("none");
        }}
        to={receiver}
      />
    </Dialog>
  );
}

const NumberButton = styled(Button)({
  borderRadius: "50%",
  width: "64px",
  height: "64px",
  fontSize: "24px",
  fontWeight: "bold",
});

const CallButton = styled(IconButton)({
  borderRadius: "50%",
  width: "80px",
  height: "80px",
  backgroundColor: "#50C878",
  "&:hover": {
    backgroundColor: "#00693E",
  },
  marginBottom: 4,
});
