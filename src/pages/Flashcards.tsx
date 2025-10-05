import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, RotateCw } from "lucide-react";
import { toast } from "sonner";

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const Flashcards = () => {
  const [subject, setSubject] = useState("");
  const [quantity, setQuantity] = useState("10");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast.error("Veuillez entrer un sujet");
      return;
    }

    setIsGenerating(true);
    const payload = {
      type: "flashcards",
      number: parseInt(quantity),
      subject: subject,
      user: "Jean-Stéphane B.",
      cartel: "Cartel · Démo",
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch("https://webhook2.n8n.flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success(`Génération de ${quantity} flashcards lancée !`);
      
      // Mock flashcards for demo
      const mockFlashcards: Flashcard[] = Array.from({ length: parseInt(quantity) }, (_, i) => ({
        id: `${i + 1}`,
        question: `Question ${i + 1} sur ${subject}`,
        answer: `Réponse ${i + 1} pour ${subject}`,
      }));
      
      setFlashcards(mockFlashcards);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Flashcards</h2>
        <p className="text-muted-foreground">Créez et révisez vos flashcards</p>
      </div>

      {/* Generator Card */}
      <Card className="bg-accent/5">
        <CardHeader>
          <CardTitle>Générer des Flashcards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Sujet</Label>
            <Input
              id="subject"
              placeholder="Ex: Scénario pédagogique"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="quantity">Nombre de flashcards</Label>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger id="quantity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 flashcards</SelectItem>
                  <SelectItem value="10">10 flashcards</SelectItem>
                  <SelectItem value="15">15 flashcards</SelectItem>
                  <SelectItem value="20">20 flashcards</SelectItem>
                  <SelectItem value="30">30 flashcards</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="bg-success hover:bg-success/90"
            >
              {isGenerating ? "Génération..." : "Générer"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flashcard Viewer */}
      {flashcards.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Carte {currentIndex + 1} sur {flashcards.length}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <RotateCw className="w-4 h-4 mr-2" />
              Retourner
            </Button>
          </div>

          <Card 
            className="min-h-[300px] cursor-pointer hover-lift bg-gradient-to-br from-accent/10 to-success/10"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CardContent className="flex items-center justify-center h-[300px] p-8">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  {isFlipped ? "Réponse" : "Question"}
                </p>
                <p className="text-2xl font-medium">
                  {isFlipped 
                    ? flashcards[currentIndex].answer 
                    : flashcards[currentIndex].question}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevCard}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Précédent
            </Button>
            <Button
              variant="outline"
              onClick={nextCard}
              disabled={currentIndex === flashcards.length - 1}
            >
              Suivant
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
