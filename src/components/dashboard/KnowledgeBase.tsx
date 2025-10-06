import { useState, useEffect, useRef } from "react";
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
import { FileText, Upload, Sparkles, Brain, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    
    Array.from(selectedFiles).forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('cartel_id', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-to-drive`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success(`${selectedFiles.length} fichier(s) téléversé(s) avec succès !`);
      fetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erreur lors du téléversement des fichiers");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer tous les documents ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("knowledge_base")
        .delete()
        .eq("cartel_id", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");

      if (error) throw error;

      toast.success("Tous les documents ont été supprimés");
      fetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Erreur lors de la suppression des documents");
    }
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

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={handleUploadClick}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Téléversement..." : "Téléverser"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            {files.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDeleteAll}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Tout supprimer
              </Button>
            )}
          </div>
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
