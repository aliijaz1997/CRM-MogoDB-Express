import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function formatDateTime(utcString: string): string {
  const dateTime = dayjs.utc(utcString);
  if (dateTime.isValid()) {
    return dateTime.format("YYYY-MM-DD HH:mm:ss");
  } else {
    return dayjs().format("YYYY-MM-DD HH:mm:ss");
  }
}
