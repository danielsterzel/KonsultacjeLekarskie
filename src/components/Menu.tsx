import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { logout } from "../services/authService";
import styles from "./styles/Menu.module.css";

export const Menu = () => {
  const { user, profile } = useAuth();
  const role = profile?.role;

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link className={styles.link} to="/">
          Home
        </Link>

        {!user && (
          <>
            <Link className={styles.link} to="/doctors">
              Doctors
            </Link>
            <Link className={styles.link} to="/login">
              Login
            </Link>
            <Link className={styles.link} to="/register">
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <Link className={styles.link} to="/calendar">
              Calendar
            </Link>

            {role === "patient" && (
              <>
                <Link className={styles.link} to="/doctors">
                  Doctors
                </Link>
                <Link className={styles.link} to="/cart">
                  Cart
                </Link>
              </>
            )}

            {role === "doctor" && (
              <Link className={styles.link} to="/availability">
                Availability
              </Link>
            )}

            {role === "admin" && (
              <>
                <Link className={styles.link} to="/settings">
                  Auth settings
                </Link>
                <Link className={styles.link} to="/UserManagement">
                  User Management
                </Link>
              </>
            )}
          </>
        )}
      </div>

      {user && (
        <div className={styles.right}>
          <span className={styles.email}>{user.email}</span>
          <button className={styles.logout} onClick={logout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};
