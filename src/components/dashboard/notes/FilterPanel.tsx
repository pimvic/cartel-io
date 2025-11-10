import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    favorites: boolean;
    shared: boolean;
    archived: boolean;
    tags: string[];
  };
  availableTags: string[];
  onFiltersChange: (filters: any) => void;
}

export const FilterPanel = ({
  open,
  onOpenChange,
  filters,
  availableTags,
  onFiltersChange,
}: FilterPanelProps) => {
  const { t } = useTranslation();

  const handleReset = () => {
    onFiltersChange({
      favorites: false,
      shared: false,
      archived: false,
      tags: [],
    });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{t('notes.filter.title')}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <Label>{t('notes.filter.options')}</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="favorites"
                checked={filters.favorites}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, favorites: checked as boolean })
                }
              />
              <label htmlFor="favorites" className="text-sm cursor-pointer">
                {t('notes.filter.favorites')}
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="shared"
                checked={filters.shared}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, shared: checked as boolean })
                }
              />
              <label htmlFor="shared" className="text-sm cursor-pointer">
                {t('notes.filter.shared')}
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="archived"
                checked={filters.archived}
                onCheckedChange={(checked) =>
                  onFiltersChange({ ...filters, archived: checked as boolean })
                }
              />
              <label htmlFor="archived" className="text-sm cursor-pointer">
                {t('notes.filter.archived')}
              </label>
            </div>
          </div>

          {availableTags.length > 0 && (
            <div className="space-y-2">
              <Label>{t('notes.filter.tags')}</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {t('notes.filter.reset')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
