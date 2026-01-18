import { ref, get } from "firebase/database";
import { db } from "../firebaseConfig";
import type { Doctor } from "../models/Doctor";
import type { AppUser } from "./userService";

export const getDoctors = async (): Promise<Doctor[]> => {
  const snap = await get(ref(db, "users"));
  if (!snap.exists()) return [];

  const data = snap.val() as Record<string, AppUser>;

  return Object.values(data)
    .filter((u) => u.role === "doctor" && !u.banned)
    .map((u) => ({
      id: u.uid,
      name: u.email,
      specialization: "—",
    }));
};
