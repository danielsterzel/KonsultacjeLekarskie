import type { ConsultationStatus } from "../models/Consultations";

export const CONSULTATION_COLORS: Record<ConsultationStatus, string> = {
    free: "#ffffff",
    reserved: "#4caf50",
    cancelled: "#bdbdbd",
    finished: "#e0e0e0"
}

export const CONSULTATION_TEXT_COLOR: Record<ConsultationStatus, string> = {
    free: "#000000",
  reserved: "#ffffff",
  cancelled: "#424242",
  finished: "#424242"
}