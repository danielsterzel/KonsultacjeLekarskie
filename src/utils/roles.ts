export type UserRole = "guest" | "patient" | "doctor" | "admin";

const ADMIN_EMAIL = "admin@clinic.local";

export const getInitialRoleFromEmail = (
  email?: string | null,
): UserRole => {
  if (!email) return "patient";
  if (email === ADMIN_EMAIL) return "admin";
  return "patient";
};
