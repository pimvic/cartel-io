import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  FileText,
  Calendar,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Info,
  Brain,
  HelpCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Period = "7" | "30" | "90" | "custom";

interface KPI {
  label: string;
  value: string | number;
  icon: any;
  change?: string;
  section: string;
}

interface Member {
  id: string;
  name: string;
  avatar_url?: string;
  last_activity: string;
  presence: "online" | "idle" | "away";
  total_time?: number;
  items_done?: number;
  connections?: number;
}

interface OverviewProps {
  onNavigate?: (section: string) => void;
}

export const Overview = ({ onNavigate }: OverviewProps) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("30");
  const [loading, setLoading] = useState(true);
  const [cartelId, setCartelId] = useState<string | null>(null);
  const [examDate, setExamDate] = useState<Date | null>(null);
  const [daysToExam, setDaysToExam] = useState<number | null>(null);
  const [showAtRiskBanner, setShowAtRiskBanner] = useState(false);
  
  // KPIs
  const [activeMembers, setActiveMembers] = useState(0);
  const [studyHours, setStudyHours] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [progression, setProgression] = useState(0);
  
  // Members & Activity
  const [members, setMembers] = useState<Member[]>([]);
  const [memberScrollPos, setMemberScrollPos] = useState(0);
  
  // Resource counts
  const [resourceCounts, setResourceCounts] = useState({
    documents: 0,
    notes: 0,
    tasks: 0,
    info: 0,
    qcm: 0,
    quiz: 0,
    flashcards: 0,
  });

  useEffect(() => {
    fetchOverviewData();
  }, [user, period]);

  const fetchOverviewData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get user's cartel
      const { data: membership } = await supabase
        .from("memberships")
        .select("cartel_id, cartels(deadline)")
        .eq("user_id", user.id)
        .single();

      if (membership) {
        setCartelId(membership.cartel_id);
        const deadline = membership.cartels?.deadline;
        if (deadline) {
          const examDateObj = new Date(deadline);
          setExamDate(examDateObj);
          const today = new Date();
          const diffTime = examDateObj.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysToExam(diffDays);
          
          // Show at-risk banner if deadline ≤ 14 days
          setShowAtRiskBanner(diffDays <= 14 && diffDays > 0);
        }

        // Fetch KPIs
        await Promise.all([
          fetchActiveMembers(membership.cartel_id),
          fetchStudyHours(membership.cartel_id),
          fetchTasksCompleted(membership.cartel_id),
          fetchProgression(membership.cartel_id),
          fetchMembers(membership.cartel_id),
          fetchResourceCounts(membership.cartel_id),
        ]);
      }
    } catch (error) {
      console.error("Error fetching overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveMembers = async (cartelId: string) => {
    // Count distinct users with activity in period
    const daysAgo = parseInt(period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const { count } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .gte("last_login_at", cutoffDate.toISOString());

    setActiveMembers(count || 0);
  };

  const fetchStudyHours = async (cartelId: string) => {
    // Mock data - would calculate from session logs
    setStudyHours(42);
  };

  const fetchTasksCompleted = async (cartelId: string) => {
    const daysAgo = parseInt(period);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    const { count } = await supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .eq("cartel_id", cartelId)
      .eq("status", "done")
      .gte("created_at", cutoffDate.toISOString());

    setTasksCompleted(count || 0);
  };

  const fetchProgression = async (cartelId: string) => {
    // Weighted formula: Tasks 40%, QCM 25%, Quiz 15%, Flashcards 20%
    const { data: tasks } = await supabase
      .from("tasks")
      .select("status")
      .eq("cartel_id", cartelId);

    const totalTasks = tasks?.length || 1;
    const doneTasks = tasks?.filter((t) => t.status === "done").length || 0;
    const taskProgress = (doneTasks / totalTasks) * 100;

    // Mock QCM, Quiz, Flashcards progress
    const qcmProgress = 75;
    const quizProgress = 80;
    const flashcardsProgress = 65;

    const weighted =
      taskProgress * 0.4 +
      qcmProgress * 0.25 +
      quizProgress * 0.15 +
      flashcardsProgress * 0.2;

    setProgression(Math.round(weighted));
  };

  const fetchMembers = async (cartelId: string) => {
    const { data: memberships } = await supabase
      .from("memberships")
      .select(`
        user_id,
        users (
          id,
          name,
          avatar_url,
          last_login_at
        )
      `)
      .eq("cartel_id", cartelId);

    if (memberships) {
      const memberData: Member[] = memberships.map((m: any) => {
        const lastLogin = m.users?.last_login_at
          ? new Date(m.users.last_login_at)
          : null;
        const now = new Date();
        const minutesAgo = lastLogin
          ? (now.getTime() - lastLogin.getTime()) / 60000
          : 99999;

        let presence: "online" | "idle" | "away" = "away";
        if (minutesAgo < 5) presence = "online";
        else if (minutesAgo < 1440) presence = "idle";

        return {
          id: m.users?.id || "",
          name: m.users?.name || "Unknown",
          avatar_url: m.users?.avatar_url,
          last_activity: lastLogin
            ? lastLogin.toLocaleDateString()
            : t("overview.noActivity"),
          presence,
          total_time: Math.floor(Math.random() * 20), // Mock
          items_done: Math.floor(Math.random() * 15), // Mock
          connections: Math.floor(Math.random() * 30), // Mock
        };
      });

      setMembers(memberData);
    }
  };

  const fetchResourceCounts = async (cartelId: string) => {
    const [docs, notes, tasks, events, qcm, quiz, flashcards] = await Promise.all([
      supabase.from("knowledge_base_resources").select("id", { count: "exact", head: true }).eq("cartel_id", cartelId),
      supabase.from("notes").select("id", { count: "exact", head: true }).eq("cartel_id", cartelId),
      supabase.from("tasks").select("id", { count: "exact", head: true }).eq("cartel_id", cartelId),
      supabase.from("events").select("id", { count: "exact", head: true }).eq("cartel_id", cartelId),
      supabase.from("quizzes").select("id", { count: "exact", head: true }).eq("cartel_id", cartelId),
      supabase.from("quizzes").select("id", { count: "exact", head: true }).eq("cartel_id", cartelId),
      supabase.from("flashcards").select("id", { count: "exact", head: true }).eq("cartel_id", cartelId),
    ]);

    setResourceCounts({
      documents: docs.count || 0,
      notes: notes.count || 0,
      tasks: tasks.count || 0,
      info: events.count || 0,
      qcm: qcm.count || 0,
      quiz: quiz.count || 0,
      flashcards: flashcards.count || 0,
    });
  };

  const kpis: KPI[] = [
    {
      label: t("overview.kpi.activeMembers"),
      value: activeMembers,
      icon: Users,
      section: "votre-plus-un",
    },
    {
      label: t("overview.kpi.studyHours"),
      value: studyHours,
      icon: Clock,
      section: "calendrier",
    },
    {
      label: t("overview.kpi.tasksCompleted"),
      value: tasksCompleted,
      icon: CheckCircle,
      section: "calendrier",
    },
    {
      label: t("overview.kpi.progression"),
      value: `${progression}%`,
      icon: TrendingUp,
      section: "vue-ensemble",
    },
  ];

  const resourcePills = [
    { label: t("overview.resources.documents"), count: resourceCounts.documents, icon: FileText, section: "base-connaissances" },
    { label: t("overview.resources.notes"), count: resourceCounts.notes, icon: BookOpen, section: "notes" },
    { label: t("overview.resources.tasks"), count: resourceCounts.tasks, icon: ClipboardList, section: "calendrier" },
    { label: t("overview.resources.info"), count: resourceCounts.info, icon: Info, section: "messagerie-news-events" },
    { label: t("overview.resources.qcm"), count: resourceCounts.qcm, icon: Brain, section: "outils-pedagogiques" },
    { label: t("overview.resources.quiz"), count: resourceCounts.quiz, icon: HelpCircle, section: "quiz" },
    { label: t("overview.resources.flashcards"), count: resourceCounts.flashcards, icon: CreditCard, section: "flashcards" },
  ];

  const scrollMembers = (direction: "left" | "right") => {
    const container = document.getElementById("members-carousel");
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("overview.title")}
          </h1>
            {examDate && daysToExam !== null && (
            <p className="text-sm text-muted-foreground mt-1">
              {t("overview.examDate")}: {examDate.toLocaleDateString(i18n.language)} · {t("overview.daysRemaining", { count: daysToExam })}
            </p>
          )}
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <TabsList>
            <TabsTrigger value="7">{t("overview.period.7days")}</TabsTrigger>
            <TabsTrigger value="30">{t("overview.period.30days")}</TabsTrigger>
            <TabsTrigger value="90">{t("overview.period.90days")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* At-Risk Banner */}
      {showAtRiskBanner && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {t("overview.atRiskBanner")} - <strong>{daysToExam} {t("overview.daysRemaining", { count: daysToExam })}</strong>
          </AlertDescription>
        </Alert>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => onNavigate?.(kpi.section)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate?.(kpi.section);
                }
              }}
              aria-label={`${kpi.label}: ${kpi.value}`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {kpi.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {kpi.value}
                    </p>
                  </div>
                  <Icon className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Members Carousel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("overview.membersCarousel.title")}</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollMembers("left")}
                aria-label={t('common.previous', { defaultValue: 'Previous' })}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollMembers("right")}
                aria-label={t('common.next', { defaultValue: 'Next' })}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            id="members-carousel"
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          >
            {members.map((member) => (
              <Card
                key={member.id}
                className="min-w-[200px] flex-shrink-0"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center gap-2">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {member.last_activity}
                      </p>
                    </div>
                    <Badge
                      variant={
                        member.presence === "online"
                          ? "default"
                          : member.presence === "idle"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {t(`overview.presence.${member.presence}`)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress & Resources Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progression Card */}
        <Card>
          <CardHeader>
            <CardTitle>{t("overview.progress.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {t("overview.progress.overall")}
                </span>
                <span className="text-2xl font-bold text-primary">
                  {progression}%
                </span>
              </div>
              <Progress value={progression} className="h-3" />
            </div>
            {examDate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {t("overview.progress.deadline")}
                </span>
                <span className="font-medium">
                  {examDate.toLocaleDateString(i18n.language)}
                </span>
              </div>
            )}
            <div className="pt-2 text-xs text-muted-foreground border-t border-border mt-2 pt-3">
              {t("overview.progress.formula")}
            </div>
          </CardContent>
        </Card>

        {/* Member Activity */}
        <Card>
          <CardHeader>
            <CardTitle>{t("overview.activity.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={member.avatar_url} />
                      <AvatarFallback>
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{member.name}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{member.total_time}h</span>
                    <span>{member.items_done} {t("overview.activity.items")}</span>
                    <span>{member.connections} {t("overview.activity.connections")}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Pills */}
      <Card>
        <CardHeader>
          <CardTitle>{t("overview.resources.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4"
            role="navigation"
            aria-label={t("overview.resources.title")}
          >
            {resourcePills.map((pill, index) => {
              const Icon = pill.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto flex-col items-center justify-center p-4 hover:bg-accent transition-all"
                  onClick={() => onNavigate?.(pill.section)}
                  aria-label={`${pill.label}: ${pill.count}`}
                >
                  <Icon className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-xs font-medium mb-1">{pill.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {pill.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
