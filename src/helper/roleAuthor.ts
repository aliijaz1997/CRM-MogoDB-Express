import { toast } from "react-toastify";
import { UserRole } from "../types";

interface CanThisRoleEditProps {
  role: string;
  roleToEdit: string;
}

export const canThisRoleEdit = ({ role, roleToEdit }: CanThisRoleEditProps) => {
  if (
    (role === UserRole.Manager || role === UserRole.Staff) &&
    roleToEdit === UserRole.Admin
  ) {
    toast.error(`${role} can't edit for role ${roleToEdit}`);
    return false;
  }

  if (
    role === UserRole.Staff &&
    (roleToEdit === UserRole.Manager || roleToEdit === UserRole.Admin)
  ) {
    toast.error(`${role} can't edit for role ${roleToEdit}`);
    return false;
  }
  return true;
};
