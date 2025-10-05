import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Upload, Sparkles, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import useDrivePicker from "react-google-drive-picker";

const GOOGLE_CLIENT_ID = "n8n-qdrant-rag@gen-lang-client-0168505460.iam.gserviceaccount.com";
const GOOGLE_DEVELOPER_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.3OQWpXwRrkhH3WCKzVtDkPjWPn0lMILcNwykxIfjToQ";
const GOOGLE_DRIVE_FOLDER_ID = "1xEMe4CimH_3DQ1JM6vzvo1xQsuNMnRoS"; // Optionnel

interface KBFile {
  id: string;
  title: string;
  file_url: string;
  uploaded_at: string;
}

export const KnowledgeBase = () => {
  const [files, setFiles] = useState<KBFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [flashcardCount, setFlashcardCount] = useState(10);
  const [quizCount, setQuizCount] = useState(5);
  const [flashcardDialogOpen, setFlashcardDialogOpen] = useState(false);
  const [quizDialogOpen, setQuizDialogOpen] = useState(false);
  const [openPicker] = useDrivePicker();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .eq("cartel_id", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
      .order("uploaded_at", { ascending: false });

    if (data) {
      setFiles(data);
    }
    setLoading(false);
  };

  const handleCreateFlashcards = async () => {
    const payload = {
      type: "flashcards",
      number: flashcardCount,
      user: "Jean-Stéphane B.",
      cartel: "Cartel · Démo",
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("https://n8n.aigentics.site/webhook-test/flashcards-mcqs-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success(`Génération de ${flashcardCount} flashcards lancée !`);
      setFlashcardDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la création des flashcards");
    }
  };

  const handleCreateQuiz = async () => {
    const payload = {
      type: "quiz",
      number: quizCount,
      user: "Jean-Stéphane B.",
      cartel: "Cartel · Démo",
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch("https://n8n.aigentics.site/webhook-test/flashcards-mcqs-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      toast.success(`Génération de ${quizCount} questions de quiz lancée !`);
      setQuizDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la création du quiz");
    }
  };

  const handleUploadClick = () => {
    openPicker({
      clientId: GOOGLE_CLIENT_ID,
      developerKey: GOOGLE_DEVELOPER_KEY,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      customScopes: ['https://www.googleapis.com/auth/drive.file'],
      callbackFunction: async (data) => {
        if (data.action === 'picked') {
          const uploadedFiles = data.docs;
          
          try {
            // Enregistrer chaque fichier dans Supabase
            const insertPromises = uploadedFiles.map((file: any) => 
              supabase
                .from('knowledge_base')
                .insert({
                  cartel_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
                  title: file.name,
                  file_url: file.url || `https://drive.google.com/file/d/${file.id}/view`,
                })
            );

            await Promise.all(insertPromises);
            
            toast.success(`${uploadedFiles.length} fichier(s) téléversé(s) avec succès !`);
            
            // Rafraîchir la liste des fichiers
            fetchFiles();
          } catch (error) {
            toast.error("Erreur lors de l'enregistrement des fichiers");
            console.error(error);
          }
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">Base de connaissances</h2>
          <p className="text-muted-foreground">Gérez vos documents et générez du contenu pédagogique</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Dialog open={flashcardDialogOpen} onOpenChange={setFlashcardDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-success hover:bg-success/90 text-success-foreground">
                <Sparkles className="w-4 h-4 mr-2" />
                Créer des Flashcards
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer des Flashcards</DialogTitle>
                <DialogDescription>
                  Générez automatiquement des flashcards à partir de vos documents
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="flashcard-count">Nombre de flashcards</Label>
                  <Input
                    id="flashcard-count"
                    type="number"
                    min="1"
                    max="50"
                    value={flashcardCount}
                    onChange={(e) => setFlashcardCount(parseInt(e.target.value))}
                  />
                </div>
                <Button onClick={handleCreateFlashcards} className="w-full">
                  Générer
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={quizDialogOpen} onOpenChange={setQuizDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Brain className="w-4 h-4 mr-2" />
                Créer des QCM
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un Quiz</DialogTitle>
                <DialogDescription>
                  Générez automatiquement un quiz à partir de vos documents
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="quiz-count">Nombre de questions</Label>
                  <Input
                    id="quiz-count"
                    type="number"
                    min="1"
                    max="30"
                    value={quizCount}
                    onChange={(e) => setQuizCount(parseInt(e.target.value))}
                  />
                </div>
                <Button onClick={handleCreateQuiz} className="w-full">
                  Générer
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="w-4 h-4 mr-2" />
            Téléverser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement...</p>
          ) : files.length === 0 ? (
            <p className="text-muted-foreground">Aucun document pour le moment</p>
          ) : (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <FileText className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Ajouté le {new Date(file.uploaded_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.open(file.file_url, '_blank')}
                  >
                    Ouvrir
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
