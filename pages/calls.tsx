import { useContext, useMemo, useState } from "react";
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
  Modal,
  TextField,
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
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface CallLogTableProps {}
type FilterType = "all" | "incoming" | "outgoing";

export default function CallLogTable() {
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filterDates, setFilterDates] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });

  const [filter, setFilter] = useState<FilterType>("all");

  const { user } = useContext(AuthContext);

  const { data: callLogs = [], isLoading } = useGetCallLogsQuery();
  const [deleteCallLog, { isLoading: isDeleting }] = useDeleteCallLogMutation();
  const [updateCallLog, { isLoading: isUpdating }] = useUpdateCallLogMutation();

  const filteredCallLogs = useMemo(() => {
    const currentRoleLogs =
      user && user.role === UserRole.Admin
        ? callLogs
        : callLogs.filter((c) => c.createdBy._id === user?._id);

    if (!filterDates.startDate || !filterDates.endDate) {
      return currentRoleLogs;
    }
    const startDate = dayjs(filterDates.startDate).startOf("day");
    const endDate = dayjs(filterDates.endDate).endOf("day");

    return currentRoleLogs.filter((callLog) =>
      dayjs(callLog.createdAt).isBetween(startDate, endDate)
    );
  }, [filterDates, callLogs]);

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCallLog(null);
  };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              size="small"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="incoming">Incoming</MenuItem>
              <MenuItem value="outgoing">Outgoing</MenuItem>
            </Select>
          </Box>
          <TextField
            label="Start Date"
            type="date"
            value={filterDates.startDate ?? ""}
            onChange={(event) =>
              setFilterDates({ ...filterDates, startDate: event.target.value })
            }
            InputLabelProps={{ shrink: true }}
            margin="normal"
            size="small"
          />

          <TextField
            label="End Date"
            type="date"
            value={filterDates.endDate ?? ""}
            onChange={(event) =>
              setFilterDates({ ...filterDates, endDate: event.target.value })
            }
            InputLabelProps={{ shrink: true }}
            margin="normal"
            size="small"
          />
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
            {filteredCallLogs.map((callLog) => (
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
                <TableCell>
                  <Typography>
                    {callLog.notes.substring(0, 35)}...{" "}
                    <span
                      onClick={() => {
                        handleModalOpen();
                        setSelectedCallLog(callLog);
                      }}
                      style={{
                        color: "text.primary",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      show more
                    </span>
                  </Typography>
                </TableCell>
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
                      }
                    }}
                    disabled={isUpdating}
                  >
                    {callLog.status}
                  </Button>
                </TableCell>
                <TableCell sx={{ display: "flex" }} align="right">
                  <Button
                    disabled={isDeleting}
                    onClick={() => {
                      setDeleteModal(true);
                      setSelectedCallLog(callLog);
                    }}
                    color="secondary"
                    sx={{ ml: "5px" }}
                    startIcon={<Delete />}
                    variant="contained"
                    size="small"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCallLog(callLog);
                      setEditModal(true);
                    }}
                    color="primary"
                    startIcon={<Edit />}
                    variant="contained"
                    size="small"
                  >
                    Edit
                  </Button>
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
      {selectedCallLog && (
        <Modal
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          open={isModalVisible}
          onClose={handleModalClose}
        >
          <Box
            sx={{
              width: "80vw",
              maxHeight: "80vh",
              overflowY: "auto",
              bgcolor: "white",
            }}
          >
            <Typography sx={{ m: "1rem" }}>{selectedCallLog.notes}</Typography>
          </Box>
        </Modal>
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
