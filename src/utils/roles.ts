export type UserRole = "guest" | "patient" | "doctor" | "admin";



const ADMIN_EMAIL = "admin@clinic.local";



export const getRole = (email?: string | null): UserRole | null => {
  if (!email) return null;

  if (email === ADMIN_EMAIL) return "admin";
  if (email.includes("doctor")) return "doctor";

  return "patient";
};
