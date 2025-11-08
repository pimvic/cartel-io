-- Create enum for resource types
CREATE TYPE public.resource_type AS ENUM (
  'document',
  'video',
  'summary',
  'tool',
  'link'
);

-- Create enum for resource categories
CREATE TYPE public.resource_category AS ENUM (
  'documents',
  'videos',
  'summaries',
  'tools',
  'other'
);

-- Create enum for report status
CREATE TYPE public.report_status AS ENUM (
  'pending',
  'reviewed',
  'resolved',
  'dismissed'
);

-- Drop existing knowledge_base table if it exists (we'll recreate with proper schema)
DROP TABLE IF EXISTS public.knowledge_base CASCADE;

-- Create knowledge_base_resources table
CREATE TABLE public.knowledge_base_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cartel_id UUID NOT NULL REFERENCES public.cartels(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type resource_type NOT NULL,
  category resource_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  resource_url TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT check_file_size CHECK (file_size IS NULL OR file_size <= 20971520) -- 20MB in bytes
);

-- Create knowledge_base_favorites table
CREATE TABLE public.knowledge_base_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  resource_id UUID NOT NULL REFERENCES public.knowledge_base_resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_id)
);

-- Create knowledge_base_reports table
CREATE TABLE public.knowledge_base_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.knowledge_base_resources(id) ON DELETE CASCADE,
  reported_by UUID NOT NULL,
  reason TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'pending',
  reported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID
);

-- Enable RLS on all tables
ALTER TABLE public.knowledge_base_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for knowledge_base_resources
CREATE POLICY "Users can view resources in their cartel"
  ON public.knowledge_base_resources
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.cartel_id = knowledge_base_resources.cartel_id
      AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert resources in their cartel"
  ON public.knowledge_base_resources
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.cartel_id = knowledge_base_resources.cartel_id
      AND memberships.user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
    )
  );

CREATE POLICY "+1 and Admin can update resources"
  ON public.knowledge_base_resources
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      JOIN public.users u ON u.id = m.user_id
      WHERE m.cartel_id = knowledge_base_resources.cartel_id
      AND u.auth_user_id = auth.uid()
      AND (m.role = 'coordinator' OR u.role = 'admin')
    )
  );

CREATE POLICY "+1 and Admin can delete resources"
  ON public.knowledge_base_resources
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.memberships m
      JOIN public.users u ON u.id = m.user_id
      WHERE m.cartel_id = knowledge_base_resources.cartel_id
      AND u.auth_user_id = auth.uid()
      AND (m.role = 'coordinator' OR u.role = 'admin')
    )
  );

-- RLS Policies for knowledge_base_favorites
CREATE POLICY "Users can view their own favorites"
  ON public.knowledge_base_favorites
  FOR SELECT
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "Users can manage their own favorites"
  ON public.knowledge_base_favorites
  FOR ALL
  USING (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  )
  WITH CHECK (
    user_id = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

-- RLS Policies for knowledge_base_reports
CREATE POLICY "Users can view reports in their cartel"
  ON public.knowledge_base_reports
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.knowledge_base_resources r
      JOIN public.memberships m ON m.cartel_id = r.cartel_id
      JOIN public.users u ON u.id = m.user_id
      WHERE r.id = knowledge_base_reports.resource_id
      AND u.auth_user_id = auth.uid()
      AND (m.role = 'coordinator' OR u.role = 'admin')
    )
  );

CREATE POLICY "Users can insert reports"
  ON public.knowledge_base_reports
  FOR INSERT
  WITH CHECK (
    reported_by = (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
  );

CREATE POLICY "+1 and Admin can update reports"
  ON public.knowledge_base_reports
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.knowledge_base_resources r
      JOIN public.memberships m ON m.cartel_id = r.cartel_id
      JOIN public.users u ON u.id = m.user_id
      WHERE r.id = knowledge_base_reports.resource_id
      AND u.auth_user_id = auth.uid()
      AND (m.role = 'coordinator' OR u.role = 'admin')
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_knowledge_base_resources_updated_at
  BEFORE UPDATE ON public.knowledge_base_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for knowledge_base_resources
ALTER PUBLICATION supabase_realtime ADD TABLE public.knowledge_base_resources;