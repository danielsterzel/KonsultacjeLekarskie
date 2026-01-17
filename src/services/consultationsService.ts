import {
  getConsultationsLocal,
  addConsultationLocal,
  updateConsultationStatusLocal,
  updateConsultationLocal,
} from "./consultationsService.Local";

import {
  getConsultationsFirebase,
  addConsultationFirebase,
  updateConsultationStatusFirebase,
  updateConsultationFirebase,
} from "./consultationsService.Firebase";

const USE_LOCAL = false;

console.log("USE_LOCAL =", USE_LOCAL);
console.log("getConsultations impl =", USE_LOCAL ? "LOCAL" : "FIREBASE");

export const getConsultations = USE_LOCAL
  ? getConsultationsLocal
  : getConsultationsFirebase;

export const addConsultation = USE_LOCAL
  ? addConsultationLocal
  : addConsultationFirebase;

export const updateConsultationStatus = USE_LOCAL
  ? updateConsultationStatusLocal
  : updateConsultationStatusFirebase;
export const markConsultationAsPaid = async (id: string) => {
  await updateConsultationStatus(id, "paid");
};
export const updateConsultation = USE_LOCAL ? updateConsultationLocal : 
updateConsultationFirebase;