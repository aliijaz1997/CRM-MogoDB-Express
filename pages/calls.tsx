import { useContext, useState } from "react";
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
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Add, Delete, Edit, PhoneCallback } from "@mui/icons-material";
import {
  useDeleteCallLogMutation,
  useGetCallLogsQuery,
  useUpdateCallLogMutation,
} from "../src/store/services/api";
import { AddCallLogModal } from "../src/components/Calls/addCallLog";
import formatDateTime from "../src/helper/getDate";
import Loader from "../src/components/loader";
import { EditCallLogModal } from "../src/components/Calls/editCallLog";
import { CallLog, Status, UserRole } from "../src/types";
import { styled } from "@mui/material/styles";
import DeleteModal from "../src/components/Modals/deleteModal";
import { AuthContext } from "../src/context/authContext";
import { toast } from "react-toastify";

interface CallLogTableProps {}
type FilterType = "all" | "incoming" | "outgoing";

export default function CallLogTable() {
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");

  const { user } = useContext(AuthContext);

  const { data: callLogs = [], isLoading } = useGetCallLogsQuery();
  const [deleteCallLog, { isLoading: isDeleting }] = useDeleteCallLogMutation();
  const [updateCallLog, { isLoading: isUpdating }] = useUpdateCallLogMutation();

  const callLogsWithRole =
    user && user.role === UserRole.Admin
      ? callLogs
      : callLogs.filter((c) => c.createdBy._id === user?._id);
  const filteredLogs =
    filter === "all"
      ? callLogsWithRole
      : callLogsWithRole.filter((log) => log.type === filter);

  const handleDeleteCallLog = async (id: string) => {
    if (id) {
      await deleteCallLog(id);
      setDeleteModal(false);
      setSelectedCallLog(null);
    }
  };

  if (isLoading || isDeleting) return <Loader />;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="incoming">Incoming</MenuItem>
            <MenuItem value="outgoing">Outgoing</MenuItem>
          </Select>
        </Box>
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
              <TableCell>Serial No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>
                Duration {"("}Minute{")"}
              </TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Status</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.map((callLog) => (
              <TableRow key={callLog._id}>
                <TableCell>{callLog.serialNumber}</TableCell>
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
                <TableCell>{callLog.client.name}</TableCell>
                <TableCell>{callLog.createdBy.name}</TableCell>
                <TableCell>{callLog.notes}</TableCell>
                <TableCell>
                  <Button
                    sx={{
                      color:
                        callLog.status === Status.PENDING
                          ? "orange"
                          : callLog.status === Status.COMPLETED
                          ? "green"
                          : "red",
                    }}
                    size="small"
                    onClick={() => {
                      if (user && user.role !== UserRole.Admin)
                        return toast.info(
                          "Admin can change the status of call logs only !"
                        );
                      if (callLog.status === Status.PENDING) {
                        updateCallLog({
                          _id: callLog._id,
                          status: Status.COMPLETED,
                        });
                      } else if (callLog.status === Status.COMPLETED) {
                        updateCallLog({
                          _id: callLog._id,
                          status: Status.CANCELLED,
                        });
                      } else {
                        updateCallLog({
                          _id: callLog._id,
                          status: Status.PENDING,
                        });
                      }
                    }}
                  >
                    {isUpdating ? (
                      <CircularProgress size={24} />
                    ) : (
                      callLog.status
                    )}
                  </Button>
                </TableCell>
                <TableCell sx={{ display: "flex" }} align="right">
                  <IconButton
                    aria-label="delete"
                    disabled={isDeleting}
                    onClick={() => {
                      setDeleteModal(true);
                      setSelectedCallLog(callLog);
                    }}
                    color="primary"
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
      <DeleteModal
        open={openDeleteModal}
        onClose={() => {
          setDeleteModal(false);
        }}
        onDelete={() => {
          handleDeleteCallLog(selectedCallLog?._id as string);
        }}
      />
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
