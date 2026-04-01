import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, type User } from "./AuthContext";
 
type TokenPayload = {
  sub: string;
  userId: number;
  roles: string[];
  exp: number;
};
 
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("token");
    if (!token) return null;
 
    try {
      const decoded = jwtDecode<TokenPayload>(token);
 
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return null;
      }
 
      return {
        id: decoded.userId,
        username: decoded.sub,
        roles: decoded.roles,
      };
    } catch {
      localStorage.removeItem("token");
      return null;
    }
  });
 
  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<TokenPayload>(token);
 
    setUser({
      id: decoded.userId,
      username: decoded.sub,
      roles: decoded.roles,
    });
  };
 
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
 
  const hasRole = (role: string) => {
    return user?.roles.includes(role) ?? false;
  };
 
  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};