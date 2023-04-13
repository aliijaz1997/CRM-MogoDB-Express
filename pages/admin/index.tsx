import { Box, Grid, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";
import Calendar from "../../src/components/Calender/calender";
import Chart from "../../src/components/Dashboard/chart";
import Deposits from "../../src/components/Dashboard/deposit";
import RecentCalls from "../../src/components/Dashboard/recentCalls";
import Loader from "../../src/components/loader";
import { AuthContext } from "../../src/context/authContext";
import { useGetUserByIdQuery } from "../../src/store/services/api";
import { RootState } from "../../src/store/store";
import { UserRole } from "../../src/types";

export default function HomeAdmin() {
  const router = useRouter();
  const { currentUser } = React.useContext(AuthContext);
  const token = useSelector<RootState>((state) => state.auth.token);
  const {
    data: user,
    isError,
    isLoading,
  } = useGetUserByIdQuery({
    id: currentUser?.uid as string,
  });
  React.useEffect(() => {
    if (user) {
      token
        ? user.role !== UserRole.Client
          ? router.push("/admin")
          : router.push("/")
        : router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, user?.role]);

  if (isError || isLoading || !user) {
    return <Loader />;
  }

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
            <RecentCalls />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Calendar />
        </Grid>
      </Grid>
    </Box>
  );
}
