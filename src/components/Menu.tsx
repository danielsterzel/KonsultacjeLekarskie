import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "../services/authService";
import { getRole } from "../utils/roles";

export const Menu = () => {
  const { user } = useAuth();
  const role = getRole(user?.email);

  return (
    <div style={{ marginBottom: 20 }}>
      {/* NIEZALOGOWANY */}
      {!user && (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>
        </>
      )}

      {/* ZALOGOWANY */}
      {user && (
        <>
          <span style={{ marginRight: 10 }}>
            {user.email} ({role})
          </span>

          <Link to="/calendar">Calendar</Link>{" "}

          {role === "doctor" && (
            <Link to="/availability">Availability</Link>
          )}

          {role === "admin" && (
            <Link to="/settings">Auth Settings</Link>
          )}

          <button onClick={logout} style={{ marginLeft: 10 }}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};
