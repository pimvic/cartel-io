import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Plus, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

const initialFlashcards: Flashcard[] = [
  {
    id: 1,
    question: "Qu'est-ce que la photosynthèse ?",
    answer: "La photosynthèse est le processus par lequel les plantes vertes utilisent la lumière du soleil pour convertir le dioxyde de carbone et l'eau en glucose et oxygène.",
  },
  {
    id: 2,
    question: "Quelle est la formule de la force ?",
    answer: "F = m × a (Force = masse × accélération)",
  },
  {
    id: 3,
    question: "Qui a écrit 'Les Misérables' ?",
    answer: "Victor Hugo",
  },
];

export default function Flashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleAddFlashcard = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast.error("Veuillez remplir la question et la réponse");
      return;
    }

    const newFlashcard: Flashcard = {
      id: flashcards.length + 1,
      question: newQuestion,
      answer: newAnswer,
    };

    setFlashcards([...flashcards, newFlashcard]);
    setNewQuestion("");
    setNewAnswer("");
    setShowAddForm(false);
    toast.success("Flashcard ajoutée !");
  };

  const handleGenerateFlashcards = () => {
    toast.success("Requête envoyée à l'IA pour générer des flashcards !");
    // Webhook call would go here
    console.log("Webhook: webhook1.n8n.Flashcards");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Flashcards automatiques</h2>
        <p className="text-muted-foreground">Mémorisez efficacement avec des cartes interactives</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Carte {currentIndex + 1} / {flashcards.length}
                </span>
                <Button variant="ghost" size="icon" onClick={handleFlip}>
                  <RotateCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="relative h-64 cursor-pointer perspective-1000"
                onClick={handleFlip}
              >
                <div 
                  className={`w-full h-full transition-transform duration-500 preserve-3d ${
                    isFlipped ? "rotate-y-180" : ""
                  }`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div 
                    className={`absolute inset-0 backface-hidden flex items-center justify-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20 ${
                      !isFlipped ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-lg font-medium text-center">
                      {flashcards[currentIndex].question}
                    </p>
                  </div>
                  <div 
                    className={`absolute inset-0 backface-hidden flex items-center justify-center p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg border-2 border-accent/20 ${
                      isFlipped ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-base text-center">
                      {flashcards[currentIndex].answer}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-between mt-4">
                <Button variant="outline" onClick={handlePrevious}>
                  Précédente
                </Button>
                <Button onClick={handleNext}>
                  Suivante
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une flashcard
            </Button>
            <Button onClick={handleGenerateFlashcards}>
              Générer avec l'IA
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {showAddForm ? "Nouvelle flashcard" : "Toutes les flashcards"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showAddForm ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Question</label>
                  <Input
                    placeholder="Entrez la question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Réponse</label>
                  <Textarea
                    placeholder="Entrez la réponse..."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddFlashcard}>
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {flashcards.map((card, index) => (
                  <div
                    key={card.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      index === currentIndex
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border hover:bg-accent/50"
                    }`}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsFlipped(false);
                    }}
                  >
                    <p className="font-medium text-sm">{card.question}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
