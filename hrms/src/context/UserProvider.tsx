import { useState, type ReactNode } from "react";
import { UserContext } from "./UserContexr";

export interface CurrentUser {
  userId: number;
  employeeId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};