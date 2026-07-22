-- ============================================================
-- COMPLETE SUPABASE SCHEMA FOR GERMANO FITNESS PLATFORM
-- Paste this entire file in Supabase SQL Editor and run it
-- ============================================================

-- 1. USERS (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  uid TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  surname TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client',
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  phone TEXT,
  photo_url TEXT,
  birth_date TEXT,
  sex TEXT DEFAULT 'Maschio',
  height REAL,
  weight REAL,
  goal TEXT DEFAULT 'Perdere peso',
  notify_appointments BOOLEAN DEFAULT true,
  notify_workouts BOOLEAN DEFAULT true,
  notify_reports BOOLEAN DEFAULT true,
  notify_promotions BOOLEAN DEFAULT true,
  notify_new_trainings BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. WORKOUT PROGRAMS (Schede + Piani Alimentari)
CREATE TABLE IF NOT EXISTS public.workout_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  goal TEXT DEFAULT '',
  level TEXT DEFAULT 'Principiante',
  target TEXT DEFAULT '',
  location TEXT DEFAULT 'palestra',
  sessions_per_week INTEGER DEFAULT 3,
  total_weeks INTEGER DEFAULT 4,
  price REAL DEFAULT 40,
  image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  active BOOLEAN DEFAULT true,
  days JSONB DEFAULT '[]'::jsonb,
  pdf_name TEXT,
  pdf_data TEXT,
  type TEXT DEFAULT 'workout',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TRAININGS (old catalog)
CREATE TABLE IF NOT EXISTS public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  trainer TEXT DEFAULT 'Germano Team',
  duration TEXT DEFAULT '30 min',
  level TEXT DEFAULT 'Intermedio',
  category TEXT DEFAULT 'Generale',
  price REAL DEFAULT 0,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  video_url TEXT,
  rating REAL DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  user_name TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  total REAL DEFAULT 0,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT 'simulato',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PURCHASES
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  training_id TEXT NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CONSULTATIONS
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id TEXT,
  professional_name TEXT,
  specialty TEXT,
  client_id TEXT,
  client_name TEXT,
  date TEXT,
  time TEXT,
  duration INTEGER DEFAULT 30,
  type TEXT DEFAULT 'online',
  status TEXT DEFAULT 'available',
  price REAL DEFAULT 0,
  notes TEXT,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONVERSATIONS
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participants TEXT[] DEFAULT '{}',
  participant_names JSONB DEFAULT '{}'::jsonb,
  participant_images JSONB DEFAULT '{}'::jsonb,
  last_message TEXT DEFAULT '',
  last_message_time TIMESTAMPTZ,
  unread_count JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MESSAGES
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT,
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT DEFAULT 'reminder',
  title TEXT,
  description TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MEASUREMENTS
CREATE TABLE IF NOT EXISTS public.measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  value REAL NOT NULL,
  unit TEXT DEFAULT '',
  date TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. DOCUMENTS
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT,
  type TEXT DEFAULT 'PDF',
  category TEXT DEFAULT 'program',
  file_url TEXT,
  file_size TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. PROGRESS PHOTOS
CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  photo_url TEXT,
  type TEXT DEFAULT 'progress',
  date TEXT,
  notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ACTIVITIES
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT DEFAULT 'workout',
  title TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. SETTINGS
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT DEFAULT 'Germano Fitness',
  contact_email TEXT DEFAULT 'info@germanofitness.com',
  stripe_public_key TEXT DEFAULT '',
  stripe_secret_key TEXT DEFAULT '',
  features JSONB DEFAULT '{"openRegistration": true, "loyaltyProgram": true, "emailNotifications": true}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PAYMENT METHODS
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  type TEXT DEFAULT 'Visa',
  last4 TEXT,
  expiry TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. SITE CONTENT
CREATE TABLE IF NOT EXISTS public.site_content (
  id TEXT PRIMARY KEY,
  image TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. WORKOUT LOGS
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  training_id TEXT,
  training_name TEXT,
  duration INTEGER DEFAULT 0,
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access for everyone on public-facing tables
CREATE POLICY "Allow all on programs" ON public.workout_programs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on trainings" ON public.trainings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on consultations" ON public.consultations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);

-- Allow authenticated users to read/write their own data
CREATE POLICY "Users own data" ON public.users FOR ALL USING (auth.uid()::text = uid OR auth.role() = 'service_role') WITH CHECK (auth.uid()::text = uid OR auth.role() = 'service_role');
CREATE POLICY "Orders own data" ON public.orders FOR ALL USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');
CREATE POLICY "Purchases own data" ON public.purchases FOR ALL USING (auth.uid()::text = user_id::text OR auth.role() = 'service_role');
CREATE POLICY "Notifications own" ON public.notifications FOR ALL USING (user_id = auth.uid()::text OR auth.role() = 'service_role');
CREATE POLICY "Measurements own" ON public.measurements FOR ALL USING (user_id = auth.uid()::text OR auth.role() = 'service_role');
CREATE POLICY "Documents own" ON public.documents FOR ALL USING (user_id = auth.uid()::text OR auth.role() = 'service_role');
CREATE POLICY "Photos own" ON public.progress_photos FOR ALL USING (user_id = auth.uid()::text OR auth.role() = 'service_role');
CREATE POLICY "Activities own" ON public.activities FOR ALL USING (user_id = auth.uid()::text OR auth.role() = 'service_role');
CREATE POLICY "Payment methods own" ON public.payment_methods FOR ALL USING (user_id = auth.uid()::text OR auth.role() = 'service_role');
CREATE POLICY "Workout logs own" ON public.workout_logs FOR ALL USING (user_id = auth.uid()::text OR auth.role() = 'service_role');

-- Allow all access on conversations/messages for participants
CREATE POLICY "Conversations participants" ON public.conversations FOR ALL USING (auth.role() = 'service_role' OR auth.uid()::text = ANY(participants));
CREATE POLICY "Messages participants" ON public.messages FOR ALL USING (auth.role() = 'service_role' OR EXISTS (SELECT 1 FROM public.conversations WHERE id = conversation_id AND auth.uid()::text = ANY(participants)));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_measurements_user ON public.measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_user ON public.progress_photos(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_user ON public.activities(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user ON public.payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_user ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON public.conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_workout_programs_type ON public.workout_programs(type);
CREATE INDEX IF NOT EXISTS idx_workout_programs_active ON public.workout_programs(active);

-- ============================================================
-- FIX: l'admin deve poter leggere TUTTI gli utenti
-- (la policy "Users own data" limitava la lettura alla propria riga,
--  quindi in Admin > Utenti si vedeva sempre e solo 1 utente)
-- Esegui questo blocco nel SQL Editor di Supabase anche su DB esistenti.
-- ============================================================

-- Funzione SECURITY DEFINER per evitare ricorsione infinita RLS
-- (una policy su users che legge users andrebbe in loop)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE uid = auth.uid()::text AND role = 'admin'
  );
$$;

-- L'admin legge tutti gli utenti; gli altri solo se stessi (policy esistente)
DROP POLICY IF EXISTS "Admins can read all users" ON public.users;
CREATE POLICY "Admins can read all users" ON public.users
FOR SELECT
USING (public.is_admin() OR auth.role() = 'service_role');

-- L'admin può anche aggiornare ruoli/punti di tutti gli utenti
DROP POLICY IF EXISTS "Admins can update all users" ON public.users;
CREATE POLICY "Admins can update all users" ON public.users
FOR UPDATE
USING (public.is_admin() OR auth.role() = 'service_role')
WITH CHECK (public.is_admin() OR auth.role() = 'service_role');

-- L'admin può eliminare utenti dalla tabella profili
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
CREATE POLICY "Admins can delete users" ON public.users
FOR DELETE
USING (public.is_admin() OR auth.role() = 'service_role');

-- ============================================================
-- FIX: crea automaticamente la riga profilo in public.users
-- quando un utente si registra in auth.users
-- (così auth.users e public.users restano SEMPRE sincronizzati:
--  niente più utenti invisibili nell'app)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, uid, name, surname, email, role)
  VALUES (
    NEW.id,
    NEW.id::text,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    COALESCE(NEW.email, ''),
    'client'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Allinea gli utenti già esistenti in auth.users che non hanno
-- ancora una riga in public.users (riempie i "buchi" attuali)
INSERT INTO public.users (id, uid, name, surname, email, role)
SELECT
  au.id,
  au.id::text,
  COALESCE(au.raw_user_meta_data->>'name', ''),
  COALESCE(au.raw_user_meta_data->>'surname', ''),
  COALESCE(au.email, ''),
  'client'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.uid = au.id::text
)
ON CONFLICT (id) DO NOTHING;
