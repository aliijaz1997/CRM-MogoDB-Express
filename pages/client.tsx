import React from "react";
import { Add } from "@mui/icons-material";
import { Box, Button, TextField, Typography } from "@mui/material";
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
  const [addModalOpen, setAddModalOpen] = React.useState(false);

  const { data: usersList, isError, isLoading } = useGetUsersQuery();

  const handleOnchangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
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
          m: 3,
        }}
        variant="h3"
        component="h1"
      >
        Client Panel
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "left",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Filters</Typography>
          <TextField
            label="Search client by name"
            name="name"
            variant="outlined"
            value={search?.name}
            color="primary"
            size="small"
            onChange={handleOnchangeInput}
            sx={{ m: "2px" }}
          />
          <TextField
            label="Search client by email"
            name="email"
            variant="outlined"
            value={search?.email}
            color="primary"
            size="small"
            onChange={handleOnchangeInput}
            sx={{ m: "2px" }}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => {
            setAddModalOpen(true);
          }}
          startIcon={<Add />}
        >
          Add Client
        </Button>
      </Box>
      <CLientTable
        usersList={filteredtUserList}
        search={search}
        addModalOpen={addModalOpen}
        handleCloseAddModal={handleCloseAddModal}
      />
    </Box>
  );
}
