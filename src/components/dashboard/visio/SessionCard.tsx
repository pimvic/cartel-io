import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, Users, FileText, Mic } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface Session {
  id: string;
  title: string;
  start_at: string;
  end_at: string;
  duration_minutes: number;
  status: string;
  recording_url: string | null;
  transcription_enabled: boolean;
  join_code: string;
  host?: {
    name: string;
  };
}

interface SessionCardProps {
  session: Session;
  onJoin: (sessionId: string, joinCode: string) => void;
  showJoinButton?: boolean;
}

export const SessionCard = ({ session, onJoin, showJoinButton = true }: SessionCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? fr : enUS;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      scheduled: "outline",
      active: "default",
      ended: "secondary",
      cancelled: "destructive"
    };
    
    return (
      <Badge variant={variants[status] || "outline"}>
        {t(`visio.status.${status}`)}
      </Badge>
    );
  };

  const canJoin = session.status === 'scheduled' || session.status === 'active';
  const startDate = new Date(session.start_at);
  const endDate = new Date(session.end_at);

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold mb-1">{session.title}</h4>
            <p className="text-sm text-muted-foreground">
              {session.host?.name || t('visio.unknownHost')}
            </p>
          </div>
          {getStatusBadge(session.status)}
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(startDate, 'PPP', { locale })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {format(startDate, 'p', { locale })} - {format(endDate, 'p', { locale })}
              {' '}({session.duration_minutes} min)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {session.recording_url && (
              <Badge variant="outline" className="gap-1">
                <Video className="h-3 w-3" />
                {t('visio.recorded')}
              </Badge>
            )}
            {session.transcription_enabled && (
              <Badge variant="outline" className="gap-1">
                <Mic className="h-3 w-3" />
                {t('visio.transcribed')}
              </Badge>
            )}
          </div>
        </div>

        {showJoinButton && canJoin && (
          <Button 
            onClick={() => onJoin(session.id, session.join_code)}
            className="w-full mt-4"
            size="sm"
          >
            <Video className="mr-2 h-4 w-4" />
            {t('visio.join')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};