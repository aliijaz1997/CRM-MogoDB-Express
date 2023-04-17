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
  incoming: number;
  outgoing: number;
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
        const newObj = { month, incoming: 0, outgoing: 0 };
        if (curr.type === "incoming") {
          newObj.incoming += 1;
        } else {
          newObj.outgoing += 1;
        }
        acc.push(newObj);
      } else {
        if (curr.type === "incoming") {
          acc[index].incoming += 1;
        } else {
          acc[index].outgoing += 1;
        }
      }

      return acc.sort((a, b) =>
        new Date(a.month) > new Date(b.month) ? 1 : -1
      );
    },
    []
  );

  if (isLoading) return <Loader />;
  return (
    <React.Fragment>
      <Title>Number of Calls Last Month</Title>
      <ResponsiveContainer>
        <BarChart width={600} height={400} data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="incoming" stackId="calls" fill="#BBBADA" />
          <Bar dataKey="outgoing" stackId="calls" fill="#4D4D4D" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default Chart;
