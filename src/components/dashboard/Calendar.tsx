import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, TrendingUp, Calendar as CalendarIcon, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Calendar = () => {
  const milestones = [
    { date: "2025-10-15", title: "Finaliser le scénario pédagogique", status: "upcoming" },
    { date: "2025-10-18", title: "Réviser les chapitres 1-3", status: "upcoming" },
    { date: "2025-10-20", title: "Créer les flashcards du module 7", status: "upcoming" },
    { date: "2025-11-01", title: "Examen intermédiaire", status: "upcoming" },
    { date: "2025-12-31", title: "Échéance finale du cartel", status: "important" },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">Planifiez vos sessions Kartel, notez vos échéances et fixez vos objectifs finaux</p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Calendrier
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Objectifs
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Échéances
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-accent/10 hover-lift">
          <CardContent className="p-6">
            <CalendarDays className="w-8 h-8 text-accent mb-3" />
            <p className="text-2xl font-bold">87 jours</p>
            <p className="text-sm text-muted-foreground">Jusqu'à la fin</p>
          </CardContent>
        </Card>
        <Card className="bg-success/10 hover-lift">
          <CardContent className="p-6">
            <Clock className="w-8 h-8 text-success mb-3" />
            <p className="text-2xl font-bold">3 tâches</p>
            <p className="text-sm text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10 hover-lift">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-primary mb-3" />
            <p className="text-2xl font-bold">68%</p>
            <p className="text-sm text-muted-foreground">Progression</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jalons et Échéances</CardTitle>
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
                    <p className="font-semibold">{milestone.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(milestone.date).toLocaleDateString("fr-FR", {
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
                    {milestone.status === "important" ? "Important" : "À venir"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs du groupe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">🎯 Terminer tous les modules</p>
                    <span className="text-sm text-accent">75%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent rounded-full h-2" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">📝 Réussir l'ECF</p>
                    <span className="text-sm text-accent">En cours</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Préparation en cours</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">💪 Améliorer les compétences</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Échéances importantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">⏰ Module 13 - Urgent</p>
                  <p className="text-sm text-muted-foreground mt-2">Deadline de soumission</p>
                  <p className="text-xs text-muted-foreground mt-1">Dans 2 jours (10 juin 2025)</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">📚 ECF Final</p>
                  <p className="text-sm text-muted-foreground mt-2">Examen de certification</p>
                  <p className="text-xs text-muted-foreground mt-1">15 avril 2025 (dans 87 jours)</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">📋 Révisions collectives</p>
                  <p className="text-sm text-muted-foreground mt-2">Session de groupe planifiée</p>
                  <p className="text-xs text-muted-foreground mt-1">Dans 5 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
