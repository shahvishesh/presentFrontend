import { createContext } from "react";
 
export type User = {
  id: number;
  username: string;
  roles: string[];
};
 
export type AuthContextType = {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
};
 
export const AuthContext = createContext<AuthContextType | null>(null);