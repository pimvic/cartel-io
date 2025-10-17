import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Archive, Star, BookOpen, Tag } from "lucide-react";

export const Notes = () => {
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">Vos notes personnelles ou de groupe, ici pour ne rien oublier !</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Notes Personnelles</TabsTrigger>
          <TabsTrigger value="kartel">Notes Kartel</TabsTrigger>
          <TabsTrigger value="glossary">
            <BookOpen className="w-4 h-4 mr-2" />
            Glossaire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher dans mes notes..." className="pl-10" />
              </div>
              <Button variant="outline">Filtrer</Button>
            </div>
            <Button className="gap-2 ml-4">
              <Plus className="w-4 h-4" />
              Nouvelle note
            </Button>
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
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" title="Favori">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Modifier">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Archiver">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
          </div>
        </TabsContent>

        <TabsContent value="kartel" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher dans les notes du Kartel..." className="pl-10" />
              </div>
              <Button variant="outline">Filtrer</Button>
            </div>
            <Button className="gap-2 ml-4">
              <Plus className="w-4 h-4" />
              Nouvelle note partagée
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Stratégie de révision collective",
                content: "Plan de révision pour l'examen final...",
                date: "Il y a 1 jour",
                author: "Marie L.",
                shared: true
              },
              {
                title: "Ressources ECF partagées",
                content: "Collection de ressources validées par le groupe...",
                date: "Il y a 3 jours",
                author: "Thomas B.",
                shared: true
              }
            ].map((note, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start justify-between">
                    <span>{note.title}</span>
                    <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">Partagée</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{note.content}</p>
                  <p className="text-xs text-muted-foreground mb-3">Par {note.author}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{note.date}</p>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" title="Favori">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Modifier">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Archiver">
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="glossary" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Rechercher un terme..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Tag className="w-4 h-4 mr-2" />
                Par catégorie
              </Button>
            </div>
            <Button className="gap-2 ml-4">
              <Plus className="w-4 h-4" />
              Ajouter un terme
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Glossaire partagé du Kartel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    term: "Scénario pédagogique",
                    definition: "Ensemble structuré d'activités d'apprentissage visant des objectifs précis.",
                    category: "Pédagogie",
                    author: "Marie L.",
                    date: "Il y a 2 jours"
                  },
                  {
                    term: "ECF",
                    definition: "Évaluation en Cours de Formation - modalité d'évaluation continue.",
                    category: "Certification",
                    author: "Thomas B.",
                    date: "Il y a 5 jours"
                  },
                  {
                    term: "Kartel",
                    definition: "Petit groupe d'apprenants (3-5 personnes) travaillant ensemble sur une plateforme collaborative.",
                    category: "Méthodologie",
                    author: "Sophie M.",
                    date: "Il y a 1 semaine"
                  }
                ].map((entry, i) => (
                  <div key={i} className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{entry.term}</h4>
                        <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">{entry.category}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" title="Modifier">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{entry.definition}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Ajouté par {entry.author}</span>
                      <span>{entry.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
