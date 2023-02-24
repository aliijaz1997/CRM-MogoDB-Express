export interface UserType {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  Client = "client",
  Admin = "admin",
}
