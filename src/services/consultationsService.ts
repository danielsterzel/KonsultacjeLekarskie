import {
  getConsultationsLocal,
  addConsultationLocal,
  updateConsultationStatusLocal,
} from "./consultationsService.Local";

import {
  getConsultationsFirebase,
  addConsultationFirebase,
  updateConsultationStatusFirebase,
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
