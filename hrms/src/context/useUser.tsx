import { useContext } from "react";
import { UserContext } from "./UserContexr";

export interface CurrentUser {
  userId: number;
  employeeId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface UserContextType {
  user: CurrentUser | null;
  setUser: (user: CurrentUser | null) => void;
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};