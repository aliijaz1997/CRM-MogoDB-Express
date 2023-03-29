import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Button,
  Theme,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, PhoneCallback } from "@mui/icons-material";
import {
  useDeleteCallLogMutation,
  useGetCallLogsQuery,
} from "../src/store/services/api";
import { AddCallLogModal } from "../src/components/Calls/addCallLog";
import formatDateTime from "../src/helper/getDate";
import Loader from "../src/components/loader";
import { EditCallLogModal } from "../src/components/Calls/editCallLog";
import { CallLog } from "../src/types";
import { styled } from "@mui/material/styles";

interface CallLogTableProps {}

export default function CallLogTable() {
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setEditModal] = useState(false);

  const { data: callLogs = [], isLoading } = useGetCallLogsQuery();
  const [deleteCallLog, { isLoading: isDeleting }] = useDeleteCallLogMutation();

  const handleDeleteCallLog = async (id: number) => {
    await deleteCallLog(id);
  };

  if (isLoading) return <Loader />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>Filter</Box>
        <Typography variant="h3">Call Logs</Typography>
        <Button
          onClick={() => {
            setOpenAddModal(true);
          }}
          startIcon={<Add />}
          variant="contained"
          size="small"
        >
          Add Call
        </Button>
      </Box>
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>
                Duration {"("}Minute{")"}
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {callLogs.map((callLog) => (
              <TableRow key={callLog._id}>
                <TableCell>
                  {formatDateTime(callLog.createdAt as string)}
                </TableCell>
                <TableCell>{callLog.duration}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<PhoneCallback />}
                    sx={{
                      color:
                        callLog.type === "outgoing" ? "#B3C71A" : "#FF8ABD",
                      bgcolor:
                        callLog.type === "outgoing"
                          ? "#F6FFED   "
                          : "#FFF2F0   ",
                    }}
                    size="small"
                  >
                    {callLog.type}
                  </Button>
                </TableCell>
                <TableCell>{callLog.notes}</TableCell>
                <TableCell sx={{ display: "flex" }} align="right">
                  <IconButton
                    aria-label="delete"
                    disabled={isDeleting}
                    onClick={() => handleDeleteCallLog(callLog._id)}
                    color="secondary"
                  >
                    <Delete />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      setSelectedCallLog(callLog);
                      setEditModal(true);
                    }}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <AddCallLogModal
        open={openAddModal}
        onClose={() => {
          setOpenAddModal(false);
        }}
      />
      {selectedCallLog && (
        <EditCallLogModal
          open={openEditModal}
          onClose={() => {
            setEditModal(false);
          }}
          callLog={selectedCallLog}
        />
      )}
    </Box>
  );
}

const StyledTableContainer = styled(TableContainer)(
  ({ theme }: { theme: Theme }) => ({
    backgroundColor: "white",

    [theme.breakpoints.down("sm")]: {
      maxHeight: 300,
    },
    [theme.breakpoints.up("md")]: {
      maxHeight: 700,
    },
  })
);
