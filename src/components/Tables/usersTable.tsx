import React, { useEffect, useMemo, useState } from "react";
import { Button, Box, Theme, useMediaQuery } from "@mui/material";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../store/services/api";
import { ErrorResponse, ModifiedUser, UserRole } from "../../types";
import { toast } from "react-toastify";
import UpdateUserModal from "../Modals/updateModal";
import { Delete, Edit } from "@mui/icons-material";
import formatDateTime from "../../helper/getDate";
import DeleteModal from "../Modals/deleteModal";
import Loader from "../loader";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridPagination,
  GridSortModel,
} from "@mui/x-data-grid";
import { getFilterParams } from "../../helper/getFilterParams";
import { getSortParams } from "../../helper/getSortParams";
import { styled } from "@mui/styles";

function UsersTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ModifiedUser | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({
    items: [],
  });

  const isFullScreen = useMediaQuery("(min-width:1024px)");
  const { data, isLoading } = useGetUsersQuery({
    client: false,
    page,
    limit: pageSize,
    sort: getSortParams(sortModel) as string,
    filter: getFilterParams(filterModel) as string,
  });
  const { users: admins = [], totalUsers } = data ?? {};

  const [deleteUser, { isLoading: isDeleting, isError, error }] =
    useDeleteUserMutation();

  const columns: GridColDef[] = [
    { field: "serialNumber", headerName: "SR No.", width: 100 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex" }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              setModalOpen(true);
              setSelectedUser(params.row);
            }}
            startIcon={<Edit />}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            sx={{ ml: "5px" }}
            onClick={() => {
              setDeleteModalOpen(true);
              setSelectedUser(params.row);
            }}
            startIcon={<Delete />}
            disabled={params.row.role === UserRole.Admin}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const rows = useMemo(() => {
    return admins.map((admins, idx) => {
      return {
        id: admins._id,
        serialNumber: idx + page * pageSize + 1,
        name: admins.name,
        createdAt: formatDateTime(admins.createdAt as string),
        email: admins.email,
        role: admins.role,
        actions: "",
      };
    });
  }, [admins, page, pageSize, sortModel, filterModel]);

  useEffect(() => {
    if (isError && error && "data" in error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }, [isError, error]);

  if (isLoading) return <Loader />;

  return (
    <Box>
      <StyledDataGrid
        sx={{
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid grey",
            borderRight: "1px solid #000",
          },
          "& .MuiDataGrid-row": {
            borderRight: "1px solid grey",
          },
          "& .MuiDataGrid-column": {
            borderRight: "1px solid grey",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "lightgrey",
          },
          "& .MuiDataGrid-virtualScroller": {
            overflowX: isFullScreen ? "hidden" : "auto",
          },
          border: "1px solid rgba(224, 224, 224, 1)",
          borderRadius: "5px",
          bgcolor: "white",
        }}
        rows={rows}
        columns={columns}
        rowHeight={40}
        columnHeaderHeight={40}
        rowCount={totalUsers}
        checkboxSelection={false}
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
        loading={isLoading || isDeleting}
        autoHeight={true}
        rowSelection={false}
      />
      {selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
      {selectedUser && (
        <DeleteModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onDelete={() => {
            deleteUser({ id: selectedUser.id });
          }}
        />
      )}
    </Box>
  );
}

export default UsersTable;

const StyledDataGrid = styled(DataGrid)(({ theme }: { theme: Theme }) => ({
  "& .MuiDataGrid-root": {
    border: "1px solid #c4c4c4",
  },

  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "gray",
    color: "black",
  },

  "& .MuiDataGrid-cell": {
    borderRight: "1px solid #c4c4c4",
    borderBottom: "1px solid #c4c4c4",
  },

  "& .MuiDataGrid-columnsContainer": {
    backgroundColor: "#1e4ba4",
    color: "#ffffff",
  },
  "& .MuiDataGrid-footerContainer": {
    display: "flex",
    justifyContent: "center",
  },
}));
