import { useEffect, useState } from "react";
import type { Consultation } from "../models/Consultations";
import { getConsultations } from "../services/consultationsService";
import { currentUser } from "../context/currentUser";

export const Cart = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    getConsultations().then(setConsultations);
  }, []);

  const items = consultations.filter(
    c => c.patientId === currentUser.id && c.status === "reserved"
  );

  return (
    <div>
      <h3>Koszyk</h3>

      {items.length === 0 && <p>Brak zarezerwowanych wizyt</p>}

      <ul>
        {items.map(c => (
          <li key={c.id}>
            {c.date} {c.startTime} ({c.type})
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <button onClick={() => alert("Payment finished")}>
          Pay
        </button>
      )}
    </div>
  );
};
