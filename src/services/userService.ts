import { db } from "../firebaseConfig";
import { ref, get, set, update } from "firebase/database";
import { getInitialRoleFromEmail, type UserRole  } from "../utils/roles";

export type AppUser = {
  uid: string;
  email: string;
  role: UserRole;
  banned?: boolean;
};

export const ensureUserProfile = async (uid: string, email: string) => {
  const snap = await get(ref(db, `users/${uid}`));
  if (snap.exists()) return;

  const role = getInitialRoleFromEmail(email);

  await set(ref(db, `users/${uid}`), {
    uid,
    email,
    role,
    banned: false,
  });
};


export const getUserProfile = async (uid: string): Promise<AppUser | null> => {
  const snap = await get(ref(db, `users/${uid}`));
  return snap.exists() ? (snap.val() as AppUser) : null;
};

export const setUserRole = async (uid: string, role: UserRole) => {
  await update(ref(db, `users/${uid}`), { role });
};

export const setUserBanned = async (uid: string, banned: boolean) => {
  await update(ref(db, `users/${uid}`), { banned });
};


export const getAllUsers = async (): Promise<AppUser[]> => {
  const snap = await get(ref(db, "users"));
  if (!snap.exists()) return [];

  const data = snap.val() as Record<string, AppUser>;
  return Object.values(data);
};


export const getDoctors = async (): Promise<AppUser[]> => {
  const snap = await get(ref(db, "users"));
  if (!snap.exists()) return [];

  const data = snap.val() as Record<string, AppUser>;

  return Object.values(data).filter(
    (u) => u.role === "doctor" && !u.banned
  );
};
