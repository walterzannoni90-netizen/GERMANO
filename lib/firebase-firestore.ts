import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
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

// === USERS ===
export async function getAllUsers() {
  const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function updateUser(uid: string, data: Partial<any>) {
  await updateDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteUser(uid: string) {
  await deleteDoc(doc(db, "users", uid));
}

// === PURCHASES (user's purchased training IDs) ===
export async function getUserPurchases(uid: string) {
  const q = query(collection(db, "users", uid, "purchases"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function addUserPurchase(uid: string, trainingId: string) {
  await setDoc(doc(db, "users", uid, "purchases", trainingId), {
    trainingId,
    purchasedAt: serverTimestamp(),
  });
}

export async function hasUserPurchased(uid: string, trainingId: string) {
  const snap = await getDoc(doc(db, "users", uid, "purchases", trainingId));
  return snap.exists();
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
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Training));
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
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Consultation));
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
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function createOrder(data: Omit<Order, "id" | "createdAt">) {
  return await addDoc(ordersCol, { ...data, createdAt: serverTimestamp() });
}

export async function updateOrder(id: string, data: Partial<Order>) {
  await updateDoc(doc(db, "orders", id), data);
}

// === IMAGE UPLOAD (compressed data URL stored in Firestore, no Firebase Storage) ===
const MAX_DATA_URL_BYTES = 750 * 1024; // stay safely under the Firestore 1 MB document limit

function dataUrlBytes(dataUrl: string): number {
  // binary size of a base64 payload ≈ 3/4 of its length
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return Math.ceil((base64.length * 3) / 4);
}

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Il file selezionato non è un'immagine valida");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Il file selezionato non è un'immagine valida"));
      el.src = objectUrl;
    });

    const draw = (maxSide: number, quality: number): string => {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Il file selezionato non è un'immagine valida");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL("image/jpeg", quality);
    };

    const qualities = [0.82, 0.7, 0.6, 0.5];
    const maxSides = [1280, 1024, 800];

    let result = "";
    for (const maxSide of maxSides) {
      for (const quality of qualities) {
        result = draw(maxSide, quality);
        if (dataUrlBytes(result) <= MAX_DATA_URL_BYTES) return result;
      }
    }
    return result; // best effort: smallest attempt even if still above the target
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
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

// === CONVERSATIONS ===
export interface Conversation {
  id?: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantImages: Record<string, string>;
  lastMessage: string;
  lastMessageTime: any;
  unreadCount: Record<string, number>;
  createdAt?: any;
}

const conversationsCol = collection(db, "conversations");

