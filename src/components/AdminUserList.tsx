import { useEffect, useState } from "react";
import {
  getAllUsers,
  setUserBanned,
  setUserRole,
  type AppUser,
} from "../services/userService";

import { useAuth } from "../components/AuthContext";

export const AdminUserList = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const {user: currentUser} = useAuth();
  const load = async () => {
    const data = await getAllUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2>Admin – Users</h2>

      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Banned</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.banned ? "YES" : "NO"}</td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  {/* BAN – tylko jeśli NIE admin i NIE ja */}
                  {u.role !== "admin" && u.uid !== currentUser?.uid && (
                    <button
                      onClick={async () => {
                        await setUserBanned(u.uid, !u.banned);
                        load();
                      }}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  )}

                  {/* MAKE DOCTOR – tylko jeśli nie admin */}
                  {u.role !== "admin" && (
                    <button
                      onClick={async () => {
                        await setUserRole(u.uid, "doctor");
                        load();
                      }}
                    >
                      Make doctor
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
