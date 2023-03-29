import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export default function formatDateTime(utcString: string | Date): string {
  const dateTime = dayjs.utc(utcString);
  if (dateTime.isValid()) {
    return dayjs(dateTime).tz("Asia/Karachi").format("MMMM D, YYYY h:mm A");
  } else {
    return dayjs().tz("Asia/Karachi").format("MMMM D, YYYY h:mm A");
  }
}
