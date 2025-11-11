-- Create enum for session status
CREATE TYPE public.visio_session_status AS ENUM ('scheduled', 'active', 'ended', 'cancelled');

-- Create enum for session privacy
CREATE TYPE public.visio_session_privacy AS ENUM ('kartel', 'private');

-- Create enum for provider type
CREATE TYPE public.visio_provider AS ENUM ('auto', 'jitsi', 'zoom', 'meet');

-- Create enum for participant role
CREATE TYPE public.visio_participant_role AS ENUM ('host', 'co_host', 'participant', 'guest');

-- Create visio_sessions table
CREATE TABLE public.visio_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMP WITH TIME ZONE NOT NULL,
  end_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status visio_session_status NOT NULL DEFAULT 'scheduled',
  privacy visio_session_privacy NOT NULL DEFAULT 'kartel',
  provider visio_provider NOT NULL DEFAULT 'auto',
  host_id UUID NOT NULL REFERENCES public.users(id),
  join_url TEXT NOT NULL UNIQUE,
  join_code TEXT NOT NULL,
  recording_enabled BOOLEAN DEFAULT false,
  recording_url TEXT,
  transcription_enabled BOOLEAN DEFAULT false,
  transcript_id UUID,
  summary_note_id UUID,
  parent_event_id UUID REFERENCES public.events(id),
  room_locked BOOLEAN DEFAULT false,
  lobby_enabled BOOLEAN DEFAULT true,
  max_participants INTEGER DEFAULT 12,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visio_participants table
CREATE TABLE public.visio_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.visio_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  guest_name TEXT,
  role visio_participant_role NOT NULL DEFAULT 'participant',
  joined_at TIMESTAMP WITH TIME ZONE,
  left_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  consent_recording BOOLEAN DEFAULT false,
  consent_transcription BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT participant_identity CHECK (
    (user_id IS NOT NULL AND guest_name IS NULL) OR
    (user_id IS NULL AND guest_name IS NOT NULL)
  )
);

-- Create visio_transcripts table
CREATE TABLE public.visio_transcripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.visio_sessions(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL DEFAULT 'fr',
  segments JSONB NOT NULL DEFAULT '[]',
  full_text TEXT,
  retention_until TIMESTAMP WITH TIME ZONE,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visio_summaries table
CREATE TABLE public.visio_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.visio_sessions(id) ON DELETE CASCADE,
  note_id UUID REFERENCES public.notes(id),
  decisions TEXT[] DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  highlights TEXT[] DEFAULT '{}',
  risks TEXT[] DEFAULT '{}',
  next_steps TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visio_attendance_logs table
CREATE TABLE public.visio_attendance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.visio_sessions(id) ON DELETE CASCADE,
  participant_id UUID NOT NULL REFERENCES public.visio_participants(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create visio_stt_quota table
CREATE TABLE public.visio_stt_quota (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE UNIQUE,
  used_minutes INTEGER DEFAULT 0,
  soft_cap_minutes INTEGER DEFAULT 600,
  hard_cap_minutes INTEGER DEFAULT 1000,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.visio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visio_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visio_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visio_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visio_attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visio_stt_quota ENABLE ROW LEVEL SECURITY;

-- RLS Policies for visio_sessions
CREATE POLICY "Users can view sessions in their cartel"
  ON public.visio_sessions FOR SELECT
  USING (
    cartel_id IN (
      SELECT cartel_id FROM memberships 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
    OR privacy = 'kartel'
  );

CREATE POLICY "Users can create sessions in their cartel"
  ON public.visio_sessions FOR INSERT
  WITH CHECK (
    host_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    AND cartel_id IN (
      SELECT cartel_id FROM memberships 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Host can update their sessions"
  ON public.visio_sessions FOR UPDATE
  USING (
    host_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
      WHERE m.cartel_id = visio_sessions.cartel_id 
      AND u.auth_user_id = auth.uid() 
      AND m.role = 'coordinator'
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for visio_participants
CREATE POLICY "Users can view participants in visible sessions"
  ON public.visio_participants FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM visio_sessions WHERE 
      cartel_id IN (
        SELECT cartel_id FROM memberships 
        WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can add themselves as participants"
  ON public.visio_participants FOR INSERT
  WITH CHECK (
    user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    OR guest_name IS NOT NULL
  );

CREATE POLICY "Users can update their own participation"
  ON public.visio_participants FOR UPDATE
  USING (user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid()));

-- RLS Policies for visio_transcripts
CREATE POLICY "Users can view transcripts of sessions they attended"
  ON public.visio_transcripts FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM visio_participants 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
    OR session_id IN (
      SELECT id FROM visio_sessions WHERE 
      host_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for visio_summaries
CREATE POLICY "Users can view summaries of sessions they attended"
  ON public.visio_summaries FOR SELECT
  USING (
    session_id IN (
      SELECT session_id FROM visio_participants 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
    OR session_id IN (
      SELECT id FROM visio_sessions WHERE 
      host_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- RLS Policies for visio_attendance_logs
CREATE POLICY "Users can view attendance logs for their sessions"
  ON public.visio_attendance_logs FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM visio_sessions WHERE 
      cartel_id IN (
        SELECT cartel_id FROM memberships 
        WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
      )
    )
  );

-- RLS Policies for visio_stt_quota
CREATE POLICY "+1 and Admin can view STT quota"
  ON public.visio_stt_quota FOR SELECT
  USING (
    cartel_id IN (
      SELECT cartel_id FROM memberships 
      WHERE user_id = (SELECT id FROM users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "+1 and Admin can update STT quota"
  ON public.visio_stt_quota FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memberships m JOIN users u ON u.id = m.user_id
      WHERE m.cartel_id = visio_stt_quota.cartel_id 
      AND u.auth_user_id = auth.uid() 
      AND m.role = 'coordinator'
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Add triggers for updated_at
CREATE TRIGGER update_visio_sessions_updated_at
  BEFORE UPDATE ON public.visio_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visio_transcripts_updated_at
  BEFORE UPDATE ON public.visio_transcripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_visio_stt_quota_updated_at
  BEFORE UPDATE ON public.visio_stt_quota
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_visio_sessions_cartel ON public.visio_sessions(cartel_id);
CREATE INDEX idx_visio_sessions_host ON public.visio_sessions(host_id);
CREATE INDEX idx_visio_sessions_start ON public.visio_sessions(start_at);
CREATE INDEX idx_visio_sessions_status ON public.visio_sessions(status);
CREATE INDEX idx_visio_participants_session ON public.visio_participants(session_id);
CREATE INDEX idx_visio_participants_user ON public.visio_participants(user_id);
CREATE INDEX idx_visio_transcripts_session ON public.visio_transcripts(session_id);
CREATE INDEX idx_visio_attendance_session ON public.visio_attendance_logs(session_id);