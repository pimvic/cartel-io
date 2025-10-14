import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface MindmapNode {
  id: string;
  label: string;
  children?: MindmapNode[];
  expanded?: boolean;
}

const initialMindmap: MindmapNode = {
  id: "root",
  label: "Intelligence Artificielle",
  expanded: true,
  children: [
    {
      id: "ml",
      label: "Machine Learning",
      expanded: true,
      children: [
        { id: "supervised", label: "Apprentissage supervisé" },
        { id: "unsupervised", label: "Apprentissage non supervisé" },
        { id: "reinforcement", label: "Apprentissage par renforcement" },
      ],
    },
    {
      id: "dl",
      label: "Deep Learning",
      expanded: false,
      children: [
        { id: "cnn", label: "Réseaux de neurones convolutifs (CNN)" },
        { id: "rnn", label: "Réseaux de neurones récurrents (RNN)" },
        { id: "transformer", label: "Transformers" },
      ],
    },
    {
      id: "nlp",
      label: "Traitement du Langage Naturel",
      expanded: false,
      children: [
        { id: "tokenization", label: "Tokenisation" },
        { id: "sentiment", label: "Analyse de sentiment" },
        { id: "translation", label: "Traduction automatique" },
      ],
    },
    {
      id: "cv",
      label: "Vision par Ordinateur",
      expanded: false,
      children: [
        { id: "detection", label: "Détection d'objets" },
        { id: "segmentation", label: "Segmentation d'image" },
        { id: "recognition", label: "Reconnaissance faciale" },
      ],
    },
  ],
};

export default function Mindmap() {
  const [mindmap, setMindmap] = useState<MindmapNode>(initialMindmap);

  const toggleNode = (nodeId: string, currentNode: MindmapNode = mindmap): MindmapNode => {
    if (currentNode.id === nodeId) {
      return { ...currentNode, expanded: !currentNode.expanded };
    }

    if (currentNode.children) {
      return {
        ...currentNode,
        children: currentNode.children.map((child) => toggleNode(nodeId, child)),
      };
    }

    return currentNode;
  };

  const handleToggle = (nodeId: string) => {
    setMindmap(toggleNode(nodeId));
  };

  const handleGenerateMindmap = () => {
    toast.success("Requête envoyée à l'IA pour générer une mindmap !");
    // Webhook call would go here
    console.log("Webhook: webhook1.n8n.Mindmap");
  };

  const renderNode = (node: MindmapNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = node.expanded;

    const colors = [
      "border-primary bg-primary/10",
      "border-accent bg-accent/10",
      "border-secondary bg-secondary/10",
      "border-muted bg-muted/50",
    ];

    const colorClass = colors[level % colors.length];

    return (
      <div key={node.id} className="space-y-2">
        <div
          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all hover:shadow-md ${colorClass} ${
            hasChildren ? "cursor-pointer" : ""
          }`}
          onClick={() => hasChildren && handleToggle(node.id)}
        >
          {hasChildren && (
            <span className="text-foreground">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </span>
          )}
          <span className={`font-medium ${level === 0 ? "text-lg" : "text-sm"}`}>
            {node.label}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className={`ml-6 space-y-2 border-l-2 border-border pl-4`}>
            {node.children!.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Mindmap collective</h2>
        <p className="text-muted-foreground">Explorez et organisez vos idées visuellement</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Map className="w-6 h-6 text-primary" />
              Carte mentale interactive
            </span>
            <Button onClick={handleGenerateMindmap}>
              Générer avec l'IA
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-card p-6 rounded-lg border">
            {renderNode(mindmap)}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Astuce :</strong> Cliquez sur un nœud pour l'étendre ou le réduire. Les mindmaps peuvent être générées automatiquement par l'IA à partir de vos documents de la base de connaissances.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Légende</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary bg-primary/10 rounded" />
              <span className="text-sm">Niveau 1 - Concept principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-accent bg-accent/10 rounded" />
              <span className="text-sm">Niveau 2 - Catégorie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-secondary bg-secondary/10 rounded" />
              <span className="text-sm">Niveau 3 - Sous-catégorie</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-muted bg-muted/50 rounded" />
              <span className="text-sm">Niveau 4+ - Détails</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
