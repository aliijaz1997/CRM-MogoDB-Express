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
import { ImportExport } from "@mui/icons-material";
import { SearchType } from "../../../pages/admin/manage";

interface UsersTableProps {
  usersList: UserType[];
  search: SearchType;
}

type SortOrder = "asc" | "desc";

type SortBy = keyof Omit<UserType, "_id">;

const columns = ["Name", "Email", "Role", "Action"];

function UsersTable({ usersList, search }: UsersTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("role");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 5;

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
  }, [totalPages, itemsPerPage, currentPage, usersList, sortOrder, search]);

  const [deleteUser] = useDeleteUserMutation();

  const handleSort = (selectedSortBy: SortBy) => {
    if (selectedSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(selectedSortBy);
      setSortOrder("asc");
    }
  };

  const StyledCell = ({ name }: { name: string }) => {
    return <TableCell align="left">{name}</TableCell>;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <TableContainer
        sx={{
          backgroundColor: "#E6E6FA",
          boxShadow: "0px 0px 3px 3px lightGray",
          borderRadius: "20px",
        }}
      >
        {selectedUser && (
          <UpdateUserModal
            user={selectedUser}
            open={modalOpen}
            setOpen={setModalOpen}
          />
        )}
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column}
                  align="left"
                  sx={{ minWidth: 150, bgcolor: "#6a1b9a", color: "white" }}
                >
                  {column}
                  {column !== "Action" && (
                    <IconButton
                      onClick={() => {
                        handleSort(column.toLowerCase() as SortBy);
                      }}
                      sx={{ color: "white" }}
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
                    <StyledCell name={user.name} />
                    <StyledCell name={user.email} />
                    <StyledCell name={user.role} />
                    <TableCell sx={{ display: "flex", p: "21px" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setModalOpen(true);
                          setSelectedUser(user);
                        }}
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
                          deleteUser({ id: user._id })
                            .then(() => {
                              toast.success("User deleted Successfully");
                            })
                            .catch((e) => {
                              toast.error(`Error Occurred: ${e}`);
                            });
                        }}
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
      <Box sx={{ m: "10px", bgcolor: "#E6E6FA", borderRadius: "10px" }}>
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
