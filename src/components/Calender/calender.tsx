import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useGetCallLogsQuery } from "../../store/services/api";
import Loader from "../loader";
import dayjs from "dayjs";
import { CallLog } from "../../types";

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const { data: callLogs, isLoading } = useGetCallLogsQuery();
  const events = useMemo(() => {
    return (
      callLogs &&
      callLogs.map((c) => ({
        id: c._id,
        start: dayjs(c.createdAt).format("YYYY-MM-DD"),
        title: `${c.createdBy.name}<->${c.client.name} ${"("} ${
          c.duration
        } min ${")"}`,
        textColor: c.type === "outgoing" ? "#FFFFFF" : "#FFFFFF",
        backgroundColor: c.type === "outgoing" ? "#C0392B" : "#27AE60",
        borderColor: c.type === "outgoing" ? "#922B21" : "#1E8449",
      }))
    );
  }, [callLogs]);
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
