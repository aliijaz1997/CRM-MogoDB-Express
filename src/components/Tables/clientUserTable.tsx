import React, { useContext, useEffect, useMemo, useState } from "react";
import { Button, IconButton, Box, useMediaQuery } from "@mui/material";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useTemporaryAuthMutation,
} from "../../store/services/api";
import { ErrorResponse, ModifiedUser } from "../../types";
import { toast } from "react-toastify";
import UpdateUserModal from "../Modals/updateModal";
import { AuthContext } from "../../context/authContext";
import { localStorageService } from "../../utils/localStorageService";
import { Delete, Edit, Login } from "@mui/icons-material";
import { useRouter } from "next/router";
import AddUserModal from "../Modals/addUserModal";
import formatDateTime from "../../helper/getDate";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridPagination,
  GridSortModel,
} from "@mui/x-data-grid";
import Loader from "../loader";
import { getSortParams } from "../../helper/getSortParams";
import { getFilterParams } from "../../helper/getFilterParams";
import DeleteModal from "../Modals/deleteModal";

interface UsersTableProps {
  addModalOpen: boolean;
  handleCloseAddModal: () => void;
}

function CLientTable({ addModalOpen, handleCloseAddModal }: UsersTableProps) {
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
    client: true,
    page,
    limit: pageSize,
    sort: getSortParams(sortModel) as string,
    filter: getFilterParams(filterModel) as string,
  });
  const { users: clients = [], totalUsers } = data ?? {};

  const { currentUser } = useContext(AuthContext);

  const router = useRouter();
  const { CustomSignIn } = useContext(AuthContext);

  const [deleteUser, { isLoading: isDeleting, isError, error }] =
    useDeleteUserMutation();
  const [temporaryAuth] = useTemporaryAuthMutation();

  const columns: GridColDef[] = [
    { field: "serialNumber", headerName: "SR No.", width: 100 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box>{params.row.name}</Box>
          <IconButton
            color="success"
            size="small"
            sx={{ height: "5px" }}
            onClick={() => {
              if (currentUser) {
                localStorageService.setAdminToken(currentUser.uid);
                temporaryAuth({ id: params.row.id }).then((res: any) => {
                  const token = res?.data.token;
                  CustomSignIn(token);
                  router.push("/");
                });
              }
            }}
          >
            <Login />
          </IconButton>
        </Box>
      ),
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
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  const rows = useMemo(() => {
    return clients.map((client, idx) => {
      return {
        id: client._id,
        serialNumber: idx + page * pageSize + 1,
        name: client.name,
        createdAt: formatDateTime(client.createdAt as string),
        email: client.email,
        addedBy: client.addedBy,
        actions: "",
      };
    });
  }, [clients, page, pageSize, sortModel, filterModel]);

  useEffect(() => {
    if (isError && error && "data" in error) {
      toast.error((error as ErrorResponse).data.message);
    }
  }, [isError, error]);

  if (isLoading) return <Loader />;

  return (
    <Box>
      <DataGrid
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
        rowHeight={40}
        columnHeaderHeight={40}
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
      <AddUserModal open={addModalOpen} onClose={handleCloseAddModal} />
      {selectedUser && (
        <DeleteModal
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          onDelete={async () => {
            await deleteUser({ id: selectedUser.id });
            setDeleteModalOpen(false);
          }}
        />
      )}
    </Box>
  );
}

export default CLientTable;
