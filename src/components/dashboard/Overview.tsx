import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, ChevronUp, Clock, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
}

const randomColors = [
  "bg-accent/30",
  "bg-success/30",
  "bg-primary/10",
  "bg-secondary/50",
];

const getRandomColor = () => randomColors[Math.floor(Math.random() * randomColors.length)];

export const Overview = () => {
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("cartel_id", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
      .order("created_at", { ascending: false });

    if (data) {
      setTasks(data);
    }
    setLoading(false);
  };

  const completedTasks = tasks.filter(t => t.status === "done").length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    { label: "Heures de travail", value: "42h", icon: Clock, color: "text-accent" },
    { label: "Tâches complétées", value: `${completedTasks}/${totalTasks}`, icon: CheckCircle2, color: "text-success" },
    { label: "Membres actifs", value: "4", icon: Users, color: "text-primary" },
    { label: "Progression", value: `${completionPercentage}%`, icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Vue d'ensemble</h2>
        <p className="text-muted-foreground">Bienvenue sur votre tableau de bord Cartel</p>
      </div>

      {/* Mes Tâches - Collapsible */}
      <Card className={`${getRandomColor()} border-l-4 border-l-accent transition-smooth`}>
        <CardHeader className="cursor-pointer" onClick={() => setTasksExpanded(!tasksExpanded)}>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-6 bg-accent rounded-full" />
              Mes Tâches
            </CardTitle>
            <Button variant="ghost" size="sm">
              {tasksExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>
        </CardHeader>
        {tasksExpanded && (
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-muted-foreground">Chargement...</p>
            ) : tasks.length === 0 ? (
              <p className="text-muted-foreground">Aucune tâche pour le moment</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="p-3 bg-background rounded-lg border border-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Échéance: {new Date(task.due_date).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        task.status === "done"
                          ? "bg-success/20 text-success"
                          : task.status === "in_progress"
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {task.status === "done" ? "Terminé" : task.status === "in_progress" ? "En cours" : "À faire"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        )}
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className={`${getRandomColor()} hover-lift`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calendrier et Progression */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className={`${getRandomColor()} hover-lift`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-6 bg-success rounded-full" />
              Progression du Cartel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Tâches</span>
                <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <div className="pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Échéance finale:</span>
                <span className="font-medium">31 décembre 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jours restants:</span>
                <span className="font-medium">87 jours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${getRandomColor()} hover-lift`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-6 bg-accent rounded-full" />
              Activité des Membres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Jean-Stéphane B.", hours: 12, questions: 8, connections: 24 },
              { name: "Thierry F.", hours: 10, questions: 6, connections: 18 },
              { name: "Isabelle L.", hours: 11, questions: 7, connections: 20 },
              { name: "Elsa B.", hours: 9, questions: 5, connections: 15 },
            ].map((member, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-background rounded-lg">
                <span className="font-medium text-sm">{member.name}</span>
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <span>{member.hours}h</span>
                  <span>{member.questions} Q</span>
                  <span>{member.connections} conn.</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
