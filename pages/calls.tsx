import { useContext, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Theme,
  Typography,
  Select,
  MenuItem,
  Modal,
  TextField,
  Pagination,
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

const PAGE_SIZE = 6;
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState<FilterType>("all");

  const { user } = useContext(AuthContext);
  const isAdmin = user && user.role === UserRole.Admin;

  const { data: callLogs, isLoading } = useGetCallLogsQuery();
  const [deleteCallLog, { isLoading: isDeleting }] = useDeleteCallLogMutation();
  const [updateCallLog, { isLoading: isUpdating }] = useUpdateCallLogMutation();

  const filteredCallLogs = useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const currentRoleLogs = isAdmin
      ? callLogs ?? ([] as CallLog[])
      : (callLogs && callLogs.filter((c) => c.createdBy._id === user?._id)) ??
        ([] as CallLog[]);

    const totalPages = Math.ceil(currentRoleLogs.length / PAGE_SIZE);
    setTotalPages(totalPages);

    const startDate = dayjs(filterDates.startDate).startOf("day");
    const endDate = dayjs(filterDates.endDate).endOf("day");

    const filteredLogs = currentRoleLogs.filter((callLog) => {
      if ((filterDates.startDate || filterDates.endDate) && filter === "all") {
        return dayjs(callLog.createdAt).isBetween(startDate, endDate);
      } else if (
        (filterDates.startDate || filterDates.endDate) &&
        filter !== "all"
      ) {
        return (
          dayjs(callLog.createdAt).isBetween(startDate, endDate) &&
          callLog.type === filter
        );
      } else {
        return true;
      }
    });

    return filteredLogs
      .filter((c) =>
        c.createdBy.name.toLowerCase().includes(search.toLowerCase())
      )
      .slice(startIndex, endIndex);
  }, [callLogs, filterDates, filter, page, search]);
  console.log(filteredCallLogs, search);
  const handleModalOpen = () => {
    setIsModalVisible(true);
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedCallLog(null);
  };
  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
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
          alignItems: "center",
          mb: 2,
          mt: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              size="small"
              sx={{ mt: 1 }}
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
          {isAdmin && (
            <TextField
              size="small"
              label="Filter with Admin name"
              variant="outlined"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              sx={{ mt: 1 }}
            />
          )}
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
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          onChange={handleChangePage}
          showFirstButton
          showLastButton
        />
      </Box>
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
