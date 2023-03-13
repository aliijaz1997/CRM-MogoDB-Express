import React from "react";
import UsersTable from "../../src/components/usersTable";
import { Box, TextField } from "@mui/material";
import { useGetUsersQuery } from "../../src/store/services/api";
import Loader from "../../src/components/loader";

interface SearchType {
  name: string;
  email: string;
  role: string;
}
export default function ManageUsers() {
  const [search, setSearch] = React.useState<SearchType>({
    name: "",
    email: "",
    role: "",
  });

  const { data: usersList, isError, isLoading } = useGetUsersQuery({});

  const handleOnchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  if (isError || isLoading || !usersList?.length) return <Loader />;

  const filteredUsers = () => {
    if (!search.name && !search.email && !search.role) return usersList;

    const users = usersList.filter((u) => {
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
    });
    return users;
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: "15px",
        }}
      >
        <TextField
          label="Search user by name"
          name="name"
          variant="outlined"
          value={search?.name}
          color="primary"
          onChange={handleOnchangeInput}
          sx={{ m: "2px" }}
        />
        <TextField
          label="Search user by email"
          name="email"
          variant="outlined"
          value={search?.email}
          color="primary"
          onChange={handleOnchangeInput}
          sx={{ m: "2px" }}
        />
        <TextField
          label="Search user by role"
          name="role"
          variant="outlined"
          value={search?.role}
          color="primary"
          onChange={handleOnchangeInput}
          sx={{ m: "2px" }}
        />
      </Box>
      <UsersTable usersList={filteredUsers()} />
    </Box>
  );
}
