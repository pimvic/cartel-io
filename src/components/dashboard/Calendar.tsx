import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, TrendingUp } from "lucide-react";

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
      <div>
        <h2 className="text-3xl font-bold mb-2">Calendrier</h2>
        <p className="text-muted-foreground">Suivez vos échéances et jalons importants</p>
      </div>

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
    </div>
  );
};
