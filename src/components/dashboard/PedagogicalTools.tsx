import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const PedagogicalTools = () => {
  const tools = [
    {
      name: "Quiz adaptatif IA",
      description: "L'IA ajuste les questions selon le niveau du groupe et explique les erreurs en temps réel.",
    },
    { name: "Mindmap collective", description: "Créez des cartes mentales collaboratives." },
    { name: "Flashcards automatiques", description: "Génération automatique depuis vos documents." },
    { name: "Tableau de progression commun", description: "Suivez la progression collective." },
    { name: "Jeu de rôle en visioconférence", description: "Simulations interactives en groupe." },
    { name: "Débriefing collectif guidé", description: "Sessions de réflexion structurées." },
    { name: "Brainstorming augmenté", description: "Brainstorming assisté par IA." },
    { name: "Mini-débat structuré", description: "Débats organisés sur des thèmes." },
    { name: "Fiche \"Savoir partagé\"", description: "Synthèses collaboratives de connaissances." },
    { name: "Journal d'apprentissage de groupe", description: "Documentation du parcours collectif." },
    { name: "Évaluation pair-à-pair", description: "Évaluations entre membres du Kartel." },
    { name: "Capsule vidéo interactive", description: "Création de contenus vidéo enrichis." },
    { name: "Mission collective", description: "Projets communs avec objectifs." },
    { name: "Atelier \"compétence croisée\"", description: "Partage de compétences complémentaires." },
    { name: "Mur d'idées en direct", description: "Tableau d'idées collaboratif temps réel." },
    { name: "Roue de remobilisation", description: "Activités pour relancer la motivation." },
    { name: "Pod IA de synthèse", description: "Synthèses automatiques par IA." },
    { name: "Challenge collaboratif", description: "Défis collectifs stimulants." },
    { name: "Feedback instantané IA + groupe", description: "Retours combinés humains et IA." },
    { name: "Célébration des étapes", description: "Reconnaissance des progrès collectifs." },
  ];

  const externalServices = [
    { name: "OpenAI Study & Learn", url: "https://openai.com" },
    { name: "Google NotebookLM", url: "https://notebooklm.google.com" },
    { name: "GPTs spécialisés", url: "https://chat.openai.com/gpts" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Outils pédagogiques</h2>
        <p className="text-muted-foreground">Boîte à outils pour votre apprentissage</p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>Outils disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
              >
                <h4 className="font-semibold mb-1">{tool.name}</h4>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services externes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {externalServices.map((service, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(service.url, "_blank")}
              >
                {service.name}
                <ExternalLink className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
