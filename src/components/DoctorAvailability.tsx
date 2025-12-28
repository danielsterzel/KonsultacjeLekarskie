import { useState } from "react";
import { addAvailability } from "../services/consultationsService";

export const DoctorAvailability = () => {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const save = async () => {
        await addAvailability({
            doctorId: "doc1",
            type: "cyclic",
            fromDate,
            toDate,
            daysOfWeek: [0, 1, 3, 5],
            timeRanges: [{from: "08:00", to: "12:30"}]
        });
        alert("Availability saved");
    };
    return (
        <div>
            <h3>Doctor Availability</h3>
            <input 
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)} />
            <input
            type="date"
            value={toDate} 
            onChange={(e) => setToDate(e.target.value)}/>
            <button onClick={save}>Save</button>
        </div>
    )
};