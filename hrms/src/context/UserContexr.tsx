import { createContext} from "react";

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

export const UserContext = createContext<UserContextType | null>(null);

