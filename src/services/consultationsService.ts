import { db } from "../firebaseConfig";
import { ref, push, set, get } from "firebase/database";
import type { Consultation } from "../models/Consultations";


export const addConsultation = async (c: Consultation) => {
    const newRef = push(ref(db, "consultations"));
    await set(newRef, c);
};

export const getConsultations =  async (): Promise<Consultation[]> => {
    const snapshot = await get(ref(db, "consultations"));
    if(!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.entries(data).map(([id, value]) => ({
        id, 
        ...(value as Consultation)
    }));
};