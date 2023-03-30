import React, { useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  IconButton,
  Pagination,
  Box,
} from "@mui/material";
import { useDeleteUserMutation } from "../../store/services/api";
import { UserType } from "../../types";
import { toast } from "react-toastify";
import UpdateUserModal from "../Modals/updateModal";
import { Delete, Edit, ImportExport } from "@mui/icons-material";
import { SearchType } from "../../../pages/admin/users";
import { useStyles } from "./styles";
import formatDateTime from "../../helper/getDate";
import DeleteModal from "../Modals/deleteModal";
import Loader from "../loader";

interface UsersTableProps {
  usersList: UserType[];
  search: SearchType;
}

type SortOrder = "asc" | "desc";

type SortBy = keyof Omit<UserType, "_id">;

const columns = ["Serial No.", "Name", "Email", "Created At", "Role", "Action"];

function UsersTable({ usersList, search }: UsersTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("role");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [openDeleteModal, setDeleteModal] = useState(false);
  const itemsPerPage = 10;

  const classes = useStyles();
  const displayedUsers = useMemo(() => {
    const totalPages = Math.ceil(usersList.length / itemsPerPage);
    setTotalPages(totalPages);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return [...usersList]
      .sort((a, b) => {
        const sortValue = sortOrder === "asc" ? 1 : -1;
        if (a[sortBy] < b[sortBy]) {
          return -sortValue;
        }
        if (a[sortBy] > b[sortBy]) {
          return sortValue;
        }
        return 0;
      })
      .filter((u) => {
        const nameMatch =
          !search.name ||
          u.name.toLowerCase().includes(search.name.toLowerCase());
        const emailMatch =
          !search.email ||
          u.email.toLowerCase().includes(search.email.toLowerCase());
        const roleMatch =
          !search.role ||
          u.role.toLowerCase().includes(search.role.toLowerCase());
        return nameMatch && emailMatch && roleMatch;
      })
      .slice(startIndex, endIndex);
  }, [
    totalPages,
    itemsPerPage,
    currentPage,
    usersList,
    sortOrder,
    search,
    sortBy,
  ]);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const handleSort = (selectedSortBy: SortBy) => {
    if (selectedSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(selectedSortBy);
      setSortOrder("asc");
    }
  };

  const StyledCell = ({ name }: { name: string }) => {
    return (
      <TableCell
        align="left"
        sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
      >
        {name}
      </TableCell>
    );
  };

  if (isDeleting) return <Loader />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      <TableContainer
        sx={{
          boxShadow: "0px 0px 3px 3px lightGray",
        }}
      >
        {selectedUser && (
          <UpdateUserModal
            user={selectedUser}
            open={modalOpen}
            setOpen={setModalOpen}
          />
        )}
        <DeleteModal
          open={openDeleteModal}
          onClose={() => {
            setDeleteModal(false);
          }}
          onDelete={() => {
            if (selectedUser) {
              deleteUser({ id: selectedUser._id })
                .then(() => {
                  toast.success("User deleted Successfully");
                  setDeleteModal(false);
                })
                .catch((e) => {
                  toast.error(`Error Occurred: ${e}`);
                });
            }
          }}
        />
        <Table stickyHeader size="small" aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  align="left"
                  className={classes.tableHead}
                >
                  {column}
                  {column !== "Action" && (
                    <IconButton
                      onClick={() => {
                        if (column === "Serial No.") {
                          handleSort("serialNumber" as SortBy);
                          return;
                        }
                        if (column === "Created At") {
                          handleSort("createdAt" as SortBy);
                          return;
                        }
                        handleSort(column.toLowerCase() as SortBy);
                      }}
                    >
                      <ImportExport />
                    </IconButton>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedUsers &&
              displayedUsers.map((user) => {
                return (
                  <TableRow key={user._id} role="checkbox" tabIndex={-1}>
                    <StyledCell name={`${user.serialNumber}`} />
                    <StyledCell name={user.name} />
                    <StyledCell name={user.email} />
                    <StyledCell name={formatDateTime(user.createdAt)} />
                    <StyledCell name={user.role} />
                    <TableCell
                      sx={{
                        display: "flex",
                        border: "1px solid rgba(224, 224, 224, 1)",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setModalOpen(true);
                          setSelectedUser(user);
                        }}
                        startIcon={<Edit />}
                      >
                        Edit
                      </Button>
                      <Button
                        disabled={user.name === "Admin"}
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ ml: "5px" }}
                        onClick={() => {
                          setDeleteModal(true);
                          setSelectedUser(user);
                        }}
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ m: "10px", borderRadius: "10px" }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_e, page) => {
            setCurrentPage(page);
          }}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
}

export default UsersTable;
