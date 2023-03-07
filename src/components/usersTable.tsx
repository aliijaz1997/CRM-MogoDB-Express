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
} from "@mui/material";
import {
  useDeleteUserMutation,
  useTemporaryAuthMutation,
} from "../store/services/api";
import { UserType } from "../types";
import { toast } from "react-toastify";
import UpdateUserModal from "./updateModal";
import { AuthContext } from "../context/authContext";
import { localStorageService } from "../utils/localStorageService";
import { Login } from "@mui/icons-material";
import { useRouter } from "next/router";

interface UsersTableProps {
  usersList: UserType[];
}

const columns = ["Name", "Email", "Role", "Action"];

function UsersTable({ usersList }: UsersTableProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const router = useRouter();
  const { CustomSignIn } = useContext(AuthContext);

  const [deleteUser] = useDeleteUserMutation();
  const [temporaryAuth] = useTemporaryAuthMutation();

  const adminUser = useMemo(() => {
    return usersList?.find((user) => user.name === "Admin") ?? ({} as UserType);
  }, [usersList]);

  const StyledCell = ({ name, id }: { name: string; id?: string }) => {
    return (
      <TableCell align="left">
        {name}
        {id && (
          <IconButton
            color="success"
            onClick={() => {
              localStorageService.setAdminToken(adminUser._id);
              temporaryAuth({ id }).then((res: any) => {
                const token = res?.data.token;
                CustomSignIn(token);
                router.push("/");
              });
            }}
          >
            <Login />
          </IconButton>
        )}
      </TableCell>
    );
  };

  return (
    <TableContainer
      sx={{
        backgroundColor: "gainsboro",
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
              <TableCell key={column} align="left" style={{ minWidth: 150 }}>
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {usersList &&
            usersList.map((user) => {
              return (
                <TableRow key={user._id} role="checkbox" tabIndex={-1}>
                  <StyledCell name={user.name} />
                  <StyledCell
                    name={user.email}
                    id={user.role !== "admin" ? user._id : undefined}
                  />
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
  );
}

export default UsersTable;
