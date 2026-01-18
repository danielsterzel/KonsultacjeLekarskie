import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { logout } from "../services/authService";

export const Menu = () => {
  const { user, profile} = useAuth();
  const role = profile?.role;

  return (
    <div style={{ marginBottom: 20 , display: "flex", gap: "10px"}}>

      {/* NIEZALOGOWANY */}
      {!user && (
        <>
          <Link to="/">Doctors</Link>{" "}
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>
        </>
      )}

      {/* ZALOGOWANY */}
      {user && (
        <>
          <Link to="/calendar">Calendar</Link>{" "}
          {role === "patient" && (<Link to="/cart">Cart</Link>)}
          {role === "patient" && (<Link to="/">Doctors</Link>)}
          {role === "patient" && (<Link to="/">Home</Link>)}
          
          {role === "doctor" && (
            <Link to="/availability">Availability</Link>
          )}
          {role === "doctor" && (<Link to="/">Home</Link>)}

          {role === "admin" && (
            <Link to="/settings">Auth settings</Link>
          )}
          {role === "admin" && (
            <Link to="/UserManagement">User Management</Link>
            )}
          {role === "admin" && (<Link to="/">Home</Link>)}

          <span style={{ marginLeft: 10 }}>{user.email}</span>{" "}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};
