import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Settings = () => {
  const [kartelName, setKartelName] = useState("Formateur Professionnel d'Adultes (FPA)");
  const [coordinator, setCoordinator] = useState("Jean-Stéphane B.");
  const [deadline, setDeadline] = useState("2026-04-15");

  const handleSave = () => {
    toast.success("Paramètres enregistrés");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Paramètres</h2>
        <p className="text-muted-foreground text-[110%]">Configurez les éléments clés de votre Kartel : vérifiez-les régulièrement.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="display">Affichage</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Kartel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kartel-name">Nom du Kartel</Label>
                <Input
                  id="kartel-name"
                  value={kartelName}
                  onChange={(e) => setKartelName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="coordinator">Coordinateur</Label>
                <Input
                  id="coordinator"
                  value={coordinator}
                  onChange={(e) => setCoordinator(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Date limite</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <Button onClick={handleSave}>Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des membres</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fonctionnalité à venir</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Options d'affichage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Fonctionnalité à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
