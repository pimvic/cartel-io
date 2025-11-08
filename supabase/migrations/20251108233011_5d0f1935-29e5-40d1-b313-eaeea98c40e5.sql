-- Create enum for milestone status
CREATE TYPE public.milestone_status AS ENUM ('a_venir', 'en_cours', 'termine');

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.milestone_status NOT NULL DEFAULT 'a_venir',
  importance BOOLEAN NOT NULL DEFAULT false,
  attachments JSONB DEFAULT '[]'::jsonb,
  assignees UUID[] DEFAULT ARRAY[]::UUID[],
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  audit_log JSONB DEFAULT '[]'::jsonb,
  is_final BOOLEAN DEFAULT false
);

-- Create reminders table
CREATE TABLE public.milestone_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestone_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for milestones
-- Users can view milestones in their cartel
CREATE POLICY "Users can view milestones in their cartel"
ON public.milestones
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.cartel_id = milestones.cartel_id
    AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  )
);

-- +1 and Admin can insert milestones
CREATE POLICY "+1 and Admin can insert milestones"
ON public.milestones
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.cartel_id = milestones.cartel_id
    AND u.auth_user_id = auth.uid()
    AND (m.role = 'coordinator' OR u.role = 'admin')
  )
);

-- +1 and Admin can update milestones
CREATE POLICY "+1 and Admin can update milestones"
ON public.milestones
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.cartel_id = milestones.cartel_id
    AND u.auth_user_id = auth.uid()
    AND (m.role = 'coordinator' OR u.role = 'admin')
  )
);

-- Admin can delete milestones
CREATE POLICY "Admin can delete milestones"
ON public.milestones
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_user_id = auth.uid()
    AND role = 'admin'
  )
);

-- RLS Policies for reminders
CREATE POLICY "Users can manage their own reminders"
ON public.milestone_reminders
FOR ALL
USING (
  user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
)
WITH CHECK (
  user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Create trigger for updated_at
CREATE TRIGGER update_milestones_updated_at
BEFORE UPDATE ON public.milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.milestones;

-- Insert seed data
INSERT INTO public.milestones (cartel_id, title, description, due_date, status, importance, created_by, is_final) VALUES
(
  (SELECT id FROM public.cartels LIMIT 1),
  'Rendu du projet Module 5',
  'Soumission finale du projet de développement web',
  '2025-11-20 23:59:00+00',
  'a_venir',
  true,
  (SELECT id FROM public.users LIMIT 1),
  false
),
(
  (SELECT id FROM public.cartels LIMIT 1),
  'Réunion de groupe',
  'Préparation collective pour l''examen',
  '2025-11-15 14:00:00+00',
  'a_venir',
  false,
  (SELECT id FROM public.users LIMIT 1),
  false
),
(
  (SELECT id FROM public.cartels LIMIT 1),
  'Quiz Module 3',
  'Évaluation des connaissances du module 3',
  '2025-11-12 10:00:00+00',
  'a_venir',
  false,
  (SELECT id FROM public.users LIMIT 1),
  false
),
(
  (SELECT id FROM public.cartels LIMIT 1),
  'Revue de code',
  'Revue collective des projets en cours',
  '2025-11-18 16:00:00+00',
  'en_cours',
  false,
  (SELECT id FROM public.users LIMIT 1),
  false
),
(
  (SELECT id FROM public.cartels LIMIT 1),
  'Présentation finale',
  'Présentation du projet devant le jury',
  '2025-12-01 09:00:00+00',
  'a_venir',
  true,
  (SELECT id FROM public.users LIMIT 1),
  false
),
(
  (SELECT id FROM public.cartels LIMIT 1),
  'Échéance finale du cartel',
  'Date de fin officielle du programme et soumission de tous les livrables',
  '2025-12-31 23:59:00+00',
  'a_venir',
  true,
  (SELECT id FROM public.users LIMIT 1),
  true
);