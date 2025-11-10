-- Enhance notes table with additional fields for full functionality
ALTER TABLE public.notes
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS favorited_by uuid[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'personal' CHECK (visibility IN ('personal', 'kartel')),
ADD COLUMN IF NOT EXISTS version_history jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pinned boolean DEFAULT false;

-- Create glossary_terms table
CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id uuid NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  term text NOT NULL,
  definition text NOT NULL,
  category text NOT NULL,
  author_id uuid NOT NULL REFERENCES public.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on glossary_terms
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

-- RLS policies for glossary_terms
CREATE POLICY "Users can view glossary terms in their cartel"
ON public.glossary_terms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.cartel_id = glossary_terms.cartel_id
    AND memberships.user_id = (
      SELECT id FROM public.users WHERE auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can insert glossary terms in their cartel"
ON public.glossary_terms
FOR INSERT
WITH CHECK (
  author_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  AND EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.cartel_id = glossary_terms.cartel_id
    AND memberships.user_id = (
      SELECT id FROM public.users WHERE auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "+1 and Admin can update glossary terms"
ON public.glossary_terms
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.cartel_id = glossary_terms.cartel_id
    AND u.auth_user_id = auth.uid()
    AND (m.role = 'coordinator' OR u.role = 'admin')
  )
);

CREATE POLICY "+1 and Admin can delete glossary terms"
ON public.glossary_terms
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.cartel_id = glossary_terms.cartel_id
    AND u.auth_user_id = auth.uid()
    AND (m.role = 'coordinator' OR u.role = 'admin')
  )
);

-- Update notes RLS policies for visibility control
DROP POLICY IF EXISTS "Users can manage their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view notes in their cartel" ON public.notes;

-- Personal notes: user can manage their own
CREATE POLICY "Users can manage their personal notes"
ON public.notes
FOR ALL
USING (
  user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  AND visibility = 'personal'
)
WITH CHECK (
  user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  AND visibility = 'personal'
);

-- Kartel notes: members can view, +1/Admin can edit
CREATE POLICY "Users can view kartel notes in their cartel"
ON public.notes
FOR SELECT
USING (
  visibility = 'kartel'
  AND EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.cartel_id = notes.cartel_id
    AND memberships.user_id = (
      SELECT id FROM public.users WHERE auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "Users can create kartel notes"
ON public.notes
FOR INSERT
WITH CHECK (
  user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  AND visibility = 'kartel'
  AND EXISTS (
    SELECT 1 FROM public.memberships
    WHERE memberships.cartel_id = notes.cartel_id
    AND memberships.user_id = (
      SELECT id FROM public.users WHERE auth_user_id = auth.uid()
    )
  )
);

CREATE POLICY "+1 and Admin can update kartel notes"
ON public.notes
FOR UPDATE
USING (
  visibility = 'kartel'
  AND EXISTS (
    SELECT 1
    FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.cartel_id = notes.cartel_id
    AND u.auth_user_id = auth.uid()
    AND (m.role = 'coordinator' OR u.role = 'admin')
  )
);

CREATE POLICY "Users can delete their own kartel notes"
ON public.notes
FOR DELETE
USING (
  visibility = 'kartel'
  AND user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Admin can delete any kartel notes"
ON public.notes
FOR DELETE
USING (
  visibility = 'kartel'
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  )
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_notes_visibility ON public.notes(visibility);
CREATE INDEX IF NOT EXISTS idx_notes_archived ON public.notes(archived);
CREATE INDEX IF NOT EXISTS idx_notes_tags ON public.notes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_glossary_cartel ON public.glossary_terms(cartel_id);

-- Add trigger for glossary_terms updated_at
CREATE TRIGGER update_glossary_terms_updated_at
BEFORE UPDATE ON public.glossary_terms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notes
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.glossary_terms;