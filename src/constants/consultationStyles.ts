import type { ConsultationStatus } from "../models/Consultations";
import type { ConsultationType  } from "../models/Consultations";

export const CONSULTATION_COLORS: Record<ConsultationStatus, string> = {
    free: "#ffffff",
    reserved: "#4caf50",
    cancelled: "#bdbdbd",
    finished: "#e0e0e0",
    paid: "#fffff"
}

export const CONSULTATION_TEXT_COLOR: Record<ConsultationStatus, string> = {
    free: "#000000",
  reserved: "#ffffff",
  cancelled: "#424242",
  finished: "#424242",
  paid: "#ffff"
}


export const CONSULTATION_TYPE_COLORS: Record<ConsultationType, string> = {
    firstVisit: "#4caf50",
    control: "#2196f3",
    chronic: "#ff9800",
    prescription: "#9c27b0"
}
