import React, { useContext, useMemo, useState } from "react";
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
import {
  useDeleteUserMutation,
  useTemporaryAuthMutation,
} from "../../store/services/api";
import { UserType } from "../../types";
import { toast } from "react-toastify";
import UpdateUserModal from "../Modals/updateModal";
import { AuthContext } from "../../context/authContext";
import { localStorageService } from "../../utils/localStorageService";
import { Add, Delete, Edit, ImportExport, Login } from "@mui/icons-material";
import { useRouter } from "next/router";
import { SearchType } from "../../../pages/admin/users";
import AddUserModal from "../Modals/addUserModal";
import formatDateTime from "../../helper/getDate";
import { useStyles } from "./styles";

interface UsersTableProps {
  usersList: UserType[];
  search: SearchType;
  addModalOpen: boolean;
  handleCloseAddModal: () => void;
}

type SortOrder = "asc" | "desc";

type SortBy = keyof Omit<UserType, "_id">;

const columns = [
  "Serial No.",
  "Name",
  "Email",
  "Created At",
  "Added By",
  "Action",
];

function CLientTable({
  usersList,
  search,
  addModalOpen,
  handleCloseAddModal,
}: UsersTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
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
        return nameMatch && emailMatch;
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

  const router = useRouter();
  const { CustomSignIn } = useContext(AuthContext);

  const [deleteUser] = useDeleteUserMutation();
  const [temporaryAuth] = useTemporaryAuthMutation();

  const handleSort = (selectedSortBy: SortBy) => {
    if (selectedSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(selectedSortBy);
      setSortOrder("asc");
    }
  };

  const StyledCell = ({
    name,
    id,
    role,
  }: {
    name: string;
    id?: string;
    role?: string;
  }) => {
    return (
      <TableCell
        align="left"
        sx={{ border: "1px solid rgba(224, 224, 224, 1)" }}
      >
        {name} {role ? `(${role})` : null}
        {id && (
          <IconButton
            color="success"
            size="small"
            sx={{ height: "5px" }}
            onClick={() => {
              if (currentUser) {
                localStorageService.setAdminToken(currentUser.uid);
                temporaryAuth({ id }).then((res: any) => {
                  const token = res?.data.token;
                  CustomSignIn(token);
                  router.push("/");
                });
              }
            }}
          >
            <Login />
          </IconButton>
        )}
      </TableCell>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 2,
      }}
    >
      <TableContainer sx={{ boxShadow: "0px 0px 3px 3px lightGray" }}>
        {selectedUser && (
          <UpdateUserModal
            user={selectedUser}
            open={modalOpen}
            setOpen={setModalOpen}
          />
        )}
        <AddUserModal open={addModalOpen} onClose={handleCloseAddModal} />
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
                  {column !== "Action" && column !== "Added By" && (
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
              displayedUsers.map((user, idx) => {
                return (
                  <TableRow key={user._id} role="checkbox" tabIndex={-1}>
                    <StyledCell name={`${user.serialNumber}`} />
                    <StyledCell name={user.name} />
                    <StyledCell
                      name={user.email}
                      id={user.role !== "admin" ? user._id : undefined}
                    />
                    <StyledCell name={formatDateTime(user.createdAt)} />
                    {user.addedBy ? (
                      <StyledCell
                        name={user.addedBy.name}
                        role={user.addedBy.role}
                      />
                    ) : (
                      <StyledCell name="Self" />
                    )}
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
                          deleteUser({ id: user._id })
                            .then(() => {
                              toast.success("User deleted Successfully");
                            })
                            .catch((e) => {
                              toast.error(`Error Occurred: ${e}`);
                            });
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

export default CLientTable;
