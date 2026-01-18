import type { Consultation } from "../models/Consultations";
import type { UserRole } from "../utils/roles";

export const canModifyConsultation = (
  c: Consultation,
  userId: string,
  role: UserRole,
): boolean => {
  if (role === "patient") {
    return c.patientId === userId;
  }

  if (role === "doctor") {
    return c.doctorId === userId;
  }

  return false;
};
