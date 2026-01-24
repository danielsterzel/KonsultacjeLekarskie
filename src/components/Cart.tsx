import { useEffect, useState } from "react";
import type { Consultation } from "../models/Consultations";
import {
  getConsultations,
  updateConsultationStatus,
} from "../services/consultationsService";
import { useAuth } from "../components/AuthContext";
import styles from "./styles/Cart.module.css";

export const Cart = () => {
  const { user, loading } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (user) {
      getConsultations().then(setConsultations);
    }
  }, [user]);

  if (loading) return <p>Ładowanie...</p>;
  if (!user) return <p>Zaloguj się, aby zobaczyć koszyk.</p>;

  const items = consultations.filter(
    (c) => c.patientId === user.uid && c.status === "reserved"
  );

  const pay = async () => {
    setPaying(true);
    for (const c of items) {
      if (!c.id) continue;
      await updateConsultationStatus(c.id, "paid");
    }
    alert("Płatność zakończona pomyślnie!");
    setPaying(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Twój koszyk</h2>

      {items.length === 0 && (
        <p className={styles.empty}>
          Nie masz żadnych zarezerwowanych konsultacji.
        </p>
      )}

      {items.length > 0 && (
        <>
          <div className={styles.list}>
            {items.map((c) => (
              <div key={c.id} className={styles.card}>
                <div className={styles.info}>
                  <div className={styles.date}>
                    📅 {c.date} • {c.startTime}
                  </div>
                  <div className={styles.meta}>
                    Typ wizyty: <span className={styles.type}>{c.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.checkout}>
            <button
              className={styles.button}
              onClick={pay}
              disabled={paying}
            >
              {paying ? "Przetwarzanie..." : "Zapłać za konsultacje"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
