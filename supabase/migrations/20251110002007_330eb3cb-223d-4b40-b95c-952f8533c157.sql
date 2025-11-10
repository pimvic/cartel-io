-- Fix security warning: set search_path for function
DROP TRIGGER IF EXISTS update_thread_last_message_trigger ON public.chat_messages;
DROP FUNCTION IF EXISTS update_thread_last_message();

CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.threads
  SET last_message_at = NEW.created_at,
      updated_at = now()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_thread_last_message_trigger
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_thread_last_message();