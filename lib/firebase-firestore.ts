import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

// === USERS ===
export async function getAllUsers() {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateUser(uid: string, data: Partial<any>) {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteUser(uid: string) {
  await deleteDoc(doc(db, "users", uid));
}

// === TRAININGS ===
export interface Training {
  id?: string;
  title: string;
  trainer: string;
  duration: string;
  level: string;
  category: string;
  price: number;
  description: string;
  image: string;
  videoUrl?: string;
  rating: number;
  active: boolean;
  createdAt?: any;
}

const trainingsCol = collection(db, "trainings");

export async function getTrainings() {
  const q = query(trainingsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTraining(id: string) {
  const snap = await getDoc(doc(db, "trainings", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Training) : null;
}

export async function createTraining(data: Omit<Training, "id" | "createdAt">) {
  return await addDoc(trainingsCol, { ...data, createdAt: serverTimestamp() });
}

export async function updateTraining(id: string, data: Partial<Training>) {
  await updateDoc(doc(db, "trainings", id), data);
}

export async function deleteTraining(id: string) {
  await deleteDoc(doc(db, "trainings", id));
}

// === CONSULTATIONS ===
export interface Consultation {
  id?: string;
  professionalId: string;
  professionalName: string;
  specialty: string;
  clientId?: string;
  clientName?: string;
  date: string;
  time: string;
  duration: number;
  type: "online" | "presence";
  status: "available" | "booked" | "completed" | "cancelled";
  price: number;
  notes?: string;
  createdAt?: any;
}

const consultationsCol = collection(db, "consultations");

export async function getConsultations() {
  const q = query(consultationsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createConsultation(data: Omit<Consultation, "id" | "createdAt">) {
  return await addDoc(consultationsCol, { ...data, createdAt: serverTimestamp() });
}

export async function updateConsultation(id: string, data: Partial<Consultation>) {
  await updateDoc(doc(db, "consultations", id), data);
}

// === ORDERS / PAYMENTS ===
export interface Order {
  id?: string;
  userId: string;
  userName: string;
  items: { type: string; name: string; price: number }[];
  total: number;
  status: "pending" | "completed" | "refunded" | "cancelled";
  paymentMethod: string;
  createdAt?: any;
}

const ordersCol = collection(db, "orders");

export async function getOrders() {
  const q = query(ordersCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createOrder(data: Omit<Order, "id" | "createdAt">) {
  return await addDoc(ordersCol, { ...data, createdAt: serverTimestamp() });
}

export async function updateOrder(id: string, data: Partial<Order>) {
  await updateDoc(doc(db, "orders", id), data);
}

// === FILE UPLOAD ===
export async function uploadFile(path: string, file: File) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteFile(path: string) {
  await deleteObject(ref(storage, path));
}

// === DASHBOARD STATS ===
export async function getDashboardStats() {
  const usersSnap = await getDocs(collection(db, "users"));
  const trainingsSnap = await getDocs(trainingsCol);
  const ordersSnap = await getDocs(ordersCol);

  const totalUsers = usersSnap.size;
  const totalTrainings = trainingsSnap.size;
  const totalOrders = ordersSnap.size;
  let totalRevenue = 0;
  ordersSnap.forEach((d) => {
    const data = d.data();
    if (data.status === "completed") totalRevenue += data.total || 0;
  });

  return { totalUsers, totalTrainings, totalOrders, totalRevenue };
}
