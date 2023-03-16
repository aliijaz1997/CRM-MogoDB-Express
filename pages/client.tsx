import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import Loader from "../src/components/loader";
import CLientTable from "../src/components/Tables/clientUserTable";
import { useGetUsersQuery } from "../src/store/services/api";
import { UserRole } from "../src/types";
import { SearchType } from "./admin/manage";

export default function Client() {
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
  const filteredtUserList = usersList.filter(
    (user) => user.role === UserRole.Client
  );
  return (
    <Box>
      <Typography
        sx={{
          bgcolor: "lightblue",
          color: "whitesmoke",
          display: "flex",
          justifyContent: "center",
          borderRadius: "10px",
        }}
        variant="h3"
        component="h1"
      >
        Client Panel
      </Typography>
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
      <CLientTable usersList={filteredtUserList} search={search} />
    </Box>
  );
}
