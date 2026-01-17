import type { Consultation } from "../models/Consultations";
import {
  CONSULTATION_COLORS,
  CONSULTATION_TYPE_COLORS,
} from "../constants/consultationStyles";

export const SLOT_PX = 40;

export const getConsultationBgColor = (
  c: Consultation | undefined,
  status: Consultation["status"],
) => {
  if (!c) return CONSULTATION_COLORS.free;

  if (status === "finished") return CONSULTATION_COLORS.finished;
  if (status === "cancelled") return CONSULTATION_COLORS.cancelled;
  return CONSULTATION_TYPE_COLORS[c.type];
};

export const getConsultationTitle = (
  c: Consultation | undefined,
  status: Consultation["status"],
) => {
  if (!c) return "";

  return `
Type: ${c.type}
Status: ${status}
Duration: ${c.durationInMin} min
Patient: ${c.patientDetails?.name ?? "—"}
Notes: ${c.patientDetails?.notes ?? "—"}
`;
};

export const askForDuration = (): number | undefined => {
    const input = window.prompt(
      "Visit duration in minutes (30, 60, 90):",
      "30",
    );

    if (!input) return undefined;
    const value = Number(input);
    if (![30, 60, 90].includes(value)) {
      alert("Invalid duration. Please enter 30, 60, or 90.");
      return undefined;
    }
    return value;
  };