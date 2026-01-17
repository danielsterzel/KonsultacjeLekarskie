import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  onAuthStateChanged,
} from "firebase/auth";

export type AuthPersistence = "LOCAL" | "SESSION" | "NONE";

export const setAuthPersistence = async (mode: AuthPersistence) => {
  switch (mode) {
    case "LOCAL":
      return setPersistence(auth, browserLocalPersistence);
    case "SESSION":
      return setPersistence(auth, browserSessionPersistence);
    case "NONE":
      return setPersistence(auth, inMemoryPersistence);
  }
};

export const login = async (
  email: string,
  password: string,
  persistence: AuthPersistence = "LOCAL",
) => {
  await setAuthPersistence(persistence);
  return signInWithEmailAndPassword(auth, email, password);
};

export const register = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);

export const observeAuth = (callback: (user: any) =>
  void) => onAuthStateChanged(auth, callback);
