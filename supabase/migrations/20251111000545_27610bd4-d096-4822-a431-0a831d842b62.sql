-- Create enum for request status
CREATE TYPE public.plus_one_status AS ENUM ('ouvert', 'en_cours', 'en_attente_infos', 'resolu', 'ferme');

-- Create enum for request visibility
CREATE TYPE public.plus_one_visibility AS ENUM ('kartel', 'prive');

-- Create enum for action types
CREATE TYPE public.plus_one_action_type AS ENUM ('message', 'resource', 'note', 'lien', 'status_change');

-- Create plus_one_profiles table for +1 facilitator info
CREATE TABLE public.plus_one_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  bio TEXT,
  expertise_tags TEXT[] DEFAULT '{}',
  office_hours JSONB DEFAULT '{}',
  sla_hint TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create plus_one_requests table
CREATE TABLE public.plus_one_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  visibility plus_one_visibility NOT NULL DEFAULT 'kartel',
  status plus_one_status NOT NULL DEFAULT 'ouvert',
  due_date TIMESTAMP WITH TIME ZONE,
  attachments JSONB DEFAULT '[]',
  linked_items JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES public.users(id)
);

-- Create plus_one_messages table for request threads
CREATE TABLE public.plus_one_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.plus_one_requests(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  edited_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create plus_one_feed table for activity tracking
CREATE TABLE public.plus_one_feed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type plus_one_action_type NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plus_one_audit table for compliance and traceability
CREATE TABLE public.plus_one_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  diff JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plus_one_watchers table for notification subscriptions
CREATE TABLE public.plus_one_watchers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.plus_one_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(request_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.plus_one_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plus_one_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plus_one_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plus_one_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plus_one_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plus_one_watchers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for plus_one_profiles
CREATE POLICY "Users can view all +1 profiles"
  ON public.plus_one_profiles FOR SELECT
  USING (true);

CREATE POLICY "+1 and Admin can update profiles"
  ON public.plus_one_profiles FOR UPDATE
  USING (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "+1 and Admin can insert profiles"
  ON public.plus_one_profiles FOR INSERT
  WITH CHECK (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for plus_one_requests
CREATE POLICY "Users can view kartel requests in their cartel"
  ON public.plus_one_requests FOR SELECT
  USING (
    (visibility = 'kartel' AND cartel_id IN (
      SELECT cartel_id FROM memberships 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    ))
    OR (visibility = 'prive' AND (
      requester_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
        WHERE m.cartel_id = plus_one_requests.cartel_id 
        AND u.auth_user_id = auth.uid() 
        AND m.role = 'coordinator'
      )
      OR has_role(auth.uid(), 'admin'::app_role)
    ))
  );

CREATE POLICY "Users can create requests in their cartel"
  ON public.plus_one_requests FOR INSERT
  WITH CHECK (
    requester_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    AND cartel_id IN (
      SELECT cartel_id FROM memberships 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "+1 and Admin can update request status"
  ON public.plus_one_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
      WHERE m.cartel_id = plus_one_requests.cartel_id 
      AND u.auth_user_id = auth.uid() 
      AND m.role = 'coordinator'
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for plus_one_messages
CREATE POLICY "Users can view messages for visible requests"
  ON public.plus_one_messages FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM plus_one_requests WHERE 
      (visibility = 'kartel' AND cartel_id IN (
        SELECT cartel_id FROM memberships 
        WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      ))
      OR (visibility = 'prive' AND (
        requester_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
        OR EXISTS (
          SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
          WHERE m.cartel_id = plus_one_requests.cartel_id 
          AND u.auth_user_id = auth.uid() 
          AND m.role = 'coordinator'
        )
        OR has_role(auth.uid(), 'admin'::app_role)
      ))
    )
  );

CREATE POLICY "Users can create messages in visible requests"
  ON public.plus_one_messages FOR INSERT
  WITH CHECK (
    author_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    AND request_id IN (
      SELECT id FROM plus_one_requests WHERE 
      (visibility = 'kartel' AND cartel_id IN (
        SELECT cartel_id FROM memberships 
        WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      ))
      OR (visibility = 'prive' AND (
        requester_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
        OR EXISTS (
          SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
          WHERE m.cartel_id = plus_one_requests.cartel_id 
          AND u.auth_user_id = auth.uid() 
          AND m.role = 'coordinator'
        )
        OR has_role(auth.uid(), 'admin'::app_role)
      ))
    )
  );

-- RLS Policies for plus_one_feed
CREATE POLICY "Users can view feed in their cartel"
  ON public.plus_one_feed FOR SELECT
  USING (
    cartel_id IN (
      SELECT cartel_id FROM memberships 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "+1 and Admin can insert feed items"
  ON public.plus_one_feed FOR INSERT
  WITH CHECK (
    actor_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    AND (
      EXISTS (
        SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
        WHERE m.cartel_id = plus_one_feed.cartel_id 
        AND u.auth_user_id = auth.uid() 
        AND m.role = 'coordinator'
      )
      OR has_role(auth.uid(), 'admin'::app_role)
    )
  );

-- RLS Policies for plus_one_audit
CREATE POLICY "Admin can view all audit logs"
  ON public.plus_one_audit FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert audit logs"
  ON public.plus_one_audit FOR INSERT
  WITH CHECK (true);

-- RLS Policies for plus_one_watchers
CREATE POLICY "Users can view watchers for visible requests"
  ON public.plus_one_watchers FOR SELECT
  USING (
    request_id IN (
      SELECT id FROM plus_one_requests WHERE 
      (visibility = 'kartel' AND cartel_id IN (
        SELECT cartel_id FROM memberships 
        WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      ))
      OR (visibility = 'prive' AND (
        requester_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
        OR EXISTS (
          SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
          WHERE m.cartel_id = plus_one_requests.cartel_id 
          AND u.auth_user_id = auth.uid() 
          AND m.role = 'coordinator'
        )
        OR has_role(auth.uid(), 'admin'::app_role)
      ))
    )
  );

CREATE POLICY "Users can manage their own watcher subscriptions"
  ON public.plus_one_watchers FOR ALL
  USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()))
  WITH CHECK (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_plus_one_profiles_updated_at
  BEFORE UPDATE ON public.plus_one_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_plus_one_requests_updated_at
  BEFORE UPDATE ON public.plus_one_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_plus_one_requests_cartel ON public.plus_one_requests(cartel_id);
CREATE INDEX idx_plus_one_requests_requester ON public.plus_one_requests(requester_id);
CREATE INDEX idx_plus_one_requests_status ON public.plus_one_requests(status);
CREATE INDEX idx_plus_one_messages_request ON public.plus_one_messages(request_id);
CREATE INDEX idx_plus_one_feed_cartel ON public.plus_one_feed(cartel_id);
CREATE INDEX idx_plus_one_feed_created ON public.plus_one_feed(created_at DESC);
CREATE INDEX idx_plus_one_audit_target ON public.plus_one_audit(target_type, target_id);

-- Add constraint to ensure at least one tag
ALTER TABLE public.plus_one_requests ADD CONSTRAINT plus_one_requests_tags_not_empty CHECK (array_length(tags, 1) > 0);