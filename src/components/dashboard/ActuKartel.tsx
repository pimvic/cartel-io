import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText, Calendar as CalendarIcon, Upload } from "lucide-react";

export const ActuKartel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">L'Actu du Kartel</h2>
        <p className="text-muted-foreground">Les dernières activités et actualités de votre groupe</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Latest Messages */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span>Derniers Messages</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Jean-Stéphane B.</p>
                <p className="text-xs text-muted-foreground">J'ai terminé le module 12 !</p>
                <p className="text-xs text-muted-foreground mt-1">Il y a 1 heure</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Thierry F.</p>
                <p className="text-xs text-muted-foreground">Quelqu'un pour une session de révision ?</p>
                <p className="text-xs text-muted-foreground mt-1">Il y a 3 heures</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-accent" />
              <span>Événements à venir</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Session de groupe</p>
                <p className="text-xs text-muted-foreground">Demain, 14h00</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Deadline Module 13</p>
                <p className="text-xs text-muted-foreground">Dans 5 jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Documents */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-accent" />
              <span>Documents récents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Cours_Module_12.pdf</p>
                <p className="text-xs text-muted-foreground">Ajouté par Isabelle L.</p>
                <p className="text-xs text-muted-foreground mt-1">Il y a 2 heures</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Synthese_generale.docx</p>
                <p className="text-xs text-muted-foreground">Ajouté par Jean-Stéphane B.</p>
                <p className="text-xs text-muted-foreground mt-1">Hier</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notes */}
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <span>Notes récentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Points clés Module 11</p>
                <p className="text-xs text-muted-foreground">Par Elsa B.</p>
                <p className="text-xs text-muted-foreground mt-1">Il y a 1 jour</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium">Questions ECF</p>
                <p className="text-xs text-muted-foreground">Par Thierry F.</p>
                <p className="text-xs text-muted-foreground mt-1">Il y a 2 jours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
