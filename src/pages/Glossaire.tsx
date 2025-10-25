import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search, BookOpen } from "lucide-react";

const Glossaire = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const glossaryItems = [
    {
      term: "Apprentissage collaboratif",
      definition: "Méthode pédagogique où les apprenants travaillent ensemble en petits groupes pour atteindre un objectif commun, favorisant l'échange de connaissances et le développement de compétences sociales."
    },
    {
      term: "Évaluation formative",
      definition: "Type d'évaluation continue qui permet de mesurer la progression de l'apprentissage et d'ajuster les méthodes pédagogiques en conséquence."
    },
    {
      term: "Flashcard",
      definition: "Outil d'apprentissage sous forme de carte recto-verso utilisé pour mémoriser des informations par répétition espacée."
    },
    {
      term: "Mind mapping",
      definition: "Technique de visualisation des idées sous forme de diagramme arborescent, facilitant la mémorisation et la compréhension des concepts."
    },
    {
      term: "Pédagogie active",
      definition: "Approche pédagogique qui place l'apprenant au centre du processus d'apprentissage, favorisant son engagement et sa participation active."
    },
    {
      term: "Quiz adaptatif",
      definition: "Type de questionnaire qui ajuste automatiquement la difficulté des questions en fonction des réponses de l'apprenant, optimisant ainsi l'apprentissage."
    },
    {
      term: "Réactivation espacée",
      definition: "Technique de révision qui consiste à revoir les connaissances à intervalles réguliers et croissants pour améliorer la mémorisation à long terme."
    },
    {
      term: "Rétroaction",
      definition: "Information donnée à l'apprenant sur sa performance, permettant d'identifier les points forts et les axes d'amélioration."
    },
    {
      term: "Scaffold pédagogique",
      definition: "Soutien temporaire fourni aux apprenants pour les aider à accomplir des tâches qu'ils ne pourraient pas réaliser seuls, progressivement retiré au fur et à mesure de leur autonomie."
    },
    {
      term: "Taxonomie de Bloom",
      definition: "Classification hiérarchique des objectifs d'apprentissage en six niveaux : connaissance, compréhension, application, analyse, synthèse et évaluation."
    },
    {
      term: "Zone proximale de développement",
      definition: "Concept de Vygotsky désignant l'espace entre ce qu'un apprenant peut faire seul et ce qu'il peut accomplir avec l'aide d'un pair ou d'un formateur."
    },
    {
      term: "Gamification",
      definition: "Utilisation d'éléments de jeu (points, badges, classements) dans un contexte d'apprentissage pour augmenter l'engagement et la motivation des apprenants."
    },
    {
      term: "Métacognition",
      definition: "Capacité à réfléchir sur ses propres processus d'apprentissage, à les comprendre et à les réguler pour améliorer son efficacité."
    },
    {
      term: "Peer-to-peer",
      definition: "Apprentissage entre pairs où les apprenants s'enseignent mutuellement, renforçant ainsi leur propre compréhension tout en aidant les autres."
    },
    {
      term: "Andragogie",
      definition: "Science et art de l'enseignement aux adultes, qui prend en compte leur expérience, leur autonomie et leur motivation intrinsèque."
    }
  ];

  const filteredItems = glossaryItems.filter(item =>
    item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Glossaire / Dictionnaire</h1>
          <p className="text-muted-foreground">Termes clés de l'apprentissage et de la pédagogie</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="text"
              placeholder="Rechercher un terme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4">
        {filteredItems.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl text-primary">{item.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{item.definition}</p>
            </CardContent>
          </Card>
        ))}
        
        {filteredItems.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucun terme trouvé pour "{searchTerm}"</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-sm text-muted-foreground text-center py-4">
        {filteredItems.length} terme{filteredItems.length > 1 ? 's' : ''} affiché{filteredItems.length > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default Glossaire;
