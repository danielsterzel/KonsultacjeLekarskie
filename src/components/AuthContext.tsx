import { createContext, useContext, useEffect, useState } from "react";
import { observeAuth } from "../services/authService";
import { ensureUserProfile, getUserProfile } from "../services/userService";
import type { AppUser } from "../services/userService";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return observeAuth(async (u) => {
      if (!u) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      await ensureUserProfile(u.uid, u.email);
      const p = await getUserProfile(u.uid);

      setUser(u);
      setProfile(p);
      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
