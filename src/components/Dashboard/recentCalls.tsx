import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./title";
import { useGetCallLogsQuery } from "../../store/services/api";
import Loader from "../loader";
import formatDateTime from "../../helper/getDate";
import { getSortParams } from "../../helper/getSortParams";
import { useRouter } from "next/router";

export default function Orders() {
  const { data, isLoading } = useGetCallLogsQuery({
    limit: 5,
    sort: getSortParams([{ field: "createdAt", sort: "desc" }]) as string,
  });

  const router = useRouter();

  const { callLogs } = data ?? {};

  const SeeMore = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/calls");
  };

  if (isLoading || !callLogs) return <Loader />;
  return (
    <React.Fragment>
      <Title>Recent Calls</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sr No.</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {callLogs.map((row) => (
            <TableRow key={row._id}>
              <TableCell>{row.serialNumber}</TableCell>
              <TableCell>{formatDateTime(row.createdAt as string)}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.duration}</TableCell>
              <TableCell align="right">{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={SeeMore} sx={{ mt: 3 }}>
        See more calls
      </Link>
    </React.Fragment>
  );
}
