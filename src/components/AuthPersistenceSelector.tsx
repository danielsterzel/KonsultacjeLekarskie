import { useState } from "react";
import {
  setAuthPersistence,
  type AuthPersistence,
} from "../services/authService";
import { useAuth } from "../components/AuthContext";
import { isAdmin } from "../utils/isAdmin";
import styles from "./styles/AuthPersistenceSelector.module.css";

export const AuthPersistenceSelector = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthPersistence>("LOCAL");

  if (!isAdmin(user?.email)) return null;

  const apply = async () => {
    await setAuthPersistence(mode);
    alert(`Persistence set to ${mode}`);
  };

  return (
    <div className={styles.card}>
      <h4 className={styles.title}>Auth persistence (admin)</h4>

      <div className={styles.row}>
        <select
          className={styles.select}
          value={mode}
          onChange={(e) => setMode(e.target.value as AuthPersistence)}
        >
          <option value="LOCAL">LOCAL</option>
          <option value="SESSION">SESSION</option>
          <option value="NONE">NONE</option>
        </select>

        <button className={styles.button} onClick={apply}>
          Apply
        </button>
      </div>
    </div>
  );
};
