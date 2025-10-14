import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

const quizQuestions = [
  {
    question: "Quelle est la capitale de la France ?",
    options: ["Paris", "Lyon", "Marseille", "Toulouse"],
    correctAnswer: 0,
  },
  {
    question: "Combien font 5 × 8 ?",
    options: ["35", "40", "45", "50"],
    correctAnswer: 1,
  },
  {
    question: "Quel est le symbole chimique de l'eau ?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    correctAnswer: 1,
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    
    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleGenerateQuiz = () => {
    toast.success("Requête envoyée à l'IA pour générer un nouveau quiz !");
    // Webhook call would go here
    console.log("Webhook: webhook1.n8n.Quiz");
  };

  if (quizCompleted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Quiz adaptatif IA</h2>
          <p className="text-muted-foreground">Testez vos connaissances</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Quiz terminé !
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="text-6xl font-bold text-primary mb-4">
                {score}/{quizQuestions.length}
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                Vous avez répondu correctement à {score} question{score > 1 ? "s" : ""} sur {quizQuestions.length}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={handleReset}>Recommencer</Button>
                <Button variant="outline" onClick={handleGenerateQuiz}>
                  Générer un nouveau quiz avec l'IA
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Quiz adaptatif IA</h2>
        <p className="text-muted-foreground">Testez vos connaissances</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Question {currentQuestion + 1} / {quizQuestions.length}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-2">
            <div className="text-sm text-muted-foreground mb-2">Score actuel : {score}</div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${((currentQuestion) / quizQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">
              {quizQuestions[currentQuestion].question}
            </h3>

            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => {
                const isCorrect = index === quizQuestions[currentQuestion].correctAnswer;
                const isSelected = selectedAnswer === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => !showFeedback && handleAnswerSelect(index)}
                    disabled={showFeedback}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      !showFeedback
                        ? "border-border hover:border-primary hover:bg-accent/50 cursor-pointer"
                        : isSelected
                        ? isCorrect
                          ? "border-green-500 bg-green-500/10"
                          : "border-red-500 bg-red-500/10"
                        : isCorrect
                        ? "border-green-500 bg-green-500/10"
                        : "border-border"
                    } ${showFeedback ? "cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showFeedback && isSelected && (
                        isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )
                      )}
                      {showFeedback && !isSelected && isCorrect && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {showFeedback && (
            <div className={`p-4 rounded-lg ${
              selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                ? "bg-green-500/10 border border-green-500/20"
                : "bg-red-500/10 border border-red-500/20"
            }`}>
              <p className="font-medium">
                {selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                  ? "✓ Bonne réponse !"
                  : "✗ Mauvaise réponse"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                  ? "Continuez comme ça !"
                  : `La bonne réponse était : ${quizQuestions[currentQuestion].options[quizQuestions[currentQuestion].correctAnswer]}`}
              </p>
            </div>
          )}

          <div className="flex gap-4 justify-between">
            <Button variant="outline" onClick={handleGenerateQuiz}>
              Générer un nouveau quiz avec l'IA
            </Button>
            {showFeedback && (
              <Button onClick={handleNext}>
                {currentQuestion < quizQuestions.length - 1 ? "Question suivante" : "Voir les résultats"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
