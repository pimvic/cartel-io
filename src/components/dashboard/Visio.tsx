import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Visio = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.visio.subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              <span>{t('dashboard.visio.startSession.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t('dashboard.visio.startSession.description')}
            </p>
            <Button className="w-full" size="lg">
              <Video className="w-4 h-4 mr-2" />
              {t('dashboard.visio.startSession.button')}
            </Button>
          </CardContent>
        </Card>

        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span>{t('dashboard.visio.scheduledSessions.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm font-medium">{t('dashboard.visio.scheduledSessions.sample.title')}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t('dashboard.visio.scheduledSessions.sample.time')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {t('dashboard.visio.scheduledSessions.sample.participants')}
                  </span>
                </div>
                <Button size="sm" className="mt-3 w-full">{t('dashboard.visio.scheduledSessions.join')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.visio.history.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                title: t('dashboard.visio.history.sessions.session1.title'), 
                date: t('dashboard.visio.history.sessions.session1.date'), 
                duration: t('dashboard.visio.history.sessions.session1.duration'), 
                participants: t('dashboard.visio.history.sessions.session1.participants')
              },
              { 
                title: t('dashboard.visio.history.sessions.session2.title'), 
                date: t('dashboard.visio.history.sessions.session2.date'), 
                duration: t('dashboard.visio.history.sessions.session2.duration'), 
                participants: t('dashboard.visio.history.sessions.session2.participants')
              },
              { 
                title: t('dashboard.visio.history.sessions.session3.title'), 
                date: t('dashboard.visio.history.sessions.session3.date'), 
                duration: t('dashboard.visio.history.sessions.session3.duration'), 
                participants: t('dashboard.visio.history.sessions.session3.participants')
              }
            ].map((session, i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{session.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{session.date}</span>
                    <span>{session.duration}</span>
                    <span>{session.participants}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">{t('dashboard.visio.history.details')}</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
