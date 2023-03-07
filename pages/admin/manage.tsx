import React from "react";
import UsersTable from "../../src/components/usersTable";
import { Box, MenuItem, TextField } from "@mui/material";
import { useGetUsersQuery } from "../../src/store/services/api";
import Loader from "../../src/components/loader";
import { UserType } from "../../src/types";

const filters = ["name", "role", "email"];
export default function ManageUsers() {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("none");

  const { data: usersList, isError, isLoading } = useGetUsersQuery({});

  const handleOnchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  if (isError || isLoading || !usersList?.length) return <Loader />;

  const filteredUsers = () => {
    if (!search.length) return usersList;
    if (filter !== "none") {
      return usersList.filter((u) => {
        console.log(u[filter as keyof UserType], search);
        return u[filter as keyof UserType]
          .toLowerCase()
          .includes(search.toLowerCase());
      });
    }
    return usersList.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.role.toLowerCase().includes(search.toLowerCase())
    );
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
          label="Search for the user"
          variant="outlined"
          value={search}
          color="primary"
          onChange={handleOnchangeInput}
          sx={{ m: "2px" }}
        />
        <TextField
          value={filter}
          label="Filter"
          color="primary"
          variant="outlined"
          select
          onChange={handleChangeFilter}
          sx={{ m: "2px" }}
        >
          <MenuItem value="none">None</MenuItem>
          {filters.map((f) => (
            <MenuItem key={f} value={f}>
              {f}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <UsersTable usersList={filteredUsers()} />
    </Box>
  );
}
