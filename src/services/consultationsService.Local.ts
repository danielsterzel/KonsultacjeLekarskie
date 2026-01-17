import data from "../data/mockData.json";
import type { Consultation } from "../models/Consultations";

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
  status: "cancelled" | "finished",
) => {
  consultations = consultations.map((c) =>
    c.id === id ? { ...c, status } : c,
  );
};
