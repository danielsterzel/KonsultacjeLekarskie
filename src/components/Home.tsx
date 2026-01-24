import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import styles from "./styles/Home.module.css";

export const Home = () => {

    const {user} = useAuth();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Konsultacje lekarskie online</h1>

        <p className={styles.subtitle}>
          Skonsultuj się z lekarzem bez wychodzenia z domu.
          Szybkie terminy, sprawdzeni specjaliści i bezpieczne wizyty online.
        </p>

        {!user && (
          <div className={styles.actions}>
            <Link to="/login">
              <button className={styles.primaryButton}>
                Zaloguj się
              </button>
            </Link>

            <Link to="/register">
              <button className={styles.secondaryButton}>
                Załóż konto
              </button>
            </Link>
          </div>
        )}

        {user?.role === "patient" && (
          <div className={styles.actions}>
            <Link to="/doctors">
              <button className={styles.primaryButton}>
                Znajdź lekarza
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};