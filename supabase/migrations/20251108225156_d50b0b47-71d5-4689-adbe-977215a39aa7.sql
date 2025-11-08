-- Create messages table for group communications
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id uuid NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  excerpt text GENERATED ALWAYS AS (
    CASE 
      WHEN length(content) > 200 THEN substring(content, 1, 200) || '...'
      ELSE content
    END
  ) STORED,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create events table for calendar
CREATE TABLE IF NOT EXISTS public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id uuid NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_type text NOT NULL CHECK (event_type IN ('session', 'deadline', 'meeting')),
  event_date timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create notes table for member notes
CREATE TABLE IF NOT EXISTS public.notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id uuid NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text GENERATED ALWAYS AS (
    CASE 
      WHEN length(content) > 100 THEN substring(content, 1, 100) || '...'
      ELSE content
    END
  ) STORED,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
CREATE POLICY "Users can view messages in their cartel"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.cartel_id = messages.cartel_id
      AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert messages in their cartel"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.cartel_id = messages.cartel_id
      AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

-- Create RLS policies for events
CREATE POLICY "Users can view events in their cartel"
  ON public.events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.cartel_id = events.cartel_id
      AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert events in their cartel"
  ON public.events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.cartel_id = events.cartel_id
      AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

-- Create RLS policies for notes
CREATE POLICY "Users can view notes in their cartel"
  ON public.notes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.cartel_id = notes.cartel_id
      AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own notes"
  ON public.notes FOR ALL
  USING (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_cartel_created ON public.messages(cartel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_cartel_date ON public.events(cartel_id, event_date);
CREATE INDEX IF NOT EXISTS idx_notes_cartel_created ON public.notes(cartel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_base_cartel_uploaded ON public.knowledge_base(cartel_id, uploaded_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();