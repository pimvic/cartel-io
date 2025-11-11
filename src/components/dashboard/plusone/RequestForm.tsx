import { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        toast.error(t('plusOne.form.errors.fileTooLarge', { name: f.name }));
        return false;
      }
      return true;
    });
    
    if (attachments.length + validFiles.length > 10) {
      toast.error(t('plusOne.form.errors.tooManyFiles'));
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
      toast.error(t('plusOne.form.errors.noTags'));
      return;
    }

    setLoading(true);
    
    try {
      // Upload attachments if any
      const attachmentUrls = await Promise.all(
        attachments.map(async (file) => {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${cartelId}/${fileName}`;
          
          // Note: Storage bucket would need to be created
          // For now, we'll store file metadata
          return {
            name: file.name,
            size: file.size,
            type: file.type
          };
        })
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

      toast.success(t('plusOne.form.success'));
      setTitle("");
      setBody("");
      setSelectedTags([]);
      setIsPrivate(false);
      setDueDate(undefined);
      setAttachments([]);
      onSuccess();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(t('plusOne.form.errors.submit'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border">
      <div className="space-y-2">
        <Label htmlFor="title">{t('plusOne.form.title')} *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={t('plusOne.form.titlePlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">{t('plusOne.form.body')} *</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={6}
          placeholder={t('plusOne.form.bodyPlaceholder')}
        />
      </div>

      <div className="space-y-2">
        <Label>{t('plusOne.form.tags')} *</Label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <Button
              key={tag}
              type="button"
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagToggle(tag)}
            >
              {t(`plusOne.tags.${tag}`)}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('plusOne.form.dueDate')}</Label>
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
              {dueDate ? format(dueDate, "PPP") : t('plusOne.form.selectDate')}
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
        <Label>{t('plusOne.form.attachments')}</Label>
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
            {t('plusOne.form.attachmentLimits')}
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
          {t('plusOne.form.privateRequest')}
        </Label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t('common.loading') : t('plusOne.form.submit')}
      </Button>
    </form>
  );
};