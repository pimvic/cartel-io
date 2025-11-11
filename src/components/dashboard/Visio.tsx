import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CreateSessionModal } from "./visio/CreateSessionModal";
import { ScheduleSessionModal } from "./visio/ScheduleSessionModal";
import { SessionCard } from "./visio/SessionCard";
import { ChevronRight, Plus, Calendar as CalendarIcon, History } from "lucide-react";
import { toast } from "sonner";

export const Visio = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [cartelId, setCartelId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduledSessions, setScheduledSessions] = useState<any[]>([]);
  const [historySessions, setHistorySessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user]);

  useEffect(() => {
    if (cartelId) {
      loadSessions();
    }
  }, [cartelId]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (userError) throw userError;
      setCurrentUserId(userData.id);

      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('cartel_id')
        .eq('user_id', userData.id)
        .single();

      if (membershipError) throw membershipError;
      setCartelId(membership.cartel_id);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const { data: scheduled, error: scheduledError } = await supabase
        .from('visio_sessions')
        .select('*, host:host_id(name)')
        .eq('cartel_id', cartelId)
        .in('status', ['scheduled', 'active'])
        .order('start_at', { ascending: true });

      if (scheduledError) throw scheduledError;

      const { data: history, error: historyError } = await supabase
        .from('visio_sessions')
        .select('*, host:host_id(name)')
        .eq('cartel_id', cartelId)
        .eq('status', 'ended')
        .order('start_at', { ascending: false })
        .limit(10);

      if (historyError) throw historyError;

      setScheduledSessions((scheduled || []) as any);
      setHistorySessions((history || []) as any);
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSession = (sessionId: string, joinCode: string) => {
    window.open(`/visio/room/${joinCode}`, '_blank');
  };

  if (!cartelId || !currentUserId) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-muted-foreground">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{t('dashboard.menu.dashboard')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{t('dashboard.menu.visio')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('visio.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('visio.subtitle')}</p>
        </div>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {t('visio.startSession')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t('visio.startSessionDescription')}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setCreateModalOpen(true)} size="lg" className="flex-1">
              {t('visio.createSession')}
            </Button>
            <Button onClick={() => setScheduleModalOpen(true)} variant="outline" size="lg" className="flex-1">
              <CalendarIcon className="mr-2 h-5 w-5" />
              {t('visio.scheduleSession')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          {t('visio.scheduledSessions')}
        </h2>
        
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('common.loading')}
          </div>
        ) : scheduledSessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t('visio.noScheduledSessions')}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scheduledSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={handleJoinSession}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <History className="h-5 w-5" />
          {t('visio.sessionHistory')}
        </h2>
        
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            {t('common.loading')}
          </div>
        ) : historySessions.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {t('visio.noHistory')}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {historySessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={handleJoinSession}
                showJoinButton={false}
              />
            ))}
          </div>
        )}
      </div>

      <CreateSessionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        cartelId={cartelId}
        userId={currentUserId}
        onSuccess={loadSessions}
      />

      <ScheduleSessionModal
        open={scheduleModalOpen}
        onOpenChange={setScheduleModalOpen}
        cartelId={cartelId}
        userId={currentUserId}
        onSuccess={loadSessions}
      />
    </div>
  );
};
