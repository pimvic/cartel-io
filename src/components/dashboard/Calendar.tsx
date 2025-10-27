import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, TrendingUp, Calendar as CalendarIcon, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const Calendar = () => {
  const { t, i18n } = useTranslation();
  
  const milestones = [
    { date: "2025-10-15", titleKey: "dashboard.calendar.milestones.events.event1", status: "upcoming" },
    { date: "2025-10-18", titleKey: "dashboard.calendar.milestones.events.event2", status: "upcoming" },
    { date: "2025-10-20", titleKey: "dashboard.calendar.milestones.events.event3", status: "upcoming" },
    { date: "2025-11-01", titleKey: "dashboard.calendar.milestones.events.event4", status: "upcoming" },
    { date: "2025-12-31", titleKey: "dashboard.calendar.milestones.events.event5", status: "important" },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.calendar.subtitle')}</p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {t('dashboard.calendar.tabs.calendar')}
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t('dashboard.calendar.tabs.deadlines')}
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t('dashboard.calendar.tabs.objectives')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('dashboard.calendar.overview.title')}</h3>
            <Button size="sm">{t('dashboard.calendar.overview.addEvent')}</Button>
          </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-accent/10 hover-lift">
          <CardContent className="p-6">
            <CalendarDays className="w-8 h-8 text-accent mb-3" />
            <p className="text-2xl font-bold">87 {t('dashboard.calendar.overview.daysLeft')}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.calendar.overview.untilEnd')}</p>
          </CardContent>
        </Card>
        <Card className="bg-success/10 hover-lift">
          <CardContent className="p-6">
            <Clock className="w-8 h-8 text-success mb-3" />
            <p className="text-2xl font-bold">3 {t('dashboard.calendar.overview.tasks')}</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.calendar.overview.thisWeek')}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 hover-lift">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-primary mb-3" />
            <p className="text-2xl font-bold">68%</p>
            <p className="text-sm text-muted-foreground">{t('dashboard.calendar.overview.progress')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.calendar.milestones.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  milestone.status === "important"
                    ? "border-accent bg-accent/5"
                    : "border-border bg-card"
                } hover-lift`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{t(milestone.titleKey)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(milestone.date).toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      milestone.status === "important"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {milestone.status === "important" ? t('dashboard.calendar.milestones.important') : t('dashboard.calendar.milestones.upcoming')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('dashboard.calendar.goals.title')}</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">{t('dashboard.calendar.goals.archive')}</Button>
              <Button size="sm">{t('dashboard.calendar.goals.create')}</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.calendar.goals.groupGoals')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{t('dashboard.calendar.goals.goal1')}</p>
                    <span className="text-sm text-accent">75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent rounded-full h-2" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{t('dashboard.calendar.goals.goal2')}</p>
                    <span className="text-sm text-accent">{t('dashboard.calendar.goals.inProgress')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t('dashboard.calendar.goals.preparation')}</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{t('dashboard.calendar.goals.goal3')}</p>
                    <span className="text-sm text-accent">90%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent rounded-full h-2" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deadlines" className="mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">{t('dashboard.calendar.deadlines.title')}</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">{t('dashboard.calendar.deadlines.archive')}</Button>
              <Button size="sm">{t('dashboard.calendar.deadlines.create')}</Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.calendar.deadlines.important')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">{t('dashboard.calendar.deadlines.deadline1.title')}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t('dashboard.calendar.deadlines.deadline1.description')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('dashboard.calendar.deadlines.deadline1.time')}</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">{t('dashboard.calendar.deadlines.deadline2.title')}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t('dashboard.calendar.deadlines.deadline2.description')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('dashboard.calendar.deadlines.deadline2.time')}</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">{t('dashboard.calendar.deadlines.deadline3.title')}</p>
                  <p className="text-sm text-muted-foreground mt-2">{t('dashboard.calendar.deadlines.deadline3.description')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('dashboard.calendar.deadlines.deadline3.time')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
