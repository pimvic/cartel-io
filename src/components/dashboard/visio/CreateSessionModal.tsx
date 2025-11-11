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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Video, Copy, Check } from "lucide-react";
import { format } from "date-fns";

interface CreateSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartelId: string;
  userId: string;
  onSuccess: () => void;
}

export const CreateSessionModal = ({ 
  open, 
  onOpenChange, 
  cartelId, 
  userId,
  onSuccess 
}: CreateSessionModalProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const roomCode = generateRoomCode();
      const now = new Date();
      const endTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour
      
      const { data, error } = await supabase
        .from('visio_sessions')
        .insert({
          cartel_id: cartelId,
          host_id: userId,
          title: `${t('visio.defaultTitle')} – ${format(now, 'yyyy-MM-dd HH:mm')}`,
          start_at: now.toISOString(),
          end_at: endTime.toISOString(),
          duration_minutes: 60,
          status: 'active',
          join_code: roomCode,
          join_url: `${window.location.origin}/visio/join/${roomCode}`,
          provider: 'auto'
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedUrl(data.join_url);
      
      // Auto-copy to clipboard
      await navigator.clipboard.writeText(data.join_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast.success(t('visio.sessionCreated'));
      
      // Open in new tab
      window.open(`/visio/room/${roomCode}`, '_blank');
      
      onSuccess();
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error(t('visio.errors.createSession'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async () => {
    if (createdUrl) {
      await navigator.clipboard.writeText(createdUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(t('common.copied'));
    }
  };

  const handleClose = () => {
    setCreatedUrl("");
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('visio.createSession')}</DialogTitle>
          <DialogDescription>
            {t('visio.createSessionDescription')}
          </DialogDescription>
        </DialogHeader>

        {!createdUrl ? (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">{t('visio.quickStart')}</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>{t('visio.quickStartFeature1')}</li>
                <li>{t('visio.quickStartFeature2')}</li>
                <li>{t('visio.quickStartFeature3')}</li>
              </ul>
            </div>

            <Button onClick={handleCreate} disabled={loading} className="w-full" size="lg">
              <Video className="mr-2 h-5 w-5" />
              {loading ? t('common.loading') : t('visio.startSession')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-success/10 border border-success/20 p-4 rounded-lg space-y-3">
              <p className="font-medium text-success">{t('visio.sessionReady')}</p>
              <div className="flex gap-2">
                <Input 
                  value={createdUrl} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button onClick={handleCopyUrl} variant="outline" size="icon">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('visio.urlCopied')}
              </p>
            </div>

            <Button onClick={handleClose} variant="outline" className="w-full">
              {t('common.close')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};