import { useEffect, useState } from "react";
import type { Consultation } from "../models/Consultations";
import { getConsultations, updateConsultationStatus } from "../services/consultationsService";
import { useAuth } from "../components/AuthContext";

export const Cart = () => {
  const { user, loading }  = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);


  useEffect(() => {
    getConsultations().then(setConsultations);
  }, [user]);

  if(loading) return <div>Loading...</div>;
  if(!user) return <div>Please log in to view your cart.</div>;

  const items = consultations.filter(
    c => c.patientId === user.uid && c.status === "reserved"
  );

  return (
    <div>
      <h3>My cart</h3>

      {items.length === 0 && <p>There are no registered consultations</p>}

      <ul>
        {items.map(c => (
          <li key={c.id}>
            {c.date} {c.startTime} ({c.type})
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <button onClick={async () => 
          {
            for(const c of items) {
              if(!c.id) continue;
              await updateConsultationStatus(c.id, "paid");
            }
        alert("Payment finished")}}>
          Pay for consultations
        </button>
      )}
    </div>
  );
};
