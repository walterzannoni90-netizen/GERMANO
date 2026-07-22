import { supabase } from "./supabase";

// ─── Helpers ────────────────────────────────────────────────
function camelToSnake(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
}

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

function mapKeys(obj: any, keyMapper: (k: string) => string): any {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((item) => mapKeys(item, keyMapper));
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    const newKey = keyMapper(key);
    if (value && typeof value === "object" && !(value instanceof Date) && !Array.isArray(value) && !(value instanceof Blob) && !(value instanceof File)) {
      result[newKey] = mapKeys(value, keyMapper);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function toCamel(row: any): any {
  if (!row) return null;
  const result = mapKeys(row, snakeToCamel);
  const tsFields = ["createdAt", "updatedAt", "uploadedAt", "completedAt", "lastMessageTime", "purchasedAt"];
  for (const f of tsFields) {
    const v = result[f];
    if (v && typeof v === "string") {
      result[f] = { toDate: () => new Date(v), toMillis: () => new Date(v).getTime() };
    }
  }
  return result;
}

function toSnake(obj: any): any {
  if (!obj) return obj;
  const result = mapKeys(obj, camelToSnake);
  delete result.id;
  delete result.created_at;
  delete result.updated_at;
  delete result.createdAt;
  delete result.updatedAt;
  return result;
}

function mapRows(rows: any[]): any[] {
  return (rows || []).map(toCamel);
}

// ─── USERS ──────────────────────────────────────────────────
export async function getAllUsers() {
  const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false });
  return mapRows(data || []);
}

export async function updateUser(uid: string, data: Partial<any>) {
  const payload = toSnake(data);
  payload.updated_at = new Date().toISOString();
  await supabase.from("users").update(payload).eq("uid", uid);
}

export async function deleteUser(uid: string) {
  await supabase.from("users").delete().eq("uid", uid);
}

// ─── PURCHASES ──────────────────────────────────────────────
export async function getUserPurchases(uid: string) {
  const { data } = await supabase.from("purchases").select("*").eq("user_id", uid);
  return mapRows(data || []);
}

export async function addUserPurchase(uid: string, trainingId: string) {
  await supabase.from("purchases").insert({ user_id: uid, training_id: trainingId });
}

export async function hasUserPurchased(uid: string, trainingId: string) {
  const { data } = await supabase.from("purchases").select("id").eq("user_id", uid).eq("training_id", trainingId).maybeSingle();
  return !!data;
}

// ─── TRAININGS ──────────────────────────────────────────────
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

export async function getTrainings() {
  const { data } = await supabase.from("trainings").select("*").order("created_at", { ascending: false });
  return mapRows(data || []) as Training[];
}

export async function getTraining(id: string) {
  const { data } = await supabase.from("trainings").select("*").eq("id", id).single();
  return data ? (toCamel(data) as Training) : null;
}

