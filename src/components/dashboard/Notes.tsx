import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

export const Notes = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-muted-foreground text-[110%]">Vos notes personnelles ou de groupe, ici pour ne rien oublier !</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle note
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Rechercher dans les notes..." className="pl-10" />
        </div>
        <Button variant="outline">Filtrer</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Synthèse Module 10",
            content: "Points clés : méthodologie de formation, outils pédagogiques, évaluation...",
            date: "Il y a 1 jour",
            shared: false
          },
          {
            title: "Questions ECF",
            content: "Liste des questions importantes pour l'examen final...",
            date: "Il y a 2 jours",
            shared: true
          },
          {
            title: "Ressources utiles",
            content: "Collection de liens et documents pour approfondir...",
            date: "Il y a 3 jours",
            shared: false
          },
          {
            title: "Notes de réunion",
            content: "Compte-rendu de la session du 28 mai...",
            date: "Il y a 5 jours",
            shared: true
          }
        ].map((note, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-start justify-between">
                <span>{note.title}</span>
                {note.shared && (
                  <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Partagée</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{note.content}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{note.date}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
