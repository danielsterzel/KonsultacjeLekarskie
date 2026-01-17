import { db } from "../firebaseConfig";
import { ref, update, push, set, get } from "firebase/database";
import type { Consultation, ConsultationStatus } from "../models/Consultations";
import type { Availability } from "../models/Availability";
import { canModifyConsultation } from "../utils/consultationAuthorization";

console.log("LOADED: consultationsService.Firebase");

// ===== AVAILABILITY =====
export const addAvailability = async (a: Availability) => {
  const newRef = push(ref(db, "availabilities"));
  await set(newRef, a);
};

export const getAvailabilities = async (): Promise<Availability[]> => {
  const snapshot = await get(ref(db, "availabilities"));
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({
    id,
    ...(value as Availability),
  }));
};

// ===== CONSULTATIONS =====
export const addConsultationFirebase = async (c: Consultation) => {
  const newRef = push(ref(db, "consultations"));
  await set(newRef, c);
};

export const getConsultationsFirebase = async (): Promise<Consultation[]> => {
  const snapshot = await get(ref(db, "consultations"));
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.entries(data).map(([id, value]) => ({
    id,
    ...(value as Consultation),
  }));
};

export const updateConsultationStatusFirebase = async (
  id: string,
  status: ConsultationStatus,
) => {
  await update(ref(db, `consultations/${id}`), { status });
};

export const updateConsultationFirebase = async (
  id: string,
  data: Partial<Consultation>
) => {
  await update(ref(db, `consultations/${id}`), data);
};

// export const updateConsultationStatusFirebase = async (
//   c: Consultation,
//   status: ConsultationStatus,
//   userId: string,
//   role: UserRole,
// ) => {
//   if (!canModifyConsultation(c, userId, role)) {
//     throw new Error("Unauthorized consultation update");
//   }

//   await update(ref(db, `consultations/${c.id}`), { status });
// };
