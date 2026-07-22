import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

export type { User } from "@supabase/supabase-js";

export interface UserData {
  uid: string;
  name: string;
  surname: string;
  email: string;
  role: "admin" | "professional" | "client";
  createdAt: any;
  updatedAt: any;
  points: number;
  level: number;
  active: boolean;
  phone?: string;
  photoURL?: string;
  birthDate?: string;
  sex?: string;
  height?: number;
  weight?: number;
  goal?: string;
  notifyAppointments?: boolean;
  notifyWorkouts?: boolean;
  notifyReports?: boolean;
  notifyPromotions?: boolean;
  notifyNewTrainings?: boolean;
}

function mapUserRow(row: any): UserData | null {
  if (!row) return null;
  return {
    uid: row.uid,
    name: row.name,
    surname: row.surname,
    email: row.email,
    role: row.role,
    points: row.points ?? 0,
    level: row.level ?? 1,
    active: row.active ?? true,
    phone: row.phone,
    photoURL: row.photo_url,
    birthDate: row.birth_date,
    sex: row.sex,
    height: row.height,
    weight: row.weight,
    goal: row.goal,
    notifyAppointments: row.notify_appointments,
    notifyWorkouts: row.notify_workouts,
    notifyReports: row.notify_reports,
    notifyPromotions: row.notify_promotions,
    notifyNewTrainings: row.notify_new_trainings,
    createdAt: row.created_at ? { toDate: () => new Date(row.created_at), toMillis: () => new Date(row.created_at).getTime() } : undefined,
    updatedAt: row.updated_at ? { toDate: () => new Date(row.updated_at), toMillis: () => new Date(row.updated_at).getTime() } : undefined,
  };
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  surname: string
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: `${name} ${surname}`, name, surname } },
  });
  if (authError) throw authError;
  if (!authData.user) throw new Error("Registrazione fallita");

  try {
    const { data: existingUsers } = await supabase.from("users").select("id").limit(1);
    const isFirstUser = !existingUsers || existingUsers.length === 0;

    await supabase.from("users").insert({
      id: authData.user.id,
      uid: authData.user.id,
      name,
      surname,
      email,
      role: isFirstUser ? "admin" : "client",
    });
  } catch {
    // Se l'inserimento fallisce (es. email da confermare), verrà gestito
    // dal trigger DB o al primo login
  }

  return authData.user;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function logOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}

export async function getUserData(uid: string): Promise<UserData | null> {
  const { data, error } = await supabase.from("users").select("*").eq("uid", uid).single();
  if (error || !data) return null;
  return mapUserRow(data);
}
