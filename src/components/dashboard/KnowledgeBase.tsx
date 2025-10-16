import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Upload, Sparkles, Brain, Trash2, FileUp, Type, Link, Search, ArrowUpDown, Star, Archive, Edit, Tag, MessageSquare } from "lucide-react";
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
      const response = await fetch("https://n8n.aigentics.site/webhook/flashcards-mcqs-generation", {
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
      const response = await fetch("https://n8n.aigentics.site/webhook/flashcards-mcqs-generation", {
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
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">
          Nourrissez votre base commune, discutez avec l'IA de votre Kartel au sujet de vos documents, échéances et objectifs
        </p>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList>
          <TabsTrigger value="documents">📚 Documents</TabsTrigger>
          <TabsTrigger value="chat">💬 Chat IA</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6 mt-6">
          <div className="flex flex-col gap-4">
        
        {/* Upload and Management Controls */}
        <div className="flex flex-wrap gap-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={handleUploadClick}
            disabled={uploading}
          >
            <FileUp className="w-4 h-4 mr-2" />
            {uploading ? "Téléversement..." : "Importer des PDF"}
          </Button>
          <Button variant="outline">
            <Type className="w-4 h-4 mr-2" />
            Insérer du texte
          </Button>
          <Button variant="outline">
            <Link className="w-4 h-4 mr-2" />
            Url de page web
          </Button>
        </div>

        {/* Search, Sort, and Management Tools */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Recherche
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Trier
          </Button>
          <Button variant="outline" size="sm">
            <Star className="w-4 h-4 mr-2" />
            Favoris
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Épinglés
          </Button>
          <Button variant="outline" size="sm">
            <Tag className="w-4 h-4 mr-2" />
            Tags
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
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.open(file.file_url, '_blank')}>
                      Ouvrir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Discutez avec votre base de connaissance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-96 bg-muted/30 rounded-lg p-4 overflow-y-auto space-y-3">
                  <div className="bg-accent/10 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">Bonjour ! Je suis votre assistant IA. Posez-moi des questions sur vos documents.</p>
                  </div>
                  <div className="bg-background p-3 rounded-lg max-w-[80%] ml-auto">
                    <p className="text-sm">Peux-tu me faire un résumé du module 12 ?</p>
                  </div>
                  <div className="bg-accent/10 p-3 rounded-lg max-w-[80%]">
                    <p className="text-sm">Bien sûr ! Le module 12 couvre les méthodologies de formation pour adultes, incluant les principes de l'andragogie, les techniques d'animation, et l'évaluation des compétences.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input placeholder="Posez votre question..." />
                  <Button>Envoyer</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
