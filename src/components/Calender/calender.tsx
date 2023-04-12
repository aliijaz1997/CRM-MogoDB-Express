import React, { useContext, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useGetCallLogsQuery } from "../../store/services/api";
import Loader from "../loader";
import dayjs from "dayjs";
import { CallLog, UserRole } from "../../types";
import { AuthContext } from "../../context/authContext";
import { getFilterParams } from "../../helper/getFilterParams";

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const [dateRange, setDateRange] = React.useState({ start: "", end: "" });

  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === UserRole.Admin;

  const { data, isLoading } = useGetCallLogsQuery({
    startDate: dateRange.start,
    endDate: dateRange.end,
    filter: !isAdmin
      ? (getFilterParams({
          items: [{ field: "createdBy:id", value: user?._id, operator: "=" }],
        }) as string)
      : undefined,
  });
  const { callLogs = [] } = data ?? {};

  const events = useMemo(() => {
    return callLogs.map((c) => ({
      id: c._id,
      start: dayjs(c.createdAt).format("YYYY-MM-DD"),
      title: `${c.createdBy.name}<->${c.client.name} ${"("} ${
        c.duration
      } min ${")"}`,
      textColor: c.type === "outgoing" ? "#FFFFFF" : "#FFFFFF",
      backgroundColor: c.type === "outgoing" ? "#C0392B" : "#27AE60",
      borderColor: c.type === "outgoing" ? "#922B21" : "#1E8449",
    }));
  }, [callLogs, dateRange.start, dateRange.end]);
  if (isLoading) <Loader />;
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      datesSet={(arg) => {
        const start = arg.start.toISOString();
        const end = arg.end.toISOString();
        setDateRange({ start, end });
      }}
    />
  );
};

export default Calendar;
