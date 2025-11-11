import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, Send, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface Request {
  id: string;
  title: string;
  body: string;
  tags: string[];
  visibility: string;
  status: string;
  due_date: string | null;
  created_at: string;
  requester_id: string;
  attachments: any;
}

interface Message {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  attachments: any;
  author: {
    name: string;
    email: string;
  };
}

interface RequestThreadProps {
  requestId: string;
  userId: string;
  isCoordinator: boolean;
  onBack: () => void;
}

const STATUS_OPTIONS = ['ouvert', 'en_cours', 'en_attente_infos', 'resolu', 'ferme'];

export const RequestThread = ({ requestId, userId, isCoordinator, onBack }: RequestThreadProps) => {
  const { t, i18n } = useTranslation();
  const [request, setRequest] = useState<Request | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRequest();
    loadMessages();
    
    // Real-time subscription for new messages
    const channel = supabase
      .channel(`request-${requestId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'plus_one_messages',
          filter: `request_id=eq.${requestId}`
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  const loadRequest = async () => {
    const { data, error } = await supabase
      .from('plus_one_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error) {
      console.error('Error loading request:', error);
      return;
    }

    setRequest(data as any);
  };

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('plus_one_messages')
      .select('*, author:author_id(name, email)')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    setMessages((data || []) as any);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('plus_one_messages')
        .insert({
          request_id: requestId,
          author_id: userId,
          body: newMessage,
          attachments: []
        });

      if (error) throw error;

      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('plusOne.thread.errors.sendMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!isCoordinator) return;

    try {
      const { error } = await supabase
        .from('plus_one_requests')
        .update({ 
          status: newStatus as any,
          ...(newStatus === 'resolu' || newStatus === 'ferme' ? {
            resolved_at: new Date().toISOString(),
            resolved_by: userId
          } : {})
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success(t('plusOne.thread.statusUpdated'));
      loadRequest();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('plusOne.thread.errors.updateStatus'));
    }
  };

  if (!request) {
    return <div className="flex justify-center p-8">{t('common.loading')}</div>;
  }

  const locale = i18n.language === 'fr' ? fr : enUS;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t('common.back')}
      </Button>

      <div className="bg-card p-6 rounded-lg border space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <h2 className="text-2xl font-bold">{request.title}</h2>
            <div className="flex flex-wrap gap-2">
              {request.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {t(`plusOne.tags.${tag}`)}
                </Badge>
              ))}
              {request.visibility === 'prive' && (
                <Badge variant="outline">{t('plusOne.visibility.private')}</Badge>
              )}
            </div>
          </div>
          
          {isCoordinator && (
            <div className="flex flex-col gap-2">
              <select
                value={request.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="px-3 py-2 rounded-md border bg-background"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {t(`plusOne.status.${status}`)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <p className="text-muted-foreground whitespace-pre-wrap">{request.body}</p>
        
        {request.due_date && (
          <p className="text-sm text-muted-foreground">
            {t('plusOne.thread.dueDate')}: {format(new Date(request.due_date), 'PPP', { locale })}
          </p>
        )}

        <p className="text-xs text-muted-foreground">
          {t('plusOne.thread.created')}: {format(new Date(request.created_at), 'PPP', { locale })}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('plusOne.thread.messages')}</h3>
        
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="bg-card p-4 rounded-lg border">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarFallback>
                    {message.author?.name ? message.author.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{message.author?.name || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(message.created_at), 'PPp', { locale })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('plusOne.thread.messagePlaceholder')}
            rows={3}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button onClick={handleSendMessage} disabled={loading || !newMessage.trim()} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};