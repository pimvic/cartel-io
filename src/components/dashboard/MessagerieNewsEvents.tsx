import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Newspaper, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const MessagerieNewsEvents = () => {
  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">Gérez vos messages, consultez les news et évènements, tenez-vous à jour</p>
      </div>

      <Tabs defaultValue="messagerie" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messagerie" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Messagerie
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            News
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Évènements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messagerie" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Messagerie du groupe</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 bg-muted/30 rounded-lg p-4 overflow-y-auto space-y-3">
                  <div className="bg-background p-3 rounded-lg">
                    <p className="text-sm font-medium">Jean-Stéphane B.</p>
                    <p className="text-sm text-muted-foreground mt-1">Bonjour à tous ! Prêts pour la session d'aujourd'hui ?</p>
                    <p className="text-xs text-muted-foreground mt-2">10:30</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg ml-8">
                    <p className="text-sm font-medium">Thierry F.</p>
                    <p className="text-sm text-muted-foreground mt-1">Oui ! J'ai préparé quelques questions sur le module 12.</p>
                    <p className="text-xs text-muted-foreground mt-2">10:35</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Écrivez votre message..." />
                  <Button>Envoyer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Actualités du Kartel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">📢 Nouvelle ressource disponible</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Le document de synthèse du module 12 a été ajouté à la base de connaissances.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Il y a 2 heures</p>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">🎯 Objectif atteint</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Félicitations ! Le groupe a terminé 75% des modules prévus.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">Hier</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Évènements à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">📅 Session de groupe</p>
                  <p className="text-sm text-muted-foreground mt-2">Révision collective du module 12</p>
                  <p className="text-xs text-muted-foreground mt-2">Demain, 14h00 - 16h00</p>
                  <Button size="sm" className="mt-3">Rejoindre</Button>
                </div>
                <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                  <p className="text-sm font-medium">⏰ Deadline Module 13</p>
                  <p className="text-sm text-muted-foreground mt-2">Date limite de soumission des travaux</p>
                  <p className="text-xs text-muted-foreground mt-2">Dans 5 jours (10 juin 2025)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
