import React, { useContext, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Box,
} from "@mui/material";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useTemporaryAuthMutation,
} from "../store/services/api";
import Loader from "./loader";
import { UserRole, UserType } from "../types";
import { toast } from "react-toastify";
import UpdateUserModal from "./updateModal";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { AuthContext } from "../context/authContext";

interface UsersTableProps {}

const columns = ["Name", "Email", "Role", "Action"];

function UsersTable({}: UsersTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const token = useSelector<RootState>((state) => state.auth.token);

  const { CustomSignIn } = useContext(AuthContext);

  const {
    data: usersList,
    isError,
    isLoading,
  } = useGetUsersQuery({ token: token as string });
  const [deleteUser] = useDeleteUserMutation();
  const [temporaryAuth] = useTemporaryAuthMutation();

  if (isError || isLoading) {
    return <Loader />;
  }

  const StyledCell = ({ name, id }: { name: string; id?: string }) => {
    return (
      <TableCell sx={{ color: "white" }} align="right">
        {name}
        {id && (
          <Box
            onClick={() => {
              temporaryAuth({ id }).then((res: any) => {
                const token = res?.data.token;
                CustomSignIn(token);
              });
            }}
          >
            Login with this email
          </Box>
        )}
      </TableCell>
    );
  };

  return (
    <TableContainer>
      {selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}
      <Table stickyHeader aria-label="sticky table">
        <TableHead
          sx={{
            "& th": {
              backgroundColor: "gray",
            },
          }}
        >
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column} align="right" style={{ minWidth: 150 }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {usersList &&
            usersList.map((user) => {
              return (
                <TableRow
                  key={user._id}
                  sx={{ bgcolor: "#485263" }}
                  role="checkbox"
                  tabIndex={-1}
                >
                  <StyledCell name={user.name} />
                  <StyledCell
                    name={user.email}
                    id={user.role !== "admin" ? user._id : undefined}
                  />
                  <StyledCell name={user.role} />
                  <TableCell
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <Button
                      disabled={user.role === UserRole.Admin}
                      variant="contained"
                      color="secondary"
                      size="small"
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
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ ml: "5px" }}
                      onClick={() => {
                        setModalOpen(true);
                        setSelectedUser(user);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UsersTable;
