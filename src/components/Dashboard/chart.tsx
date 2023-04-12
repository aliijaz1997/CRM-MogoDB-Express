import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import Title from "./title";
import { useGetCallLogsQuery } from "../../store/services/api";
import dayjs from "dayjs";
import Loader from "../loader";

// Generate Sales Data
function createData(time: string, amount?: number) {
  return { time, amount };
}

type ChartProps = {};

const Chart: React.FC<ChartProps> = () => {
  const theme = useTheme();

  const [dateRange, setDateRange] = React.useState({
    currentDate: new Date().toISOString(),
    oneMonthPrevDate: new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
  });

  const { data, isLoading, isError, error } = useGetCallLogsQuery({
    startDate: dateRange.oneMonthPrevDate,
    endDate: dateRange.currentDate,
  });

  const { callLogs: callsLastMonth = [] } = data ?? {};

  const chartData = [];
  for (let i = 0; i <= 24; i += 3) {
    const time = `${i.toString().padStart(2, "0")}:00`;
    const numCalls = callsLastMonth.filter((call) => {
      return new Date(call.createdAt).getHours() === i;
    }).length;
    chartData.push(createData(time, numCalls));
  }
  if (isLoading) return <Loader />;
  return (
    <React.Fragment>
      <Title>Number of Calls Last Month</Title>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis
            dataKey="time"
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          />
          <YAxis
            stroke={theme.palette.text.secondary}
            style={theme.typography.body2}
          >
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: "middle",
                fill: theme.palette.text.primary,
                ...theme.typography.body1,
              }}
            >
              Number of Calls
            </Label>
          </YAxis>
          <Line
            isAnimationActive={false}
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default Chart;
