import React, { useContext, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import {
  useGetCallLogsQuery,
  useUpdateCallLogMutation,
} from "../../store/services/api";
import Loader from "../loader";
import dayjs from "dayjs";
import { CallLog, UserRole } from "../../types";
import { AuthContext } from "../../context/authContext";
import { getFilterParams } from "../../helper/getFilterParams";
import { EventClickArg, EventDropArg } from "@fullcalendar/core";
import { EditCallLogModal } from "../Calls/editCallLog";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

interface CalendarProps {}

const Calendar: React.FC<CalendarProps> = () => {
  const [dateRange, setDateRange] = React.useState({ start: "", end: "" });
  const [selectedItem, setSelectedItem] = React.useState<CallLog>();
  const [open, setOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [draggedEvent, setDraggedEvent] = React.useState<EventDropArg | null>(
    null
  );

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
  const [updateCallLog, { isError: isUpdatingError, isLoading: isUpdating }] =
    useUpdateCallLogMutation();

  const events = useMemo(() => {
    return callLogs.map((c) => ({
      id: c._id,
      start: dayjs(c.createdAt).format("YYYY-MM-DD"),
      title: `${c.createdBy.name}<->${c.client.name} ${"("} ${
        c.duration
      } min ${")"}`,
      textColor: "#FFFFFF",
      backgroundColor: c.type === "incoming" ? "#C0392B" : "#27AE60",
      borderColor: c.type === "outgoing" ? "#922B21" : "#1E8449",
      resizable: false,
    }));
  }, [
    callLogs,
    dateRange.start,
    dateRange.end,
    isUpdatingError,
    isUpdating,
    draggedEvent?.event.endStr,
  ]);

  const onEventClick = ({ event }: EventClickArg) => {
    const currentItem = callLogs.find(
      (t: { _id: string }) => t._id === event.id
    );
    if (!currentItem) return;
    setSelectedItem(currentItem);
    setOpen(true);
  };

  const onEventDrop = ({ event, oldEvent }: EventDropArg) => {
    if (!event.start) return;
    setDraggedEvent({ event, oldEvent } as EventDropArg);
    setConfirmOpen(true);
  };

  const handleConfirmDrop = () => {
    if (user) {
      updateCallLog({
        _id: draggedEvent?.event.id,
        createdAt: draggedEvent?.event.start?.toISOString(),
        name: user?.name,
      });
      setConfirmOpen(false);
      if (isUpdatingError && draggedEvent) {
        draggedEvent.event.setDates(
          draggedEvent.oldEvent.startStr,
          draggedEvent.oldEvent.endStr
        );
      }
    }
  };

  if (isLoading) <Loader />;
  return (
    <Box>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        datesSet={(arg) => {
          const start = arg.start.toISOString();
          const end = arg.end.toISOString();
          setDateRange({ start, end });
        }}
        droppable={true}
        editable={true}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
      />
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the event date?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              draggedEvent?.event.setDates(
                draggedEvent.oldEvent.startStr,
                draggedEvent.oldEvent.endStr
              );
              setDraggedEvent(null);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDrop}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {selectedItem && (
        <EditCallLogModal
          callLog={{ ...selectedItem, id: selectedItem._id }}
          open={open}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default Calendar;
