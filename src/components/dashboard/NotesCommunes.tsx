import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Plus, Trash2, Archive, Star, Search, Tag } from "lucide-react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  pinned: boolean;
  favorite: boolean;
  archived: boolean;
  created_at: string;
}

export const NotesCommunes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" });

  const handleCreateNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(",").map(t => t.trim()).filter(Boolean),
      pinned: false,
      favorite: false,
      archived: false,
      created_at: new Date().toISOString(),
    };
    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", tags: "" });
    setDialogOpen(false);
    toast.success("Note créée avec succès");
  };

  const togglePin = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const toggleFavorite = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, favorite: !n.favorite } : n));
  };

  const archiveNote = (id: string) => {
    setNotes(notes.map(n => n.id === id ? { ...n, archived: true } : n));
    toast.success("Note archivée");
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    toast.success("Note supprimée");
  };

  const filteredNotes = notes
    .filter(n => !n.archived)
    .filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Notes communes</h2>
          <p className="text-muted-foreground">Partagez vos notes avec les membres du Kartel</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-success hover:bg-success/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une note commune</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Titre de la note"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <Textarea
                placeholder="Contenu de la note"
                rows={6}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
              <Input
                placeholder="Tags (séparés par des virgules)"
                value={newNote.tags}
                onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
              />
              <Button onClick={handleCreateNote} className="w-full">
                Créer la note
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les notes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredNotes.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune note pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map((note) => (
            <Card key={note.id} className="relative">
              <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {note.pinned && <span className="text-accent">📌</span>}
                      {note.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(note.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(note.id)}
                    >
                      <Star className={`w-4 h-4 ${note.favorite ? "fill-accent text-accent" : ""}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePin(note.id)}
                    >
                      📌
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => archiveNote(note.id)}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {note.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
