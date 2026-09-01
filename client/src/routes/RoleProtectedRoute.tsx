import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role || "explorer";

  if (!allowedRoles.includes(role)) {
    // Redirect users to their appropriate dashboard
    return <Navigate to={role === "faculty" ? "/faculty" : "/"} replace />;
  }

  return <>{children}</>;
}
