import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../utils/roles";
import type { JSX } from "react";

type Props = {
  allow: UserRole[];
  children: JSX.Element;
};

export const RoleRoute = ({ allow, children }: Props) => {
  const { user, profile, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user || !profile) return <Navigate to="/login" />;

  if (!allow.includes(profile.role)) {
    return <Navigate to="/" />;
  }

  return children;
};
