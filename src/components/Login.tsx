import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/Login.module.css";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Zaloguj się</h2>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={styles.input}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Hasło</label>
          <input
            className={styles.input}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className={styles.button} onClick={submit}>
          Zaloguj się
        </button>

        <div className={styles.footer}>
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </div>
      </div>
    </div>
  );
};
