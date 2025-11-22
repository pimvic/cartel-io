import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Archive, Trash2 } from 'lucide-react';

export const DangerZoneTab = () => {
  const { lang } = useParams<{ lang: string }>();
  const { toast } = useToast();
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const kartelName = 'Formation Psychanalyse - Promotion 2025';

  const handleArchive = () => {
    toast({
      title: t('settings.dangerZone.archived'),
      description: t('settings.dangerZone.archivedDescription'),
    });
    setArchiveOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmation === kartelName) {
      toast({
        title: t('settings.dangerZone.deleted'),
        description: t('settings.dangerZone.deletedDescription'),
        variant: 'destructive',
      });
      setDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <CardTitle className="text-destructive">{t('settings.dangerZone.title')}</CardTitle>
          </div>
          <CardDescription>{t('settings.dangerZone.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">{t('settings.dangerZone.archive.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('settings.dangerZone.archive.description')}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setArchiveOpen(true)}
              >
                <Archive className="w-4 h-4 mr-2" />
                {t('settings.dangerZone.archive.button')}
              </Button>
            </div>
          </div>

          <div className="space-y-3 p-4 border border-destructive rounded-lg bg-destructive/5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium text-destructive">{t('settings.dangerZone.delete.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('settings.dangerZone.delete.description')}
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                  <li>{t('settings.dangerZone.delete.consequence1')}</li>
                  <li>{t('settings.dangerZone.delete.consequence2')}</li>
                  <li>{t('settings.dangerZone.delete.consequence3')}</li>
                  <li>{t('settings.dangerZone.delete.consequence4')}</li>
                </ul>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('settings.dangerZone.delete.button')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.dangerZone.archive.confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.dangerZone.archive.confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              {t('settings.dangerZone.archive.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {t('settings.dangerZone.delete.confirmTitle')}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.dangerZone.delete.confirmDescription')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="confirm-name">
              {t('settings.dangerZone.delete.confirmLabel', { name: kartelName })}
            </Label>
            <Input
              id="confirm-name"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder={kartelName}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteConfirmation !== kartelName}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('settings.dangerZone.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
