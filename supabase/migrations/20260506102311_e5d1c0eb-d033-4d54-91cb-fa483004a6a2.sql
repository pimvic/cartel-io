
-- Helper: get the public.users.id for the current auth user
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1;
$$;

-- Helper: check if current auth user is a member of a cartel
CREATE OR REPLACE FUNCTION public.is_cartel_member(_cartel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.cartel_id = _cartel_id AND u.auth_user_id = auth.uid()
  );
$$;

-- Helper: check if current auth user is coordinator of a cartel
CREATE OR REPLACE FUNCTION public.is_cartel_coordinator(_cartel_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships m
    JOIN public.users u ON u.id = m.user_id
    WHERE m.cartel_id = _cartel_id
      AND u.auth_user_id = auth.uid()
      AND m.role = 'coordinator'
  );
$$;

-- ======= cartels =======
DROP POLICY IF EXISTS "Allow all cartels access" ON public.cartels;

CREATE POLICY "Members can view their cartels"
  ON public.cartels FOR SELECT TO authenticated
  USING (public.is_cartel_member(id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can create cartels"
  ON public.cartels FOR INSERT TO authenticated
  WITH CHECK (coordinator_id = public.current_user_id());

CREATE POLICY "Coordinators or admins can update cartels"
  ON public.cartels FOR UPDATE TO authenticated
  USING (public.is_cartel_coordinator(id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Coordinators or admins can delete cartels"
  ON public.cartels FOR DELETE TO authenticated
  USING (public.is_cartel_coordinator(id) OR public.has_role(auth.uid(), 'admin'));

-- ======= users =======
DROP POLICY IF EXISTS "Allow all users access" ON public.users;

CREATE POLICY "Users can view themselves and shared cartel members"
  ON public.users FOR SELECT TO authenticated
  USING (
    auth_user_id = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.memberships m1
      JOIN public.memberships m2 ON m1.cartel_id = m2.cartel_id
      WHERE m1.user_id = public.users.id
        AND m2.user_id = public.current_user_id()
    )
  );

CREATE POLICY "Users can update their own record"
  ON public.users FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "Admins can update any user"
  ON public.users FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- INSERT is handled by handle_new_user() SECURITY DEFINER trigger; no public INSERT policy.
-- DELETE: admins only
CREATE POLICY "Admins can delete users"
  ON public.users FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ======= memberships =======
DROP POLICY IF EXISTS "Allow all memberships access" ON public.memberships;

CREATE POLICY "Members can view memberships in their cartels"
  ON public.memberships FOR SELECT TO authenticated
  USING (
    user_id = public.current_user_id()
    OR public.is_cartel_member(cartel_id)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can join as member only"
  ON public.memberships FOR INSERT TO authenticated
  WITH CHECK (
    user_id = public.current_user_id() AND role = 'member'
  );

CREATE POLICY "Coordinators and admins can manage memberships"
  ON public.memberships FOR INSERT TO authenticated
  WITH CHECK (
    public.is_cartel_coordinator(cartel_id) OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Coordinators and admins can update memberships"
  ON public.memberships FOR UPDATE TO authenticated
  USING (public.is_cartel_coordinator(cartel_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Coordinators, admins, or self can delete membership"
  ON public.memberships FOR DELETE TO authenticated
  USING (
    user_id = public.current_user_id()
    OR public.is_cartel_coordinator(cartel_id)
    OR public.has_role(auth.uid(), 'admin')
  );

-- ======= tasks =======
DROP POLICY IF EXISTS "Allow all tasks access" ON public.tasks;

CREATE POLICY "Members can view tasks in their cartels"
  ON public.tasks FOR SELECT TO authenticated
  USING (public.is_cartel_member(cartel_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can insert tasks in their cartels"
  ON public.tasks FOR INSERT TO authenticated
  WITH CHECK (public.is_cartel_member(cartel_id));

CREATE POLICY "Members can update tasks in their cartels"
  ON public.tasks FOR UPDATE TO authenticated
  USING (public.is_cartel_member(cartel_id));

CREATE POLICY "Coordinators or admins can delete tasks"
  ON public.tasks FOR DELETE TO authenticated
  USING (public.is_cartel_coordinator(cartel_id) OR public.has_role(auth.uid(), 'admin'));

-- ======= flashcards =======
DROP POLICY IF EXISTS "Allow all flashcards access" ON public.flashcards;

CREATE POLICY "Members can view flashcards in their cartels"
  ON public.flashcards FOR SELECT TO authenticated
  USING (public.is_cartel_member(cartel_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can insert flashcards in their cartels"
  ON public.flashcards FOR INSERT TO authenticated
  WITH CHECK (public.is_cartel_member(cartel_id));

CREATE POLICY "Members can update flashcards in their cartels"
  ON public.flashcards FOR UPDATE TO authenticated
  USING (public.is_cartel_member(cartel_id));

CREATE POLICY "Coordinators or admins can delete flashcards"
  ON public.flashcards FOR DELETE TO authenticated
  USING (public.is_cartel_coordinator(cartel_id) OR public.has_role(auth.uid(), 'admin'));

-- ======= quizzes =======
DROP POLICY IF EXISTS "Allow all quizzes access" ON public.quizzes;

CREATE POLICY "Members can view quizzes in their cartels"
  ON public.quizzes FOR SELECT TO authenticated
  USING (public.is_cartel_member(cartel_id) OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Members can insert quizzes in their cartels"
  ON public.quizzes FOR INSERT TO authenticated
  WITH CHECK (public.is_cartel_member(cartel_id));

CREATE POLICY "Members can update quizzes in their cartels"
  ON public.quizzes FOR UPDATE TO authenticated
  USING (public.is_cartel_member(cartel_id));

CREATE POLICY "Coordinators or admins can delete quizzes"
  ON public.quizzes FOR DELETE TO authenticated
  USING (public.is_cartel_coordinator(cartel_id) OR public.has_role(auth.uid(), 'admin'));

-- ======= visio_sessions: fix privacy bypass =======
DROP POLICY IF EXISTS "Users can view sessions in their cartel" ON public.visio_sessions;

CREATE POLICY "Members can view visio sessions in their cartel"
  ON public.visio_sessions FOR SELECT TO authenticated
  USING (
    public.is_cartel_member(cartel_id)
    OR host_id = public.current_user_id()
    OR public.has_role(auth.uid(), 'admin')
  );

-- ======= visio_participants: restrict guest inserts =======
DROP POLICY IF EXISTS "Users can add themselves as participants" ON public.visio_participants;

CREATE POLICY "Users can add themselves to accessible sessions"
  ON public.visio_participants FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.visio_sessions s
      WHERE s.id = session_id
        AND (
          public.is_cartel_member(s.cartel_id)
          OR s.host_id = public.current_user_id()
          OR public.has_role(auth.uid(), 'admin')
        )
    )
    AND (
      user_id = public.current_user_id()
      OR (guest_name IS NOT NULL AND user_id IS NULL)
    )
  );

-- ======= plus_one_audit: remove unrestricted insert =======
DROP POLICY IF EXISTS "System can insert audit logs" ON public.plus_one_audit;
-- Inserts should only happen via SECURITY DEFINER functions or service role; no public policy.

-- Enable leaked password protection
-- (handled separately via auth config tool)
