import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface GlossaryEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  term?: {
    id: string;
    term: string;
    definition: string;
    category: string;
  };
  onSave: (term: { term: string; definition: string; category: string }) => Promise<void>;
}

export const GlossaryEditor = ({ open, onOpenChange, term, onSave }: GlossaryEditorProps) => {
  const { t } = useTranslation();
  const [termText, setTermText] = useState('');
  const [definition, setDefinition] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (term) {
      setTermText(term.term);
      setDefinition(term.definition);
      setCategory(term.category);
    } else {
      setTermText('');
      setDefinition('');
      setCategory('');
    }
  }, [term, open]);

  const handleSave = async () => {
    if (!termText.trim() || !definition.trim() || !category) return;
    
    setSaving(true);
    try {
      await onSave({ term: termText, definition, category });
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {term ? t('notes.glossary.editTerm') : t('notes.glossary.addTerm')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="term">{t('notes.glossary.termLabel')} *</Label>
            <Input
              id="term"
              value={termText}
              onChange={(e) => setTermText(e.target.value)}
              placeholder={t('notes.glossary.termPlaceholder')}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="category">{t('notes.glossary.categoryLabel')} *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={t('notes.glossary.categoryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Psychanalyse">Psychanalyse</SelectItem>
                <SelectItem value="Méthodologie">Méthodologie</SelectItem>
                <SelectItem value="Théorie">Théorie</SelectItem>
                <SelectItem value="Clinique">Clinique</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="definition">{t('notes.glossary.definitionLabel')} *</Label>
            <Textarea
              id="definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder={t('notes.glossary.definitionPlaceholder')}
              className="mt-1 min-h-[150px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!termText.trim() || !definition.trim() || !category || saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
