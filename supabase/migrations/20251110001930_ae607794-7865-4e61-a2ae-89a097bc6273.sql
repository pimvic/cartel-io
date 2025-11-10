-- Create threads table for conversations
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  title TEXT,
  is_group BOOLEAN NOT NULL DEFAULT false,
  participants UUID[] NOT NULL DEFAULT ARRAY[]::UUID[],
  last_message_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create chat_messages table (separate from existing messages table)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  mentions UUID[] DEFAULT ARRAY[]::UUID[],
  reactions JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  edited_at TIMESTAMPTZ
);

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  attachments JSONB DEFAULT '[]'::jsonb,
  pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create news_comments table
CREATE TABLE IF NOT EXISTS public.news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  news_id UUID NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

-- Update events table to add missing fields
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS visio_link TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;

-- Create event_attendees table for RSVP
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create pins table for pinned highlights
CREATE TABLE IF NOT EXISTS public.pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  item_id UUID NOT NULL,
  pinned_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pinned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  display_order INTEGER DEFAULT 0
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for threads
CREATE POLICY "Users can view threads in their cartel"
  ON public.threads FOR SELECT
  USING (
    cartel_id IN (
      SELECT cartel_id FROM public.memberships 
      WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create threads in their cartel"
  ON public.threads FOR INSERT
  WITH CHECK (
    cartel_id IN (
      SELECT cartel_id FROM public.memberships 
      WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their threads"
  ON public.chat_messages FOR SELECT
  USING (
    thread_id IN (
      SELECT id FROM public.threads WHERE cartel_id IN (
        SELECT cartel_id FROM public.memberships 
        WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can send messages in their threads"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    sender_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    AND thread_id IN (
      SELECT id FROM public.threads WHERE cartel_id IN (
        SELECT cartel_id FROM public.memberships 
        WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can update their own messages within 10 minutes"
  ON public.chat_messages FOR UPDATE
  USING (
    sender_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    AND created_at > now() - interval '10 minutes'
  );

CREATE POLICY "Users can delete their own messages within 10 minutes"
  ON public.chat_messages FOR DELETE
  USING (
    sender_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    AND created_at > now() - interval '10 minutes'
  );

-- RLS Policies for news
CREATE POLICY "Users can view news in their cartel"
  ON public.news FOR SELECT
  USING (
    cartel_id IN (
      SELECT cartel_id FROM public.memberships 
      WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "+1 and Admin can create news"
  ON public.news FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships m
      JOIN public.users u ON u.id = m.user_id
      WHERE m.cartel_id = news.cartel_id
      AND u.auth_user_id = auth.uid()
      AND (m.role = 'coordinator' OR u.role = 'admin')
    )
  );

CREATE POLICY "+1 and Admin can update news"
  ON public.news FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      JOIN public.users u ON u.id = m.user_id
      WHERE m.cartel_id = news.cartel_id
      AND u.auth_user_id = auth.uid()
      AND (m.role = 'coordinator' OR u.role = 'admin')
    )
  );

-- RLS Policies for news_comments
CREATE POLICY "Users can view comments in their cartel"
  ON public.news_comments FOR SELECT
  USING (
    news_id IN (
      SELECT id FROM public.news WHERE cartel_id IN (
        SELECT cartel_id FROM public.memberships 
        WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can create comments"
  ON public.news_comments FOR INSERT
  WITH CHECK (
    author_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- RLS Policies for event_attendees
CREATE POLICY "Users can view attendees in their cartel"
  ON public.event_attendees FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM public.events WHERE cartel_id IN (
        SELECT cartel_id FROM public.memberships 
        WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can register for events"
  ON public.event_attendees FOR INSERT
  WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can unregister from events"
  ON public.event_attendees FOR DELETE
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- RLS Policies for pins
CREATE POLICY "Users can view pins in their cartel"
  ON public.pins FOR SELECT
  USING (
    cartel_id IN (
      SELECT cartel_id FROM public.memberships 
      WHERE user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "+1 and Admin can manage pins"
  ON public.pins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      JOIN public.users u ON u.id = m.user_id
      WHERE m.cartel_id = pins.cartel_id
      AND u.auth_user_id = auth.uid()
      AND (m.role = 'coordinator' OR u.role = 'admin')
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_threads_cartel_id ON public.threads(cartel_id);
CREATE INDEX IF NOT EXISTS idx_threads_last_message_at ON public.threads(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread_id ON public.chat_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_cartel_id ON public.news(cartel_id);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_comments_news_id ON public.news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON public.event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_pins_cartel_id ON public.pins(cartel_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- Enable realtime for chat_messages, news, events
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_attendees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Trigger to update threads.last_message_at
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.threads
  SET last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_thread_last_message_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_last_message();