"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { getUserData, UserData, logOut as supabaseLogOut } from "@/lib/firebase-auth";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
  refreshUserData: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null;
      setSupabaseUser(u);
      if (u) {
        getUserData(u.id).then(setUserData);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setSupabaseUser(u);
      if (u) {
        const data = await getUserData(u.id);
        if (data) {
          if (u.email === "ptgermanopoleselli@gmail.com" && data.role !== "admin") {
            await supabase.from("users").update({ role: "admin" }).eq("uid", u.id);
            data.role = "admin";
          }
        }
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabaseLogOut();
  };

  const refreshUserData = async () => {
    if (supabaseUser) {
      const data = await getUserData(supabaseUser.id);
      setUserData(data);
    }
  };

  const user = supabaseUser
    ? {
        uid: supabaseUser.id,
        email: supabaseUser.email ?? null,
        displayName: supabaseUser.user_metadata?.full_name || null,
        photoURL: supabaseUser.user_metadata?.photo_url || null,
      }
    : null;

  const isAdmin = userData?.role === "admin" || supabaseUser?.email === "ptgermanopoleselli@gmail.com";

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin, logout, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
