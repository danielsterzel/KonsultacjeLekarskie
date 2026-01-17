import { useEffect, useState } from "react";
import { getDoctors } from "../services/userService";
import type { AppUser } from "../services/userService";
import { useAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";

export const DoctorList = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const docs = await getDoctors();
      setDoctors(docs);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h2>Doctors</h2>

      {loading && <p>Loading...</p>}

      {!loading && doctors.length === 0 && (
        <p>No doctors found. (Check users roles in RTDB)</p>
      )}

      <ul>
        {doctors.map((d) => (
          <li key={d.uid}>
            {d.email}
            {"  "}
            {user ? (
              <Link to="/calendar">View calendar</Link>
            ) : (
              <span style={{ color: "#666" }}>Login to view schedule</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
