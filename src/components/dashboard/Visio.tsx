import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Users, Clock } from "lucide-react";

export const Visio = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Visio</h2>
        <p className="text-muted-foreground text-[110%]">Planifiez vos sessions de groupe, partagez vos écrans, débloquez-vous ensemble !</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              <span>Démarrer une session</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Créez une nouvelle session de visioconférence avec votre groupe
            </p>
            <Button className="w-full" size="lg">
              <Video className="w-4 h-4 mr-2" />
              Créer une session
            </Button>
          </CardContent>
        </Card>

        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span>Sessions programmées</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm font-medium">Révision Module 12</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Demain, 14h00
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    4 participants
                  </span>
                </div>
                <Button size="sm" className="mt-3 w-full">Rejoindre</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title: "Session de groupe", date: "28 mai 2025", duration: "1h30", participants: 4 },
              { title: "Révision Module 11", date: "25 mai 2025", duration: "2h00", participants: 3 },
              { title: "Questions/Réponses", date: "22 mai 2025", duration: "1h15", participants: 4 }
            ].map((session, i) => (
              <div key={i} className="p-4 bg-muted/30 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium">{session.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{session.date}</span>
                    <span>{session.duration}</span>
                    <span>{session.participants} participants</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">Détails</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
