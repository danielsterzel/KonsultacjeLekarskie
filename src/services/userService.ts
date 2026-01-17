import { db } from "../firebaseConfig";
import { ref, get, set, update } from "firebase/database";
import type { UserRole } from "../utils/roles";

export type AppUser = {
  uid: string;
  email: string;
  role: UserRole;
  banned?: boolean;
};

export const ensureUserProfile = async (uid: string, email: string) => {
  const snap = await get(ref(db, `users/${uid}`));
  if (snap.exists()) return;

  await set(ref(db, `users/${uid}`), {
    uid,
    email,
    role: "patient",
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
