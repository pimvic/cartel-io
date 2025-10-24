import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Clock,
  CheckCircle2,
  Target,
  FileText,
  StickyNote,
  CheckSquare,
  Info,
  Brain,
  Lightbulb,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
}

export const Overview = () => {
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

  const members = [
    { name: "Jean-Stéphane B.", avatar: "/placeholder.svg", activity: "ECF rendu", status: "En ligne" },
    { name: "Thierry F.", avatar: "/placeholder.svg", activity: "Module 12 complété", status: "En ligne" },
    { name: "Isabelle L.", avatar: "/placeholder.svg", activity: "Flashcards créées", status: "Absent" },
    { name: "Elsa B.", avatar: "/placeholder.svg", activity: "QCM terminé", status: "En ligne" },
  ];

  const stats = [
    { label: "Membres actifs", value: "4", icon: Users, color: "text-accent" },
    { label: "Heures d'étude", value: "127", icon: Clock, color: "text-success" },
    { label: "Tâches terminées", value: completedTasks, icon: CheckCircle2, color: "text-primary" },
    { label: "Progression", value: `${completionPercentage}%`, icon: Target, color: "text-warning" },
  ];

  const counters = [
    { label: "Documents", value: "234", icon: FileText },
    { label: "Notes", value: "45", icon: StickyNote },
    { label: "Tâches", value: "56", icon: CheckSquare },
    { label: "Infos", value: "65", icon: Info },
    { label: "QCM", value: "56", icon: Brain },
    { label: "QUIZZ", value: "3", icon: Lightbulb },
    { label: "Flashcards", value: "4", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">Votre Kartel en chiffres : suivez vos progrès et soyez fiers de votre groupe !</p>
      </div>

      {/* Single thin horizontal statistics line */}
      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Members Carousel */}
      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>Membres du Kartel</CardTitle>
        </CardHeader>
        <CardContent>
          <Carousel className="w-full">
            <CarouselContent>
              {members.map((member, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card>
                    <CardContent className="flex flex-col items-center p-6">
                      <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">Dernière activité : {member.activity}</p>
                      <Badge variant={member.status === "En ligne" ? "default" : "secondary"}>
                        {member.status}
                      </Badge>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>

      {/* Summary Stats Banner */}
      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {counters.map((counter, index) => {
              const Icon = counter.icon;
              return (
                <div key={index} className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-accent" />
                  <span className="font-semibold">{counter.label}</span>
                  <Badge variant="secondary">{counter.value}</Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Progression du Kartel - Full Width */}
      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>Progression du Kartel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Tâches</span>
              <span className="text-sm text-success font-bold">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
          <div className="pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Échéance finale:</span>
              <span className="font-medium">15 avril 2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Jours restants:</span>
              <span className="font-medium">170 jours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activité des Membres - Full Width */}
      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>Activité des Membres</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Jean-Stéphane B.", hours: 12, questions: 8, connections: 24 },
            { name: "Thierry F.", hours: 10, questions: 6, connections: 18 },
            { name: "Isabelle L.", hours: 11, questions: 7, connections: 20 },
            { name: "Elsa B.", hours: 9, questions: 5, connections: 15 },
          ].map((member, i) => (
            <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
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
  );
};
