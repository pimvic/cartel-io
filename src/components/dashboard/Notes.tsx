import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Archive, Star, BookOpen, Filter, Copy, Share2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NoteEditor } from './notes/NoteEditor';
import { FilterPanel } from './notes/FilterPanel';
import { GlossaryEditor } from './notes/GlossaryEditor';
import { formatDistanceToNow } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

interface Note {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  visibility: 'personal' | 'agora';
  tags: string[];
  favorited_by: string[];
  archived: boolean;
  user_id: string;
  cartel_id: string;
  created_at: string;
  updated_at: string;
}

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export const Notes = () => {
  const { lang } = useParams<{ lang: string }>();
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [glossaryTerms, setGlossaryTerms] = useState<GlossaryTerm[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentCartel, setCurrentCartel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [glossaryEditorOpen, setGlossaryEditorOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | undefined>();
  const [filters, setFilters] = useState({
    favorites: false,
    shared: false,
    archived: false,
    tags: [] as string[],
  });

  useEffect(() => {
    fetchCurrentUser();
    
    // Remember last tab
    const savedTab = localStorage.getItem('notes-active-tab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    if (currentUser && currentCartel) {
      fetchNotes();
      fetchGlossaryTerms();
      subscribeToNotes();
      subscribeToGlossary();
    }
  }, [currentUser, currentCartel]);

  useEffect(() => {
    localStorage.setItem('notes-active-tab', activeTab);
  }, [activeTab]);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*, memberships(cartel_id)')
        .eq('auth_user_id', user.id)
        .single();
      
      if (userData) {
        setCurrentUser(userData);
        if (userData.memberships?.[0]) {
          setCurrentCartel(userData.memberships[0].cartel_id);
        }
      }
    }
  };

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('cartel_id', currentCartel!)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
      return;
    }

    setNotes((data || []) as Note[]);
  };

  const fetchGlossaryTerms = async () => {
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .eq('cartel_id', currentCartel!)
      .order('term', { ascending: true });

    if (error) {
      console.error('Error fetching glossary:', error);
      return;
    }

    setGlossaryTerms(data || []);
  };

  const subscribeToNotes = () => {
    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes',
          filter: `cartel_id=eq.${currentCartel}`,
        },
        () => fetchNotes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToGlossary = () => {
    const channel = supabase
      .channel('glossary-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'glossary_terms',
          filter: `cartel_id=eq.${currentCartel}`,
        },
        () => fetchGlossaryTerms()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSaveNote = async (noteData: {
    title: string;
    content: string;
    visibility: 'personal' | 'agora';
    tags: string[];
  }) => {
    const excerpt = noteData.content.slice(0, 150);

    if (editingNote) {
      const { error } = await supabase
        .from('notes')
        .update({
          ...noteData,
          excerpt,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingNote.id);

      if (error) {
        toast({ 
          title: lang === 'fr' ? 'Erreur' : 'Error', 
          description: error.message, 
          variant: 'destructive' 
        });
        return;
      }

      toast({ title: lang === 'fr' ? 'Note mise à jour' : 'Note updated' });
    } else {
      const { error } = await supabase
        .from('notes')
        .insert({
          ...noteData,
          excerpt,
          user_id: currentUser.id,
          cartel_id: currentCartel!,
        });

      if (error) {
        toast({ 
          title: lang === 'fr' ? 'Erreur' : 'Error', 
          description: error.message, 
          variant: 'destructive' 
        });
        return;
      }

      toast({ title: lang === 'fr' ? 'Note créée' : 'Note created' });
    }

    setEditorOpen(false);
    setEditingNote(undefined);
    fetchNotes();
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm(lang === 'fr' ? 'Êtes-vous sûr de vouloir supprimer cette note ?' : 'Are you sure you want to delete this note?')) return;

    const { error } = await supabase.from('notes').delete().eq('id', id);

    if (error) {
      toast({ 
        title: lang === 'fr' ? 'Erreur' : 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
      return;
    }

    toast({ title: lang === 'fr' ? 'Note supprimée' : 'Note deleted' });
    fetchNotes();
  };

  const handleToggleFavorite = async (note: Note) => {
    const isFavorited = note.favorited_by.includes(currentUser.id);
    const newFavorites = isFavorited
      ? note.favorited_by.filter(id => id !== currentUser.id)
      : [...note.favorited_by, currentUser.id];

    const { error } = await supabase
      .from('notes')
      .update({ favorited_by: newFavorites })
      .eq('id', note.id);

    if (error) {
      toast({ 
        title: lang === 'fr' ? 'Erreur' : 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
      return;
    }

    fetchNotes();
  };

  const handleArchiveNote = async (note: Note) => {
    const { error } = await supabase
      .from('notes')
      .update({ archived: !note.archived })
      .eq('id', note.id);

    if (error) {
      toast({ 
        title: lang === 'fr' ? 'Erreur' : 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
      return;
    }

    toast({ 
      title: note.archived 
        ? (lang === 'fr' ? 'Note désarchivée' : 'Note unarchived')
        : (lang === 'fr' ? 'Note archivée' : 'Note archived')
    });
    fetchNotes();
  };

  const handleDuplicateNote = async (note: Note) => {
    const { error } = await supabase.from('notes').insert({
      title: `${note.title} (copie)`,
      content: note.content,
      excerpt: note.excerpt,
      visibility: 'personal',
      tags: note.tags,
      user_id: currentUser.id,
      cartel_id: currentCartel!,
    });

    if (error) {
      toast({ 
        title: lang === 'fr' ? 'Erreur' : 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
      return;
    }

    toast({ title: lang === 'fr' ? 'Note dupliquée' : 'Note duplicated' });
    fetchNotes();
  };

  const handleSaveGlossaryTerm = async (termData: {
    term: string;
    definition: string;
    category: string;
  }) => {
    if (editingTerm) {
      const { error } = await supabase
        .from('glossary_terms')
        .update(termData)
        .eq('id', editingTerm.id);

      if (error) {
        toast({ 
          title: lang === 'fr' ? 'Erreur' : 'Error', 
          description: error.message, 
          variant: 'destructive' 
        });
        return;
      }

      toast({ title: lang === 'fr' ? 'Terme mis à jour' : 'Term updated' });
    } else {
      const { error } = await supabase
        .from('glossary_terms')
        .insert({
          ...termData,
          author_id: currentUser.id,
          cartel_id: currentCartel!,
        });

      if (error) {
        toast({ 
          title: lang === 'fr' ? 'Erreur' : 'Error', 
          description: error.message, 
          variant: 'destructive' 
        });
        return;
      }

      toast({ title: lang === 'fr' ? 'Terme créé' : 'Term created' });
    }

    setGlossaryEditorOpen(false);
    setEditingTerm(undefined);
    fetchGlossaryTerms();
  };

  const handleDeleteGlossaryTerm = async (id: string) => {
    if (!confirm(lang === 'fr' ? 'Êtes-vous sûr de vouloir supprimer ce terme ?' : 'Are you sure you want to delete this term?')) return;

    const { error } = await supabase.from('glossary_terms').delete().eq('id', id);

    if (error) {
      toast({ 
        title: lang === 'fr' ? 'Erreur' : 'Error', 
        description: error.message, 
        variant: 'destructive' 
      });
      return;
    }

    toast({ title: lang === 'fr' ? 'Terme supprimé' : 'Term deleted' });
    fetchGlossaryTerms();
  };

  const filterNotes = (notesList: Note[], visibility: 'personal' | 'agora') => {
    return notesList.filter((note) => {
      if (note.visibility !== visibility) return false;
      if (!filters.archived && note.archived) return false;
      if (filters.archived && !note.archived) return false;
      if (filters.favorites && !note.favorited_by.includes(currentUser?.id)) return false;
      if (filters.shared && visibility !== 'agora') return false;
      if (filters.tags.length > 0 && !filters.tags.some(tag => note.tags.includes(tag))) return false;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  };

  const filterGlossary = (terms: GlossaryTerm[]) => {
    if (!searchQuery) return terms;
    
    const query = searchQuery.toLowerCase();
    return terms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query) ||
        term.category.toLowerCase().includes(query)
    );
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  };

  const formatDate = (date: string) => {
    const locale = lang === 'fr' ? fr : enUS;
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale });
  };

  const renderNoteCard = (note: Note) => {
    const isFavorited = note.favorited_by.includes(currentUser?.id);
    
    return (
      <Card key={note.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-start justify-between gap-2">
            <span className="flex-1">{note.title}</span>
            <div className="flex gap-1 flex-wrap">
              {note.visibility === 'agora' && (
                <Badge variant="secondary">{lang === 'fr' ? 'Partagé' : 'Shared'}</Badge>
              )}
              {isFavorited && (
                <Badge variant="default">{lang === 'fr' ? 'Favori' : 'Favorite'}</Badge>
              )}
              {note.archived && (
                <Badge variant="outline">{lang === 'fr' ? 'Archivé' : 'Archived'}</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-3">{note.excerpt}</p>
          
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{formatDate(note.updated_at)}</p>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={isFavorited ? 'default' : 'ghost'}
                title={lang === 'fr' ? 'Favori' : 'Favorite'}
                onClick={() => handleToggleFavorite(note)}
              >
                <Star className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title={lang === 'fr' ? 'Dupliquer' : 'Duplicate'}
                onClick={() => handleDuplicateNote(note)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title={lang === 'fr' ? 'Modifier' : 'Edit'}
                onClick={() => {
                  setEditingNote(note);
                  setEditorOpen(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title={note.archived 
                  ? (lang === 'fr' ? 'Désarchiver' : 'Unarchive')
                  : (lang === 'fr' ? 'Archiver' : 'Archive')
                }
                onClick={() => handleArchiveNote(note)}
              >
                <Archive className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                onClick={() => handleDeleteNote(note.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const personalNotes = filterNotes(notes, 'personal');
  const kartelNotes = filterNotes(notes, 'kartel');
  const filteredGlossary = filterGlossary(glossaryTerms);

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">
          {lang === 'fr' ? 'Gérez vos notes personnelles et partagées' : 'Manage your personal and shared notes'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">
            {lang === 'fr' ? 'Personnel' : 'Personal'} ({personalNotes.length})
          </TabsTrigger>
          <TabsTrigger value="kartel">
            {lang === 'fr' ? 'Kartel' : 'Kartel'} ({kartelNotes.length})
          </TabsTrigger>
          <TabsTrigger value="glossary">
            <BookOpen className="w-4 h-4 mr-2" />
            {lang === 'fr' ? 'Glossaire' : 'Glossary'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={lang === 'fr' ? 'Rechercher des notes...' : 'Search notes...'}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setFilterOpen(true)}>
                <Filter className="w-4 h-4 mr-2" />
                {lang === 'fr' ? 'Filtrer' : 'Filter'}
              </Button>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingNote(undefined);
                setEditorOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              {lang === 'fr' ? 'Nouvelle note' : 'New Note'}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalNotes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {lang === 'fr' ? 'Aucune note personnelle' : 'No personal notes'}
                </p>
              </div>
            ) : (
              personalNotes.map(renderNoteCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="kartel" className="space-y-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder={lang === 'fr' ? 'Rechercher des notes...' : 'Search notes...'}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setFilterOpen(true)}>
                <Filter className="w-4 h-4 mr-2" />
                {lang === 'fr' ? 'Filtrer' : 'Filter'}
              </Button>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingNote(undefined);
                setEditorOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              {lang === 'fr' ? 'Nouvelle note partagée' : 'New Shared Note'}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kartelNotes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">
                  {lang === 'fr' ? 'Aucune note partagée' : 'No shared notes'}
                </p>
              </div>
            ) : (
              kartelNotes.map(renderNoteCard)
            )}
          </div>
        </TabsContent>

        <TabsContent value="glossary" className="space-y-6 mt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={lang === 'fr' ? 'Rechercher un terme...' : 'Search term...'}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setEditingTerm(undefined);
                setGlossaryEditorOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />
              {lang === 'fr' ? 'Ajouter un terme' : 'Add Term'}
            </Button>
          </div>

          <div className="space-y-4">
            {filteredGlossary.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {lang === 'fr' ? 'Aucun terme dans le glossaire' : 'No terms in glossary'}
                </p>
              </div>
            ) : (
              filteredGlossary.map((term) => (
                <Card key={term.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{term.term}</CardTitle>
                        <Badge variant="secondary">{term.category}</Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          title={lang === 'fr' ? 'Modifier' : 'Edit'}
                          onClick={() => {
                            setEditingTerm(term);
                            setGlossaryEditorOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title={lang === 'fr' ? 'Supprimer' : 'Delete'}
                          onClick={() => handleDeleteGlossaryTerm(term.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{term.definition}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(term.created_at)}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      <NoteEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        note={editingNote}
        onSave={handleSaveNote}
      />

      <FilterPanel
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        availableTags={getAllTags()}
        onFiltersChange={setFilters}
      />

      <GlossaryEditor
        open={glossaryEditorOpen}
        onOpenChange={setGlossaryEditorOpen}
        term={editingTerm}
        onSave={handleSaveGlossaryTerm}
      />
    </div>
  );
};
