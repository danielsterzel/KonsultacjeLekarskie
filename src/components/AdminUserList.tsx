import { useEffect, useState } from "react";
import {
  getAllUsers,
  setUserBanned,
  setUserRole,
  type AppUser,
} from "../services/userService";
import { useAuth } from "../components/AuthContext";
import styles from "./styles/AdminUserList.module.css";

export const AdminUserList = () => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

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
    <div className={styles.container}>
      <h2 className={styles.title}>Admin – Users</h2>

      <table className={styles.table}>
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
                <div className={styles.actions}>
                  {u.role !== "admin" && u.uid !== currentUser?.uid && (
                    <button
                      className={`${styles.button} ${styles.ban}`}
                      onClick={async () => {
                        await setUserBanned(u.uid, !u.banned);
                        load();
                      }}
                    >
                      {u.banned ? "Unban" : "Ban"}
                    </button>
                  )}

                  {u.role !== "admin" && (
                    <button
                      className={`${styles.button} ${styles.doctor}`}
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
