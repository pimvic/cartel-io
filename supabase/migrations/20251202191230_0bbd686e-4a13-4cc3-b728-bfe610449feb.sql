-- Add UPDATE policy for events table
CREATE POLICY "Users can update events in their cartel" 
ON public.events 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM memberships m
    JOIN users u ON u.id = m.user_id
    WHERE m.cartel_id = events.cartel_id
    AND u.auth_user_id = auth.uid()
  )
);

-- Add DELETE policy for events table  
CREATE POLICY "Users can delete events in their cartel" 
ON public.events 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM memberships m
    JOIN users u ON u.id = m.user_id
    WHERE m.cartel_id = events.cartel_id
    AND u.auth_user_id = auth.uid()
  )
);