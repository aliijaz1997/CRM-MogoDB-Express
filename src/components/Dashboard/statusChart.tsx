import * as React from "react";
import {
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import Title from "./title";
import { useGetCallLogsQuery } from "../../store/services/api";
import Loader from "../loader";

type ChartProps = {};

interface ChartData {
  month: string;
  pending: number;
  completed: number;
  cancelled: number;
}

const Chart: React.FC<ChartProps> = () => {
  const [dateRange, setDateRange] = React.useState({
    currentDate: new Date().toISOString(),
    oneYearPrevDate: new Date(
      Date.now() - 12 * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  });

  const { data, isLoading } = useGetCallLogsQuery({
    startDate: dateRange.oneYearPrevDate,
    endDate: dateRange.currentDate,
  });

  const { callLogs: callsLastYear = [] } = data ?? {};

  const chartData: ChartData[] = callsLastYear.reduce(
    (acc: ChartData[], curr) => {
      const month = new Date(curr.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      const index = acc.findIndex((item) => item.month === month);
      if (index === -1) {
        const newObj = { month, pending: 0, completed: 0, cancelled: 0 };
        newObj[curr.status] += 1;
        acc.push(newObj);
      } else {
        acc[index][curr.status] += 1;
      }

      return acc.sort((a, b) =>
        new Date(a.month) < new Date(b.month) ? -1 : 1
      );
    },
    []
  );

  if (isLoading) return <Loader />;
  return (
    <React.Fragment>
      <Title>Call Logs by Status</Title>
      <ResponsiveContainer>
        <BarChart width={600} height={400} data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pending" fill="#FFC000" />
          <Bar dataKey="completed" fill="#92D050" />
          <Bar dataKey="cancelled" fill="#ED1C24" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default Chart;
