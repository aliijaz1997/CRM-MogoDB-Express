import React, { useContext, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useGetCallLogsQuery } from "../../store/services/api";
import Loader from "../loader";
import dayjs from "dayjs";
import { CallLog, UserRole } from "../../types";
import { AuthContext } from "../../context/authContext";

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const { data: callLogs = [], isLoading } = useGetCallLogsQuery();
  const { user } = useContext(AuthContext);
  const isAdmin = user && user.role === UserRole.Admin;
  const currentRoleLogs = isAdmin
    ? callLogs
    : callLogs.filter((c) => c.createdBy._id === user?._id);

  const events = useMemo(() => {
    return currentRoleLogs.map((c) => ({
      id: c._id,
      start: dayjs(c.createdAt).format("YYYY-MM-DD"),
      title: `${c.createdBy.name}<->${c.client.name} ${"("} ${
        c.duration
      } min ${")"}`,
      textColor: c.type === "outgoing" ? "#FFFFFF" : "#FFFFFF",
      backgroundColor: c.type === "outgoing" ? "#C0392B" : "#27AE60",
      borderColor: c.type === "outgoing" ? "#922B21" : "#1E8449",
    }));
  }, [currentRoleLogs]);
  if (isLoading) <Loader />;
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
};

export default Calendar;
