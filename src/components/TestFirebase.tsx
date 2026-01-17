import { addConsultationFirebase, getConsultationsFirebase } from "../services/consultationsService.Firebase";
import type { Consultation } from "../models/Consultations";

export const TestFirebase = () => {
    const handleAdd = async() => {
        const c: Consultation = {
            doctorId: "doctor1",
            date: "2025-12-28",
            startTime: "10:00",
            durationInMin: 30,
            type: "firstVisit",
            status: "free"
        };

        await addConsultationFirebase(c);
        alert("Added to Firebase database");
    };

    const handleLoad = async () => {
        const data = await getConsultationsFirebase();
        console.log("Consultation from Firebase: ", data);
    };
    return (
        <div>
            <button onClick={handleAdd}>ADD TEST CONSULTATION</button>
            <br /><br/>
            <button onClick= {handleLoad}>LOAD CONSULTATIONS</button>
        </div>);
};
