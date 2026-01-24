import data from "../data/mockData.json";
import type { Consultation, ConsultationStatus } from "../models/Consultations";

let consultations: Consultation[] = [...(data.consultations as Consultation[])];

export const getConsultationsLocal = async (): Promise<Consultation[]> => {
  return consultations;
};

export const addConsultationLocal = async (c: Consultation) => {
  consultations.push({
    ...c,
    id: crypto.randomUUID(),
  });
};

export const updateConsultationStatusLocal = async (
  id: string,
  status: ConsultationStatus,
) => {
  consultations = consultations.map((c) =>
    c.id === id ? { ...c, status } : c,
  );
};
export const updateConsultationLocal = async (
  id: string,
  data: Partial<Consultation>,
) => {
  consultations = consultations.map((c) =>
    c.id === id ? { ...c, ...data } : c,
  );
};
