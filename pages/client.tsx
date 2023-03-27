import { Box, TextField, Typography } from "@mui/material";
import React from "react";
import Loader from "../src/components/loader";
import CLientTable from "../src/components/Tables/clientUserTable";
import { useGetUsersQuery } from "../src/store/services/api";
import { UserRole } from "../src/types";
import { SearchType } from "./admin/users";

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
          display: "flex",
          justifyContent: "left",
          mb: 1,
        }}
        variant="h3"
        component="h1"
      >
        Client Panel
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "left",
        }}
      >
        <TextField
          label="Search user by name"
          name="name"
          variant="outlined"
          value={search?.name}
          color="primary"
          size="small"
          onChange={handleOnchangeInput}
          sx={{ m: "2px" }}
        />
        <TextField
          label="Search user by email"
          name="email"
          variant="outlined"
          value={search?.email}
          color="primary"
          size="small"
          onChange={handleOnchangeInput}
          sx={{ m: "2px" }}
        />
      </Box>
      <CLientTable usersList={filteredtUserList} search={search} />
    </Box>
  );
}
