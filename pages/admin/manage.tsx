import React from "react";
import UsersTable from "../../src/components/usersTable";
import { Box, TextField } from "@mui/material";
import { useGetUsersQuery } from "../../src/store/services/api";
import Loader from "../../src/components/loader";

export interface SearchType {
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
      <UsersTable usersList={usersList} search={search} />
    </Box>
  );
}
