import React, { useEffect, useMemo, useState } from "react";
import { Button, Box, Theme } from "@mui/material";
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
    { field: "serialNumber", headerName: "SR No." },
    {
      field: "name",
      headerName: "Name",
      width: 250,
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 250,
    },
    {
      field: "role",
      headerName: "Role",
      width: 250,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      width: 300,
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
        serialNumber: idx,
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
    <Box sx={{ width: "100%" }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
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
