import React, { useState } from "react";
import { AuthContext } from "../../context/authContext";
import socket from "../../utils/socket";
import { Box } from "@mui/material";
import IncomingCallDialog from "../Dial/incomingCall";
import OnGoingCallClient from "../Dial/clientOngoing";
import CallCompletedModal from "../Dial/callCompleted";
import MiscallDialog from "../Dial/missedCall";
import Loader from "../loader";

export default function ClientCalling() {
  const [openModal, setOpenModal] = React.useState(false);
  const [caller, setCaller] = React.useState({ name: "", phoneNumber: "" });
  const [response, setResponse] = useState("none");
  const [timer, setTimer] = useState("00:00:00");
  const [newCaller, setNewCaller] = useState({
    name: "",
    phoneNumber: "",
  });
  const [transferCall, setTransferCall] = useState(false);
  const [totalClients, setClients] = useState<
    { name: string; phoneNumber: string }[]
  >([]);

  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (socket) {
      socket.on("call-receive", ({ from, to }) => {
        setOpenModal(true);
        setCaller(from);
      });
      socket.on("call-accepted", () => {
        setResponse("accepted");
        setOpenModal(false);
      });
      socket.on("call-rejected", ({ to, from }) => {
        setOpenModal(false);
      });
      socket.on("call-ended", ({ to, from, duration }) => {
        setOpenModal(false);
        setResponse("ended");
        setTimer(duration);
      });
      socket.on("call-canceled", ({ to, from }) => {
        setResponse("canceled");
        setOpenModal(false);
      });
      socket.on("update-timer", ({ timeString, clients }) => {
        setTimer(timeString);
        setClients(clients);
      });
      socket.on("call-transferred-started", ({ from }) => {
        setCaller(from);
        setNewCaller({ name: "", phoneNumber: "" });
        setTransferCall(false);
      });

      socket.on("transfer-accept-request", ({ to, from }) => {
        setCaller(from);
        setNewCaller(to);
        setTransferCall(true);
      });
    }
  }, [socket]);

  React.useEffect(() => {
    if (user) {
      socket.emit("add-client", user.phoneNumber);
    }
  }, [user]);

  if (!user) {
    return <Loader />;
  }

  return (
    <Box>
      {" "}
      <IncomingCallDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        callerName={caller.name}
        handleAccept={() => {
          socket.emit("accept-call", {
            to: { name: user.name, phoneNumber: user.phoneNumber },
            from: caller,
          });
        }}
        handleCancel={() => {
          socket.emit("reject-call", {
            to: { name: user.name, phoneNumber: user.phoneNumber },
            from: caller,
          });
        }}
      />
      <OnGoingCallClient
        open={response === "accepted"}
        callerName={caller.name}
        receiverName={user.name}
        totalClients={(() => {
          return totalClients.filter((c) => c.phoneNumber !== user.phoneNumber);
        })()}
        time={timer}
        transferCall={transferCall}
        newCallerName={newCaller.name}
        onCancel={() => {
          socket.emit("end-call", {
            to: { name: user.name, phoneNumber: user.phoneNumber },
            from: caller,
          });
          setResponse("none");
        }}
        onClose={() => {}}
      />
      <CallCompletedModal
        open={response === "ended"}
        callerName={caller.name}
        receiverName={user.name}
        callDuration={timer}
        handleClose={() => {
          setResponse("none");
        }}
      />
      <MiscallDialog
        caller={caller.name}
        onClose={() => {
          setResponse("none");
        }}
        open={response === "canceled"}
      />
    </Box>
  );
}
