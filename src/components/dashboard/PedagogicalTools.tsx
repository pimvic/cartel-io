import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Brain, Map, CreditCard, BarChart3, Video, MessageCircle, Lightbulb, Users, FileText, BookOpen, UserCheck, Film, Target, Puzzle, Layout, RotateCw, Bot, Trophy, ThumbsUp, PartyPopper, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PedagogicalTools = () => {
  const navigate = useNavigate();
  
  const mainTools = [
    { name: "Quiz adaptatif IA", description: "L'IA ajuste les questions selon le niveau du groupe et explique les erreurs en temps réel.", icon: Brain, color: "text-blue-500", route: "/quiz" },
    { name: "Flashcards automatiques", description: "Générez des flashcards depuis vos documents", icon: CreditCard, color: "text-green-500", route: "/flashcards" },
    { name: "Mindmap collective", description: "Créez des cartes mentales collaboratives", icon: Map, color: "text-purple-500", route: "/mindmap" },
  ];

  const tools = [
    { name: "Tableau de progression commun", description: "Suivez la progression de votre groupe", icon: BarChart3, color: "text-orange-500" },
    { name: "Jeu de rôle en visioconférence", description: "Pratiquez en situation réelle", icon: Video, color: "text-red-500" },
    { name: "Débriefing collectif guidé", description: "Analysez vos sessions ensemble", icon: MessageCircle, color: "text-cyan-500" },
    { name: "Brainstorming augmenté", description: "Idées collaboratives assistées par IA", icon: Lightbulb, color: "text-yellow-500" },
    { name: "Mini-débat structuré", description: "Débattez de manière organisée", icon: Users, color: "text-pink-500" },
    { name: "Fiche \"Savoir partagé\"", description: "Documentez vos connaissances", icon: FileText, color: "text-indigo-500" },
    { name: "Journal d'apprentissage de groupe", description: "Suivez votre progression commune", icon: BookOpen, color: "text-teal-500" },
    { name: "Évaluation pair-à-pair", description: "Évaluez-vous mutuellement", icon: UserCheck, color: "text-lime-500" },
    { name: "Capsule vidéo interactive", description: "Créez des vidéos pédagogiques", icon: Film, color: "text-amber-500" },
    { name: "Mission collective", description: "Objectifs communs à atteindre", icon: Target, color: "text-rose-500" },
    { name: "Atelier \"compétence croisée\"", description: "Partagez vos compétences", icon: Puzzle, color: "text-violet-500" },
    { name: "Mur d'idées en direct", description: "Partagez vos idées en temps réel", icon: Layout, color: "text-sky-500" },
    { name: "Roue de remobilisation", description: "Restez motivés ensemble", icon: RotateCw, color: "text-emerald-500" },
    { name: "Pod IA de synthèse", description: "Synthèses automatiques par IA", icon: Bot, color: "text-fuchsia-500" },
    { name: "Challenge collaboratif", description: "Relevez des défis en équipe", icon: Trophy, color: "text-yellow-600" },
    { name: "Feedback instantané IA + groupe", description: "Retours immédiats et collectifs", icon: ThumbsUp, color: "text-blue-600" },
    { name: "Célébration des étapes", description: "Fêtez vos réussites ensemble", icon: PartyPopper, color: "text-pink-600" },
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
          <CardTitle>Outils principaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {mainTools.map((tool, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all cursor-pointer relative group"
                onClick={() => navigate(tool.route)}
              >
                <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Accéder
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Autres outils</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative">
                <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
            </div>
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
