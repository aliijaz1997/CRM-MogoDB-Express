import React, { useContext } from "react";
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
import { useDeleteUserMutation, useGetUsersQuery } from "../store/services/api";
import { AuthContext } from "../context/authContext";
import Loader from "./loader";
import { UserRole } from "../types";
import { toast } from "react-toastify";

interface UsersTableProps {}

const columns = ["Name", "Email", "Role", "Action"];

function UsersTable({}: UsersTableProps) {
  const { idToken: token } = useContext(AuthContext);

  const { data: usersList, isError, isLoading } = useGetUsersQuery({ token });
  const [deleteUser] = useDeleteUserMutation();
  if (isError || isLoading) {
    return <Loader />;
  }
  const StyledCell = ({ name }: { name: string }) => {
    return (
      <TableCell sx={{ color: "white" }} align="right">
        {name}
      </TableCell>
    );
  };

  return (
    <TableContainer sx={{ maxHeight: 440 }}>
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
                  <StyledCell name={user.email} />
                  <StyledCell name={user.role} />
                  <TableCell
                    sx={{ textAlign: "right", mr: "1rem", mt: "0.7rem" }}
                  >
                    <Button
                      disabled={user.role === UserRole.Admin}
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => {
                        deleteUser({ id: user._id, token })
                          .then(() => {
                            toast.success("User deleted Successfully");
                          })
                          .catch((e) => {
                            toast.error(`Error Occurred: ${e}`);
                          });
                      }}
                    >
                      Delete User
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
