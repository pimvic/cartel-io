import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NoteEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note?: {
    id: string;
    title: string;
    content: string;
    visibility: 'personal' | 'kartel';
    tags: string[];
  };
  onSave: (note: {
    title: string;
    content: string;
    visibility: 'personal' | 'kartel';
    tags: string[];
  }) => Promise<void>;
}

export const NoteEditor = ({ open, onOpenChange, note, onSave }: NoteEditorProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<'personal' | 'kartel'>('personal');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setVisibility(note.visibility);
      setTags(note.tags || []);
    } else {
      setTitle('');
      setContent('');
      setVisibility('personal');
      setTags([]);
    }
  }, [note, open]);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (!open || !title) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, content, visibility, tags, open]);

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 10 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    
    setSaving(true);
    try {
      await onSave({ title, content, visibility, tags });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (title.trim()) {
      handleSave();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {note ? t('notes.editor.editTitle') : t('notes.editor.newTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{t('notes.editor.titleLabel')} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('notes.editor.titlePlaceholder')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="content">{t('notes.editor.contentLabel')}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t('notes.editor.contentPlaceholder')}
              className="mt-1 min-h-[200px]"
            />
          </div>

          <div>
            <Label htmlFor="visibility">{t('notes.editor.visibilityLabel')}</Label>
            <Select value={visibility} onValueChange={(v: 'personal' | 'kartel') => setVisibility(v)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">{t('notes.editor.visibilityPersonal')}</SelectItem>
                <SelectItem value="kartel">{t('notes.editor.visibilityKartel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tags">{t('notes.editor.tagsLabel')}</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={t('notes.editor.tagsPlaceholder')}
                disabled={tags.length >= 10}
              />
              <Button onClick={handleAddTag} disabled={tags.length >= 10} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('notes.editor.tagsLimit', { count: tags.length, max: 10 })}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
