export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  Admin = "admin",
  Client = "client",
  Manager = "manager",
  Staff = "staff",
}
