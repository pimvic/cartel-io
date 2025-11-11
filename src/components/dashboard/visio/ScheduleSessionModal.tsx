import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduleSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartelId: string;
  userId: string;
  onSuccess: () => void;
}

export const ScheduleSessionModal = ({ 
  open, 
  onOpenChange, 
  cartelId, 
  userId,
  onSuccess 
}: ScheduleSessionModalProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("14:00");
  const [duration, setDuration] = useState(60);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [transcriptionEnabled, setTranscriptionEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const handleSchedule = async () => {
    if (!startDate) {
      toast.error(t('visio.errors.selectDate'));
      return;
    }

    setLoading(true);
    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const start = new Date(startDate);
      start.setHours(hours, minutes, 0, 0);
      
      const end = new Date(start.getTime() + duration * 60 * 1000);
      const roomCode = generateRoomCode();
      
      const { data: session, error: sessionError } = await supabase
        .from('visio_sessions')
        .insert({
          cartel_id: cartelId,
          host_id: userId,
          title: title || `${t('visio.scheduledSession')} – ${format(start, 'yyyy-MM-dd HH:mm')}`,
          description,
          start_at: start.toISOString(),
          end_at: end.toISOString(),
          duration_minutes: duration,
          status: 'scheduled',
          join_code: roomCode,
          join_url: `${window.location.origin}/visio/join/${roomCode}`,
          recording_enabled: recordingEnabled,
          transcription_enabled: transcriptionEnabled,
          provider: 'auto'
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Create calendar event
      const { error: eventError } = await supabase
        .from('events')
        .insert({
          cartel_id: cartelId,
          title: session.title,
          description: `${description}\n\n${t('visio.joinLink')}: ${session.join_url}`,
          event_type: 'visio',
          event_date: start.toISOString(),
          visio_link: session.join_url
        });

      if (eventError) console.error('Error creating calendar event:', eventError);

      toast.success(t('visio.sessionScheduled'));
      
      // Reset form
      setTitle("");
      setDescription("");
      setStartDate(undefined);
      setStartTime("14:00");
      setDuration(60);
      setRecordingEnabled(false);
      setTranscriptionEnabled(false);
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error scheduling session:', error);
      toast.error(t('visio.errors.scheduleSession'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('visio.scheduleSession')}</DialogTitle>
          <DialogDescription>
            {t('visio.scheduleSessionDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('visio.form.title')}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('visio.form.titlePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('visio.form.description')}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('visio.form.descriptionPlaceholder')}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('visio.form.date')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : t('visio.form.selectDate')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">{t('visio.form.time')}</Label>
              <Input
                id="time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">{t('visio.form.duration')}</Label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border bg-background"
            >
              <option value={30}>30 {t('visio.form.minutes')}</option>
              <option value={60}>1 {t('visio.form.hour')}</option>
              <option value={90}>1.5 {t('visio.form.hours')}</option>
              <option value={120}>2 {t('visio.form.hours')}</option>
              <option value={180}>3 {t('visio.form.hours')}</option>
            </select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="recording">{t('visio.form.recording')}</Label>
              <Switch
                id="recording"
                checked={recordingEnabled}
                onCheckedChange={setRecordingEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="transcription">{t('visio.form.transcription')}</Label>
              <Switch
                id="transcription"
                checked={transcriptionEnabled}
                onCheckedChange={setTranscriptionEnabled}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSchedule} disabled={loading} className="flex-1">
              {loading ? t('common.loading') : t('visio.schedule')}
            </Button>
            <Button onClick={() => onOpenChange(false)} variant="outline">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};