export async function createTraining(data: Omit<Training, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("trainings").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function updateTraining(id: string, data: Partial<Training>) {
  await supabase.from("trainings").update(toSnake(data)).eq("id", id);
}

export async function deleteTraining(id: string) {
  await supabase.from("trainings").delete().eq("id", id);
}

// ─── CONSULTATIONS ──────────────────────────────────────────
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

export async function getConsultations() {
  const { data } = await supabase.from("consultations").select("*").order("created_at", { ascending: false });
  return mapRows(data || []) as Consultation[];
}

export async function createConsultation(data: Omit<Consultation, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("consultations").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function updateConsultation(id: string, data: Partial<Consultation>) {
  await supabase.from("consultations").update(toSnake(data)).eq("id", id);
}

// ─── ORDERS ─────────────────────────────────────────────────
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

export async function getOrders() {
  const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  return mapRows(data || []) as Order[];
}

export async function createOrder(data: Omit<Order, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("orders").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function updateOrder(id: string, data: Partial<Order>) {
  await supabase.from("orders").update(toSnake(data)).eq("id", id);
}

// ─── USER ORDERS ────────────────────────────────────────────
export async function getUserOrders(userId: string) {
  const { data } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return mapRows(data || []);
}

// ─── STORAGE UPLOADS ────────────────────────────────────────
export async function uploadImage(file: File, bucket: string = "program-images"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Il file selezionato non è un'immagine valida");
  }
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error("Errore durante il caricamento dell'immagine");
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return urlData.publicUrl;
}

export async function uploadPDF(file: File): Promise<{ pdfData: string; pdfName: string }> {
  const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) throw new Error("Il file selezionato non è un PDF valido (deve finire con .pdf)");
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.pdf`;
  const { error } = await supabase.storage.from("pdf-files").upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw new Error("Errore durante il caricamento del PDF");
  const { data: urlData } = supabase.storage.from("pdf-files").getPublicUrl(fileName);
  return { pdfData: urlData.publicUrl, pdfName: file.name };
}

// ─── DASHBOARD STATS ────────────────────────────────────────
export async function getDashboardStats() {
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });
  const { count: totalTrainings } = await supabase.from("trainings").select("*", { count: "exact", head: true });
  const { data: orders } = await supabase.from("orders").select("total,status");
  const totalOrders = orders?.length || 0;
  let totalRevenue = 0;
  (orders || []).forEach((o: any) => {
    if (o.status === "completed") totalRevenue += o.total || 0;
  });
  return { totalUsers: totalUsers || 0, totalTrainings: totalTrainings || 0, totalOrders, totalRevenue };
}

// ─── CONVERSATIONS ──────────────────────────────────────────
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

export async function getUserConversations(userId: string) {
  const { data } = await supabase
    .from("conversations")
    .select("*")
    .contains("participants", [userId])
    .order("last_message_time", { ascending: false });
  return mapRows(data || []);
}

export async function getConversation(id: string) {
  const { data } = await supabase.from("conversations").select("*").eq("id", id).single();
  return data ? (toCamel(data) as Conversation) : null;
}

export async function createConversation(data: Omit<Conversation, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("conversations").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function updateConversation(id: string, data: Partial<Conversation>) {
  await supabase.from("conversations").update(toSnake(data)).eq("id", id);
}

// ─── MESSAGES ───────────────────────────────────────────────
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
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return mapRows(data || []);
}

export async function sendMessage(conversationId: string, data: Omit<Message, "id" | "createdAt">) {
  const payload = toSnake(data);
  payload.conversation_id = conversationId;
  const { data: inserted } = await supabase.from("messages").insert(payload).select("id").single();
  return { id: inserted?.id };
}

// ─── REALTIME SUBSCRIPTIONS (replaces onSnapshot) ───────────
export function subscribeToConversations(userId: string, callback: (convs: any[]) => void): () => void {
  getUserConversations(userId).then(callback);
  const channel = supabase
    .channel(`convs:${userId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
      getUserConversations(userId).then(callback);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeToMessages(conversationId: string, callback: (msgs: any[]) => void): () => void {
  getMessages(conversationId).then(callback);
  const channel = supabase
    .channel(`msgs:${conversationId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` }, () => {
      getMessages(conversationId).then(callback);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

// ─── NOTIFICATIONS ──────────────────────────────────────────
export interface Notification {
  id?: string;
  userId: string;
  type: "appointment" | "payment" | "message" | "progress" | "reminder";
  title: string;
  description: string;
  read: boolean;
  createdAt: any;
}

export async function getUserNotifications(userId: string) {
  const { data } = await supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return mapRows(data || []);
}

export async function createNotification(data: Omit<Notification, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("notifications").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function markNotificationRead(id: string) {
  await supabase.from("notifications").update({ read: true }).eq("id", id);
}

// ─── MEASUREMENTS ───────────────────────────────────────────
export interface Measurement {
  id?: string;
  userId: string;
  type: "weight" | "bodyFat" | "arm" | "waist" | "thigh" | "chest" | "steps";
  value: number;
  unit: string;
  date: string;
  createdAt?: any;
}

export async function getUserMeasurements(userId: string) {
  const { data } = await supabase.from("measurements").select("*").eq("user_id", userId).order("date", { ascending: false });
  return mapRows(data || []);
}

export async function addMeasurement(data: Omit<Measurement, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("measurements").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function getLatestMeasurements(userId: string) {
  const { data } = await supabase.from("measurements").select("*").eq("user_id", userId).order("date", { ascending: false }).limit(10);
  return mapRows(data || []);
}

// ─── DOCUMENTS ──────────────────────────────────────────────
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

export async function getUserDocuments(userId: string) {
  const { data } = await supabase.from("documents").select("*").eq("user_id", userId).order("uploaded_at", { ascending: false });
  return mapRows(data || []);
}

export async function addDocument(data: Omit<UserDocument, "id" | "uploadedAt">) {
  const { data: inserted } = await supabase.from("documents").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function deleteDocument(id: string) {
  await supabase.from("documents").delete().eq("id", id);
}

// ─── PROGRESS PHOTOS ────────────────────────────────────────
export interface ProgressPhoto {
  id?: string;
  userId: string;
  photoUrl: string;
  type: "before" | "after" | "progress";
  date: string;
  notes?: string;
  uploadedAt?: any;
}

export async function getUserProgressPhotos(userId: string) {
  const { data } = await supabase.from("progress_photos").select("*").eq("user_id", userId).order("date", { ascending: false });
  return mapRows(data || []);
}

export async function addProgressPhoto(data: Omit<ProgressPhoto, "id" | "uploadedAt">) {
  const { data: inserted } = await supabase.from("progress_photos").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

// ─── ACTIVITIES ─────────────────────────────────────────────
export interface Activity {
  id?: string;
  userId: string;
  type: "workout" | "measurement" | "consultation" | "message" | "payment" | "achievement";
  title: string;
  description: string;
  createdAt: any;
}

export async function getUserActivities(userId: string) {
  const { data } = await supabase.from("activities").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(10);
  return mapRows(data || []);
}

export async function createActivity(data: Omit<Activity, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("activities").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

// ─── SETTINGS ───────────────────────────────────────────────
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

export async function getSettings() {
  const { data } = await supabase.from("settings").select("*").limit(1);
  if (!data || data.length === 0) return null;
  return toCamel(data[0]) as PlatformSettings;
}

export async function saveSettings(data: Omit<PlatformSettings, "id" | "updatedAt">) {
  const { data: existing } = await supabase.from("settings").select("id").limit(1);
  const payload = toSnake(data);
  payload.updated_at = new Date().toISOString();
  if (existing && existing.length > 0) {
    await supabase.from("settings").update(payload).eq("id", existing[0].id);
    return existing[0].id;
  } else {
    const { data: inserted } = await supabase.from("settings").insert(payload).select("id").single();
    return inserted?.id;
  }
}

// ─── PAYMENT METHODS ────────────────────────────────────────
export interface PaymentMethod {
  id?: string;
  userId: string;
  type: string;
  last4: string;
  expiry: string;
  isDefault: boolean;
  createdAt?: any;
}

export async function getUserPaymentMethods(userId: string) {
  const { data } = await supabase.from("payment_methods").select("*").eq("user_id", userId);
  return mapRows(data || []);
}

export async function addPaymentMethod(data: Omit<PaymentMethod, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("payment_methods").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

// ─── WORKOUT PROGRAMS ───────────────────────────────────────
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
  pdfName?: string;
  pdfData?: string;
  type?: "workout" | "nutrition";
  createdAt?: any;
}

export async function getWorkoutPrograms() {
  const { data } = await supabase.from("workout_programs").select("*").order("created_at", { ascending: false });
  return mapRows(data || []) as WorkoutProgram[];
}

export async function getWorkoutProgram(id: string) {
  const { data } = await supabase.from("workout_programs").select("*").eq("id", id).single();
  return data ? (toCamel(data) as WorkoutProgram) : null;
}

export async function createWorkoutProgram(data: Omit<WorkoutProgram, "id" | "createdAt">) {
  const { data: inserted } = await supabase.from("workout_programs").insert(toSnake(data)).select("id").single();
  return { id: inserted?.id };
}

export async function updateWorkoutProgram(id: string, data: Partial<WorkoutProgram>) {
  await supabase.from("workout_programs").update(toSnake(data)).eq("id", id);
}

export async function deleteWorkoutProgram(id: string) {
  await supabase.from("workout_programs").delete().eq("id", id);
}

// ─── WORKOUT LOGS ───────────────────────────────────────────
export interface WorkoutLog {
  id?: string;
  userId: string;
  trainingId: string;
  trainingName: string;
  completedAt: any;
  duration: number;
  notes?: string;
}

export async function getUserWorkoutLogs(userId: string) {
  const { data } = await supabase.from("workout_logs").select("*").eq("user_id", userId).order("completed_at", { ascending: false }).limit(20);
  return mapRows(data || []);
}

export async function createWorkoutLog(data: Omit<WorkoutLog, "id">) {
  await supabase.from("workout_logs").insert(toSnake(data));
}

// ─── SITE CONTENT ───────────────────────────────────────────
export async function getSiteContent(key: string): Promise<string | null> {
  const { data } = await supabase.from("site_content").select("image").eq("id", key).single();
  if (!data) return null;
  return data.image || null;
}

export async function saveSiteContent(key: string, imageDataUrl: string): Promise<void> {
  await supabase.from("site_content").upsert(
    { id: key, image: imageDataUrl, updated_at: new Date().toISOString() },
    { onConflict: "id" }
  );
}
