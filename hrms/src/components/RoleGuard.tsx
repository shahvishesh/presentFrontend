import { useAuth } from "../context/useAuth";

type RoleGuardProps = {
  role: string;
  children: React.ReactNode;
};
 
export default function RoleGuard({ role, children }: RoleGuardProps) {
  const { hasRole } = useAuth();
 
  if (!hasRole(role)) return null;
 
  return <>{children}</>;
};