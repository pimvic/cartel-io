import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Calendar as CalendarIcon, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  excerpt: string;
  created_at: string;
  user: { name: string };
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  event_type: 'session' | 'deadline' | 'meeting';
  event_date: string;
}

interface Document {
  id: string;
  title: string;
  file_url: string;
  uploaded_at: string;
  user?: { name: string };
}

interface Note {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  created_at: string;
  user: { name: string };
}

export const ActuKartel = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const locale = i18n.language === 'fr' ? fr : enUS;

  const fetchData = async () => {
    try {
      // Get current user's agora
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) return;

      const { data: membership } = await supabase
        .from('memberships')
        .select('cartel_id')
        .eq('user_id', userData.id)
        .single();

      if (!membership) return;

      const cartelId = membership.cartel_id;

      // Fetch latest messages (3-5 most recent)
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('id, content, excerpt, created_at, user:users(name)')
        .eq('cartel_id', cartelId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (messagesError) throw messagesError;
      setMessages(messagesData || []);

      // Fetch upcoming events (next 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, description, event_type, event_date')
        .eq('cartel_id', cartelId)
        .gte('event_date', new Date().toISOString())
        .lte('event_date', sevenDaysFromNow.toISOString())
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;
      setEvents((eventsData as Event[]) || []);

      // Fetch recent documents (5 most recent)
      const { data: documentsData, error: documentsError } = await supabase
        .from('knowledge_base_resources')
        .select('id, title, resource_url, uploaded_at')
        .eq('cartel_id', cartelId)
        .order('uploaded_at', { ascending: false })
        .limit(5);

      if (documentsError) throw documentsError;
      setDocuments(documentsData?.map(d => ({
        id: d.id,
        title: d.title,
        file_url: d.resource_url,
        uploaded_at: d.uploaded_at
      })) || []);

      // Fetch recent notes
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('id, title, content, excerpt, created_at, user:users(name)')
        .eq('cartel_id', cartelId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (notesError) throw notesError;
      setNotes(notesData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: t('common.error'),
        description: t('dashboard.actuKartel.errorLoading'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getEventColor = (type: string) => {
    switch (type) {
      case 'session': return 'text-blue-500';
      case 'deadline': return 'text-orange-500';
      case 'meeting': return 'text-green-500';
      default: return 'text-accent';
    }
  };

  const getEventBgColor = (type: string) => {
    switch (type) {
      case 'session': return 'bg-blue-500/5';
      case 'deadline': return 'bg-orange-500/5';
      case 'meeting': return 'bg-green-500/5';
      default: return 'bg-accent/5';
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.actuKartel.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Messages */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Draggable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.latestMessages.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('dashboard.actuKartel.noData')}</p>
            ) : (
              <div className="space-y-3">
                {messages.map((message) => (
                  <TooltipProvider key={message.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-3 bg-accent/5 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors">
                          <p className="text-sm font-medium">{message.user?.name || t('dashboard.actuKartel.unknownUser')}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{message.excerpt}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(message.created_at)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-md">
                        <p className="text-sm">{message.content.substring(0, 200)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Draggable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.upcomingEvents.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('dashboard.actuKartel.noData')}</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className={`p-3 ${getEventBgColor(event.event_type)} rounded-lg cursor-pointer hover:opacity-80 transition-opacity`}
                  >
                    <div className="flex items-start gap-2">
                      <CalendarIcon className={`w-4 h-4 mt-0.5 ${getEventColor(event.event_type)}`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(event.event_date)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Draggable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.recentDocuments.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('dashboard.actuKartel.noData')}</p>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 bg-accent/5 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors"
                  >
                    <p className="text-sm font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(doc.uploaded_at)}</p>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Draggable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <span>{t('dashboard.actuKartel.recentNotes.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('dashboard.actuKartel.noData')}</p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <TooltipProvider key={note.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-3 bg-accent/5 rounded-lg cursor-pointer hover:bg-accent/10 transition-colors">
                          <p className="text-sm font-medium">{note.title}</p>
                          <p className="text-xs text-muted-foreground">{t('dashboard.actuKartel.by')} {note.user?.name || t('dashboard.actuKartel.unknownUser')}</p>
                          <p className="text-xs text-muted-foreground mt-1">{formatDate(note.created_at)}</p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-md">
                        <p className="text-sm">{note.excerpt}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
