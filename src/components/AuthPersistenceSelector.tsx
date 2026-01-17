import { useState } from "react";
import { setAuthPersistence, type AuthPersistence } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import { isAdmin } from "../utils/isAdmin";

export const AuthPersistenceSelector = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthPersistence>("LOCAL");

  if (!isAdmin(user?.email)) return null;

  const apply = async () => {
    await setAuthPersistence(mode);
    alert(`Persistence set to ${mode}`);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
      <h4>Auth persistence (admin)</h4>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as AuthPersistence)}
      >
        <option value="LOCAL">LOCAL</option>
        <option value="SESSION">SESSION</option>
        <option value="NONE">NONE</option>
      </select>

      <button onClick={apply}>Apply</button>
    </div>
  );
};
