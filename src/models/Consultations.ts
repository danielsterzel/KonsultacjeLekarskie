export type ConsultationStatus = 
| "free"
| "reserved" 
| "cancelled"
| "finished"

export type ConsultationType = 
| "firstVisit"
| "control"
| "chronic"
| "perscription"

export interface Patient {
    name: string;
    age: number;
    gender: "M" | "F"
    notes? : string;
}

export interface Consultation {
    id?: string;
    doctorId: string;
    patientId? : string;
    date: string;
    startTime: string;
    durationInMin: number;
    type: ConsultationType;
    status: ConsultationStatus;
    patient?: Patient;
}
