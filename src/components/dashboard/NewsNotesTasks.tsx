import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Newspaper, FileText, CheckSquare } from "lucide-react";
import { useState } from "react";

export const NewsNotesTasks = () => {
  const [newsOpen, setNewsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">News / Notes / Tâches</h2>
        <p className="text-muted-foreground">Gérez vos actualités, notes et tâches</p>
      </div>

      {/* News Banner */}
      <Collapsible open={newsOpen} onOpenChange={setNewsOpen}>
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Newspaper className="w-5 h-5 text-accent" />
                  <span>News</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${newsOpen ? "rotate-180" : ""}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-accent/5 rounded-lg">
                  <p className="text-sm font-medium">Nouvelle ressource disponible</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
                <div className="p-3 bg-accent/5 rounded-lg">
                  <p className="text-sm font-medium">Prochaine session de groupe demain</p>
                  <p className="text-xs text-muted-foreground">Il y a 5 heures</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Tasks Banner */}
      <Collapsible open={tasksOpen} onOpenChange={setTasksOpen}>
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-accent" />
                  <span>Tâches</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${tasksOpen ? "rotate-180" : ""}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-accent/5 rounded-lg flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Terminer le module 12</p>
                    <p className="text-xs text-muted-foreground">Échéance: 15 juin 2025</p>
                  </div>
                </div>
                <div className="p-3 bg-accent/5 rounded-lg flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Réviser les flashcards</p>
                    <p className="text-xs text-muted-foreground">Échéance: 10 juin 2025</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Notes Banner */}
      <Collapsible open={notesOpen} onOpenChange={setNotesOpen}>
        <Card className="relative">
          <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
          <CollapsibleTrigger className="w-full">
            <CardHeader className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  <span>Notes</span>
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${notesOpen ? "rotate-180" : ""}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-accent/5 rounded-lg">
                  <p className="text-sm font-medium">Synthèse du module 10</p>
                  <p className="text-xs text-muted-foreground">Modifié il y a 1 jour</p>
                </div>
                <div className="p-3 bg-accent/5 rounded-lg">
                  <p className="text-sm font-medium">Points clés progression pédagogique</p>
                  <p className="text-xs text-muted-foreground">Modifié il y a 3 jours</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};
