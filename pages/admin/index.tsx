import { Box, Grid, Paper } from "@mui/material";
import React from "react";
import Chart from "../../src/components/Dashboard/chart";
import Deposits from "../../src/components/Dashboard/deposit";
import Orders from "../../src/components/Dashboard/orders";

export default function HomeAdmin() {
  return (
    <Box>
      <Grid container spacing={3}>
        {/* Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
              backgroundColor: "aliceblue",
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
              color: "red",
            }}
          >
            <Deposits />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#E6E6FA",
            }}
          >
            <Orders />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
