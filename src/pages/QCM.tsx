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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

const QCM = () => {
  const [subject, setSubject] = useState("");
  const [quantity, setQuantity] = useState("5");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      toast.error("Veuillez entrer un sujet");
      return;
    }

    setIsGenerating(true);
    const payload = {
      type: "quiz",
      number: parseInt(quantity),
      subject: subject,
      user: "Jean-Stéphane B.",
      cartel: "Cartel · Démo",
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch("https://webhook1.n8n.quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success(`Génération de ${quantity} questions lancée !`);
      
      // Mock questions for demo
      const mockQuestions: Question[] = Array.from({ length: parseInt(quantity) }, (_, i) => ({
        id: `${i + 1}`,
        question: `Question ${i + 1} sur ${subject}`,
        options: ["Réponse A", "Réponse B", "Réponse C", "Réponse D"],
        correctAnswer: "Réponse A",
      }));
      
      setQuestions(mockQuestions);
      setCurrentIndex(0);
      setSelectedAnswer("");
      setShowResult(false);
      setScore(0);
    } catch (error) {
      toast.error("Erreur lors de la génération");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) {
      toast.error("Veuillez sélectionner une réponse");
      return;
    }

    const isCorrect = selectedAnswer === questions[currentIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      toast.success("Bonne réponse !");
    } else {
      toast.error("Mauvaise réponse");
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    }
  };

  const isCorrect = selectedAnswer === questions[currentIndex]?.correctAnswer;
  const progress = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">QCM</h2>
        <p className="text-muted-foreground">Créez et répondez à des quiz</p>
      </div>

      {/* Generator Card */}
      <Card className="bg-accent/5">
        <CardHeader>
          <CardTitle>Générer des QCM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qcm-subject">Sujet</Label>
            <Input
              id="qcm-subject"
              placeholder="Ex: Progression pédagogique"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="qcm-quantity">Nombre de questions</Label>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger id="qcm-quantity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questions</SelectItem>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="15">15 questions</SelectItem>
                  <SelectItem value="20">20 questions</SelectItem>
                  <SelectItem value="30">30 questions</SelectItem>
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

      {/* Quiz Viewer */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Question {currentIndex + 1} sur {questions.length} • Score: {score}/{questions.length}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-success transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-accent/10 to-success/10">
            <CardHeader>
              <CardTitle>{questions[currentIndex].question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {questions[currentIndex].options.map((option, i) => (
                  <div
                    key={i}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                      showResult
                        ? option === questions[currentIndex].correctAnswer
                          ? "border-success bg-success/10"
                          : option === selectedAnswer
                          ? "border-destructive bg-destructive/10"
                          : "border-border"
                        : selectedAnswer === option
                        ? "border-accent bg-accent/10"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${i}`} disabled={showResult} />
                    <Label htmlFor={`option-${i}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                    {showResult && option === questions[currentIndex].correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    )}
                    {showResult && option === selectedAnswer && option !== questions[currentIndex].correctAnswer && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between pt-4">
                {!showResult ? (
                  <Button 
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    Valider
                  </Button>
                ) : (
                  <>
                    {currentIndex < questions.length - 1 ? (
                      <Button onClick={handleNext} className="w-full">
                        Question suivante
                      </Button>
                    ) : (
                      <div className="w-full text-center">
                        <p className="text-xl font-bold mb-2">
                          Quiz terminé ! Score: {score}/{questions.length}
                        </p>
                        <p className="text-muted-foreground">
                          {score === questions.length 
                            ? "Parfait ! 🎉" 
                            : score >= questions.length / 2 
                            ? "Bon travail ! 👍" 
                            : "Continuez à réviser 📚"}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QCM;
