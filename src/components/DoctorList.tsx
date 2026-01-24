import { useEffect, useState } from "react";
import { getDoctors } from "../services/userService";
import type { AppUser } from "../services/userService";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";
import styles from "./styles/DoctorList.module.css";

export const DoctorList = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const docs = await getDoctors();
        setDoctors(docs);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Nasi lekarze</h2>

      {loading && <p>Ładowanie listy lekarzy...</p>}

      {!loading && doctors.length === 0 && (
        <p>Brak dostępnych lekarzy.</p>
      )}

      {!loading && doctors.length > 0 && (
        <div className={styles.grid}>
          {doctors.map((doctor) => (
            <div key={doctor.uid} className={styles.card}>
              <div>
                <div className={styles.name}>
                   Dr {doctor.email.split("@")[0]}
                </div>
                <div className={styles.email}>{doctor.email}</div>
              </div>

              <div className={styles.actions}>
                {user ? (
                  <Link to="/calendar" className={styles.button}>
                    Zobacz kalendarz
                  </Link>
                ) : (
                  <div className={styles.disabled}>
                    Zaloguj się, aby zobaczyć terminy
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
