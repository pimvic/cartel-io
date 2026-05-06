import { useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface RequestFormProps {
  cartelId: string;
  userId: string;
  onSuccess: () => void;
}

const TAGS = [
  "methodo",
  "ressource",
  "blocage",
  "motivation",
  "organisation"
];

export const RequestForm = ({ cartelId, userId, onSuccess }: RequestFormProps) => {
  const { lang } = useParams<{ lang: string }>();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [dueDate, setDueDate] = useState<Date>();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(f => {
      if (f.size > 25 * 1024 * 1024) {
        toast.error(lang === 'fr' ? `Fichier trop volumineux: ${f.name}` : `File too large: ${f.name}`);
        return false;
      }
      return true;
    });
    
    if (attachments.length + validFiles.length > 10) {
      toast.error(lang === 'fr' ? 'Trop de fichiers (max 10)' : 'Too many files (max 10)');
      return;
    }
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedTags.length === 0) {
      toast.error(lang === 'fr' ? 'Veuillez sélectionner au moins un tag' : 'Please select at least one tag');
      return;
    }

    setLoading(true);
    
    try {
      const attachmentUrls = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      );

      const { error } = await supabase
        .from('plus_one_requests')
        .insert({
          cartel_id: cartelId,
          requester_id: userId,
          title,
          body,
          tags: selectedTags,
          visibility: isPrivate ? 'prive' : 'kartel',
          due_date: dueDate?.toISOString(),
          attachments: attachmentUrls
        });

      if (error) throw error;

      toast.success(lang === 'fr' ? 'Demande créée avec succès' : 'Request created successfully');
      setTitle("");
      setBody("");
      setSelectedTags([]);
      setIsPrivate(false);
      setDueDate(undefined);
      setAttachments([]);
      onSuccess();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(lang === 'fr' ? 'Erreur lors de la création' : 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  const getTagLabel = (tag: string) => {
    const labels: Record<string, { fr: string; en: string }> = {
      methodo: { fr: 'Méthodo', en: 'Method' },
      ressource: { fr: 'Ressource', en: 'Resource' },
      blocage: { fr: 'Blocage', en: 'Blocker' },
      motivation: { fr: 'Motivation', en: 'Motivation' },
      organisation: { fr: 'Organisation', en: 'Organization' }
    };
    return lang === 'fr' ? labels[tag]?.fr : labels[tag]?.en;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="title">{lang === 'fr' ? 'Titre' : 'Title'} *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={lang === 'fr' ? 'Titre de votre demande' : 'Title of your request'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">{lang === 'fr' ? 'Description' : 'Description'} *</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          placeholder={lang === 'fr' ? 'Décrivez votre demande en détail' : 'Describe your request in detail'}
        />
      </div>

      <div className="space-y-2">
        <Label>{lang === 'fr' ? 'Tags' : 'Tags'} *</Label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <Button
              key={tag}
              type="button"
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagToggle(tag)}
            >
              {getTagLabel(tag)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{lang === 'fr' ? 'Date d\'échéance' : 'Due Date'}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dueDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : (lang === 'fr' ? 'Sélectionner une date' : 'Select a date')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label>{lang === 'fr' ? 'Pièces jointes' : 'Attachments'}</Label>
        <div className="space-y-2">
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            className="cursor-pointer"
            accept="*/*"
          />
          {attachments.length > 0 && (
            <div className="space-y-1">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {lang === 'fr' ? 'Max 10 fichiers, 25 Mo chacun' : 'Max 10 files, 25MB each'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="private"
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
        />
        <Label htmlFor="private" className="cursor-pointer">
          {lang === 'fr' ? 'Demande privée (visible uniquement par le +1)' : 'Private request (visible only by +1)'}
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (lang === 'fr' ? 'Chargement...' : 'Loading...') : (lang === 'fr' ? 'Envoyer la demande' : 'Submit Request')}
      </Button>
    </form>
  );
};