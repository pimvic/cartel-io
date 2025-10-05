-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('member', 'coordinateur')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create cartels table
CREATE TABLE public.cartels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  coordinator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create memberships table
CREATE TABLE public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  cartel_id UUID REFERENCES public.cartels(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('member', 'coordinateur')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, cartel_id)
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID REFERENCES public.cartels(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create knowledge_base table
CREATE TABLE public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID REFERENCES public.cartels(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Create flashcards table
CREATE TABLE public.flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID REFERENCES public.cartels(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID REFERENCES public.cartels(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cartels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create policies (permissive for prototype - no real auth yet)
CREATE POLICY "Allow all users access" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all cartels access" ON public.cartels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all memberships access" ON public.memberships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all tasks access" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all knowledge_base access" ON public.knowledge_base FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all flashcards access" ON public.flashcards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all quizzes access" ON public.quizzes FOR ALL USING (true) WITH CHECK (true);

-- Insert demo data
INSERT INTO public.users (id, name, email, role, avatar_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Jean-Stéphane B.', 'jean@cartel.com', 'coordinateur', 'https://i.pravatar.cc/150?img=12'),
  ('22222222-2222-2222-2222-222222222222', 'Thierry F.', 'thierry@cartel.com', 'member', 'https://i.pravatar.cc/150?img=13'),
  ('33333333-3333-3333-3333-333333333333', 'Isabelle L.', 'isabelle@cartel.com', 'member', 'https://i.pravatar.cc/150?img=45'),
  ('44444444-4444-4444-4444-444444444444', 'Elsa B.', 'elsa@cartel.com', 'member', 'https://i.pravatar.cc/150?img=47');

INSERT INTO public.cartels (id, name, coordinator_id, deadline) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cartel · Démo', '11111111-1111-1111-1111-111111111111', '2025-12-31');

INSERT INTO public.memberships (user_id, cartel_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'coordinateur'),
  ('22222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member'),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member'),
  ('44444444-4444-4444-4444-444444444444', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member');

INSERT INTO public.knowledge_base (cartel_id, title, file_url) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'B1 M10 La construction du scénario pédagogique.pdf', 'https://example.com/file1.pdf'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'B1 M7 La rédaction d_une progression pédagogique et d_un plan d_accompagnement.pdf', 'https://example.com/file2.pdf'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'B1 M6 Les situations d_apprentissage, d_accompagnement et d_évaluation.pdf', 'https://example.com/file3.pdf'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'B1 M11 Les types d_accompagnement et les outils de suivi associés.pdf', 'https://example.com/file4.pdf'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'B3 M7 L_accueil individuel d_un apprenant en formation - résumé.pdf', 'https://example.com/file5.pdf');

INSERT INTO public.tasks (cartel_id, title, description, due_date, status, assigned_to) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Finaliser le scénario pédagogique', 'Compléter la partie sur les objectifs', '2025-10-15', 'in_progress', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Créer les flashcards du module 7', 'Au moins 20 cartes', '2025-10-20', 'todo', '22222222-2222-2222-2222-222222222222'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Réviser les chapitres 1-3', 'Préparation pour l''examen', '2025-10-18', 'todo', '33333333-3333-3333-3333-333333333333');