export async function getUserConversations(userId: string) {
  const q = query(conversationsCol, where("participants", "array-contains", userId), orderBy("lastMessageTime", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function getConversation(id: string) {
  const snap = await getDoc(doc(db, "conversations", id));
  return snap.exists() ? { id: snap.id, ...snap.data() } as Conversation : null;
}

export async function createConversation(data: Omit<Conversation, "id" | "createdAt">) {
  return await addDoc(conversationsCol, { ...data, createdAt: serverTimestamp() });
}

export async function updateConversation(id: string, data: Partial<Conversation>) {
  await updateDoc(doc(db, "conversations", id), data);
}

// === MESSAGES ===
export interface Message {
  id?: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: any;
  read: boolean;
}

export async function getMessages(conversationId: string) {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function sendMessage(conversationId: string, data: Omit<Message, "id" | "createdAt">) {
  return await addDoc(collection(db, "conversations", conversationId, "messages"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// === NOTIFICATIONS ===
export interface Notification {
  id?: string;
  userId: string;
  type: "appointment" | "payment" | "message" | "progress" | "reminder";
  title: string;
  description: string;
  read: boolean;
  createdAt: any;
}

const notificationsCol = collection(db, "notifications");

export async function getUserNotifications(userId: string) {
  const q = query(notificationsCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function createNotification(data: Omit<Notification, "id" | "createdAt">) {
  return await addDoc(notificationsCol, { ...data, createdAt: serverTimestamp() });
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(db, "notifications", id), { read: true });
}

// === MEASUREMENTS / PROGRESS ===
export interface Measurement {
  id?: string;
  userId: string;
  type: "weight" | "bodyFat" | "arm" | "waist" | "thigh" | "chest" | "steps";
  value: number;
  unit: string;
  date: string;
  createdAt?: any;
}

const measurementsCol = collection(db, "measurements");

export async function getUserMeasurements(userId: string) {
  const q = query(measurementsCol, where("userId", "==", userId), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function addMeasurement(data: Omit<Measurement, "id" | "createdAt">) {
  return await addDoc(measurementsCol, { ...data, createdAt: serverTimestamp() });
}

export async function getLatestMeasurements(userId: string) {
  const q = query(measurementsCol, where("userId", "==", userId), orderBy("date", "desc"), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

// === DOCUMENTS ===
export interface UserDocument {
  id?: string;
  userId: string;
  name: string;
  type: "PDF" | "JPG" | "PNG" | "DOC";
  category: "program" | "medical" | "receipt" | "consent" | "certificate";
  fileUrl: string;
  fileSize: string;
  uploadedAt?: any;
}

const documentsCol = collection(db, "documents");

export async function getUserDocuments(userId: string) {
  const q = query(documentsCol, where("userId", "==", userId), orderBy("uploadedAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function addDocument(data: Omit<UserDocument, "id" | "uploadedAt">) {
  return await addDoc(documentsCol, { ...data, uploadedAt: serverTimestamp() });
}

export async function deleteDocument(id: string) {
  await deleteDoc(doc(db, "documents", id));
}

// === PROGRESS PHOTOS ===
export interface ProgressPhoto {
  id?: string;
  userId: string;
  photoUrl: string;
  type: "before" | "after" | "progress";
  date: string;
  notes?: string;
  uploadedAt?: any;
}

const progressPhotosCol = collection(db, "progressPhotos");

export async function getUserProgressPhotos(userId: string) {
  const q = query(progressPhotosCol, where("userId", "==", userId), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function addProgressPhoto(data: Omit<ProgressPhoto, "id" | "uploadedAt">) {
  return await addDoc(progressPhotosCol, { ...data, uploadedAt: serverTimestamp() });
}

// === ACTIVITIES ===
export interface Activity {
  id?: string;
  userId: string;
  type: "workout" | "measurement" | "consultation" | "message" | "payment" | "achievement";
  title: string;
  description: string;
  createdAt: any;
}

const activitiesCol = collection(db, "activities");

export async function getUserActivities(userId: string) {
  const q = query(activitiesCol, where("userId", "==", userId), orderBy("createdAt", "desc"), limit(10));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function createActivity(data: Omit<Activity, "id" | "createdAt">) {
  return await addDoc(activitiesCol, { ...data, createdAt: serverTimestamp() });
}

// === SETTINGS ===
export interface PlatformSettings {
  id?: string;
  platformName: string;
  contactEmail: string;
  stripePublicKey: string;
  stripeSecretKey: string;
  features: {
    openRegistration: boolean;
    loyaltyProgram: boolean;
    emailNotifications: boolean;
  };
  updatedAt?: any;
}

const settingsCol = collection(db, "settings");

export async function getSettings() {
  const snap = await getDocs(settingsCol);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as PlatformSettings;
}

export async function saveSettings(data: Omit<PlatformSettings, "id" | "updatedAt">) {
  const snap = await getDocs(settingsCol);
  if (snap.empty) {
    return await addDoc(settingsCol, { ...data, updatedAt: serverTimestamp() });
  } else {
    await updateDoc(doc(db, "settings", snap.docs[0].id), { ...data, updatedAt: serverTimestamp() });
    return snap.docs[0].id;
  }
}

// === PAYMENT METHODS ===
export interface PaymentMethod {
  id?: string;
  userId: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  createdAt?: any;
}

const paymentMethodsCol = collection(db, "paymentMethods");

export async function getUserPaymentMethods(userId: string) {
  const q = query(paymentMethodsCol, where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function addPaymentMethod(data: Omit<PaymentMethod, "id" | "createdAt">) {
  return await addDoc(paymentMethodsCol, { ...data, createdAt: serverTimestamp() });
}

// === WORKOUT PROGRAMS (Schede) ===
export interface WorkoutExercise {
  name: string;
  muscleGroup: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
  isSuperset?: boolean;
}

export interface WorkoutDay {
  dayNumber: number;
  name?: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutProgram {
  id?: string;
  title: string;
  subtitle: string;
  goal: string;
  level: string;
  target: string;
  location: string;
  sessionsPerWeek: number;
  totalWeeks: number;
  price: number;
  image: string;
  description: string;
  active: boolean;
  days: WorkoutDay[];
  createdAt?: any;
}

const programsCol = collection(db, "workoutPrograms");

export async function getWorkoutPrograms() {
  const q = query(programsCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkoutProgram));
}

export async function getWorkoutProgram(id: string) {
  const snap = await getDoc(doc(db, "workoutPrograms", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as WorkoutProgram) : null;
}

export async function createWorkoutProgram(data: Omit<WorkoutProgram, "id" | "createdAt">) {
  return await addDoc(programsCol, { ...data, createdAt: serverTimestamp() });
}

export async function updateWorkoutProgram(id: string, data: Partial<WorkoutProgram>) {
  await updateDoc(doc(db, "workoutPrograms", id), data);
}

export async function deleteWorkoutProgram(id: string) {
  await deleteDoc(doc(db, "workoutPrograms", id));
}

// === WORKOUT LOGS ===
export interface WorkoutLog {
  id?: string;
  userId: string;
  trainingId: string;
  trainingName: string;
  completedAt: any;
  duration: number;
  notes?: string;
}

const workoutLogsCol = collection(db, "workoutLogs");

export async function getUserWorkoutLogs(userId: string) {
  const q = query(workoutLogsCol, where("userId", "==", userId), orderBy("completedAt", "desc"), limit(20));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}

export async function createWorkoutLog(data: Omit<WorkoutLog, "id">) {
  return await addDoc(workoutLogsCol, { ...data, completedAt: serverTimestamp() });
}

// === USER ORDERS (filtered) ===
export async function getUserOrders(userId: string) {
  const q = query(ordersCol, where("userId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
}
