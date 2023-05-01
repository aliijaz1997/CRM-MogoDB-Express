export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  addedBy: {
    name: string;
    role: UserRole;
  };
  createdAt: string;
  serialNumber: number;
  phoneNumber: string;
}

export enum UserRole {
  Admin = "admin",
  Client = "client",
  Manager = "manager",
  Staff = "staff",
}
export enum Status {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface Notification {
  _id: string;
  description: string;
  createdAt: string;
  seen: boolean;
}

export interface ErrorResponse {
  data: { code: string | number; message: string };
  status: string;
}

export interface CallLog {
  _id: string;
  createdAt: string | Date;
  duration: number;
  type: "incoming" | "outgoing";
  notes: string;
  serialNumber: number;
  createdBy: { _id: string; name: string };
  client: { _id: string; name: string };
  status: Status;
}

export type ModifiedCallLog = Omit<CallLog, "_id"> & { id: string };
export type ModifiedUser = Omit<UserType, "_id"> & { id: string };
