import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc, getDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function signUp(
  email: string,
  password: string,
  name: string,
  surname: string
) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: `${name} ${surname}` });
  const usersSnap = await getDocs(collection(db, "users"));
  const isFirstUser = usersSnap.empty;
  await setDoc(doc(db, "users", cred.user.uid), {
    uid: cred.user.uid,
    name,
    surname,
    email,
    role: isFirstUser ? "admin" : "client",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    points: 0,
    level: 1,
    active: true,
  });
  return cred.user;
}

export async function signIn(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function logOut() {
  await signOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function getUserData(uid: string) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserData) : null;
}

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
