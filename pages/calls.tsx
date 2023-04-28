import { useContext, useMemo, useState } from "react";
import {
  TableContainer,
  Box,
  Button,
  Theme,
  Typography,
  Select,
  MenuItem,
  Modal,
  TextField,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridPagination,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  Add,
  AddCircle,
  Delete,
  Edit,
  PhoneCallback,
} from "@mui/icons-material";
import {
  useDeleteCallLogMutation,
  useGetCallLogsQuery,
  useUpdateCallLogMutation,
} from "../src/store/services/api";
import { AddCallLogModal } from "../src/components/Calls/addCallLog";
import formatDateTime from "../src/helper/getDate";
import Loader from "../src/components/loader";
import { EditCallLogModal } from "../src/components/Calls/editCallLog";
import { ModifiedCallLog, Status, UserRole } from "../src/types";
import DeleteModal from "../src/components/Modals/deleteModal";
import { AuthContext } from "../src/context/authContext";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { toast } from "react-toastify";
import { getSortParams } from "../src/helper/getSortParams";
import { getFilterParams } from "../src/helper/getFilterParams";

dayjs.extend(isBetween);

export default function CallLogTable() {
  const [selectedCallLog, setSelectedCallLog] =
    useState<ModifiedCallLog | null>(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setEditModal] = useState(false);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const { user } = useContext(AuthContext);

  const { data: callLogData, isLoading } = useGetCallLogsQuery({
    page,
    limit: pageSize,
    sort: getSortParams(sortModel) as string,
    filter: getFilterParams(filterModel) as string,
  });
  const { callLogs = [], totalLogs } = callLogData ?? {};
  const [deleteCallLog, { isLoading: isDeleting }] = useDeleteCallLogMutation();
  const [updateCallLog, { isLoading: isUpdating }] = useUpdateCallLogMutation();

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

  const columns: GridColDef[] = [
    { field: "serialNumber", headerName: "SR No.", width: 70 },
    { field: "createdAt", headerName: "Date", width: 150 },
    {
      field: "duration",
      headerName: "Duration (Minute)",
      type: "number",
      width: 70,
    },
    {
      field: "type",
      headerName: "Type",
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Button
          startIcon={<PhoneCallback />}
          sx={{
            color: params.row.type === "outgoing" ? "#B3C71A" : "#FF8ABD",
            bgcolor:
              params.row.type === "outgoing" ? "#F6FFED   " : "#FFF2F0   ",
          }}
          size="small"
        >
          {params.row.type}
        </Button>
      ),
    },
    { field: "client", headerName: "Client", width: 150 },
    { field: "admin", headerName: "Admin", width: 100 },
    {
      field: "notes",
      headerName: "Notes",
      width: 350,
      sortable: false,
      renderCell: (params) => (
        <Typography>
          {params.row.notes.substring(0, 30)}...{" "}
          <IconButton
            onClick={() => {
              handleModalOpen();
              setSelectedCallLog(params.row);
            }}
          >
            <AddCircle />
          </IconButton>
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          sx={{
            color:
              params.row.status === Status.PENDING
                ? "orange"
                : params.row.status === Status.COMPLETED
                ? "green"
                : "red",
          }}
          size="small"
          onClick={() => {
            if (user && user.role !== UserRole.Admin)
              return toast.info(
                "Admin can change the status of call logs only !"
              );
            if (params.row.status === Status.PENDING && user) {
              updateCallLog({
                _id: params.row.id,
                status: Status.COMPLETED,
                name: user.name,
              });
            }
          }}
          disabled={isUpdating}
        >
          {params.row.status}
        </Button>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex" }}>
          <Button
            disabled={isDeleting}
            onClick={() => {
              setDeleteModal(true);
              setSelectedCallLog(params.row as ModifiedCallLog);
            }}
            color="secondary"
            startIcon={<Delete />}
            variant="contained"
            size="small"
            sx={{ mr: 1 }}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              setSelectedCallLog(params.row as ModifiedCallLog);
              setEditModal(true);
            }}
            color="primary"
            startIcon={<Edit />}
            variant="contained"
            size="small"
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  const rows = useMemo(() => {
    return callLogs.map((callLog, idx) => {
      return {
        id: callLog._id,
        serialNumber: idx,
        createdAt: formatDateTime(callLog.createdAt as string),
        duration: callLog.duration,
        type: callLog.type,
        client: callLog.client.name,
        admin: callLog.createdBy.name,
        notes: callLog.notes,
        status: callLog.status,
        actions: "",
      };
    });
  }, [page, pageSize, callLogs, sortModel, filterModel]);

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
      <Box
        sx={{
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          bgcolor: "white",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection={false}
          rowCount={totalLogs}
          pageSizeOptions={[10, 20, 50, 100]}
          pagination
          paginationMode="server"
          paginationModel={{ pageSize, page: page }}
          onPaginationModelChange={(params) => {
            setPage(params.page);
            setPageSize(params.pageSize);
          }}
          sortingMode="server"
          sortModel={sortModel}
          onSortModelChange={(params) => {
            setSortModel(params);
          }}
          filterMode="server"
          filterModel={filterModel}
          onFilterModelChange={(model) => {
            setFilterModel(model);
          }}
          components={{
            Pagination: GridPagination,
          }}
          loading={isLoading || isDeleting || isUpdating}
          autoHeight={true}
          disableRowSelectionOnClick
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
          if (selectedCallLog) {
            handleDeleteCallLog(selectedCallLog.id);
          }
        }}
      />
    </Box>
  );
}
