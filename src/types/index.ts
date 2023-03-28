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
}

export enum UserRole {
  Admin = "admin",
  Client = "client",
  Manager = "manager",
  Staff = "staff",
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
