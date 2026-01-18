import type { UserRole } from "../context/currentUser";
import data from "../data/mockData.json";
import type { Consultation, ConsultationStatus } from "../models/Consultations";
import { canModifyConsultation } from "../utils/consultationAuthorization.ts";

/**
 * Lokalny magazyn danych
 * Dane początkowe z mockData.json
 */
let consultations: Consultation[] = [
  ...(data.consultations as Consultation[]),
];

// ===== READ =====
export const getConsultationsLocal = async (): Promise<Consultation[]> => {
  return consultations;
};

// ===== CREATE =====
export const addConsultationLocal = async (c: Consultation) => {
  consultations.push({
    ...c,
    id: crypto.randomUUID(),
  });
};

// ===== UPDATE =====
export const updateConsultationStatusLocal = async (
  id: string,
  status: ConsultationStatus,
) => {
  consultations = consultations.map((c) =>
    c.id === id ? { ...c, status } : c,
  );
};

// export const updateConsultationStatusLocal = async (
//   id: string,
//   status: ConsultationStatus,
//   userId: string,
//   role: UserRole,
// ) => {
//   consultations = consultations.map((c) => {
//     if (c.id !== id) return c;

//     if (!canModifyConsultation(c, userId, role)) {
//       throw new Error("Unauthorized consultation update");
//     }

//     return { ...c, status };
//   });
// };



// ===== UPDATE (PARTIAL) =====
export const updateConsultationLocal = async (
  id: string,
  data: Partial<Consultation>,
) => {
  consultations = consultations.map((c) =>
    c.id === id ? { ...c, ...data } : c,
  );
};
