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
      title: lang === 'fr' ? 'AGORA archivé' : 'AGORA Archived',
      description: lang === 'fr' ? 'Votre agora a été archivé avec succès' : 'Your agora has been archived successfully',
    });
    setArchiveOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmation === kartelName) {
      toast({
        title: lang === 'fr' ? 'AGORA supprimé' : 'AGORA Deleted',
        description: lang === 'fr' ? 'Votre agora a été définitivement supprimé' : 'Your agora has been permanently deleted',
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
            <CardTitle className="text-destructive">
              {lang === 'fr' ? 'Zone de danger' : 'Danger Zone'}
            </CardTitle>
          </div>
          <CardDescription>
            {lang === 'fr' ? 'Actions irréversibles sur votre agora' : 'Irreversible actions on your agora'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 p-4 border rounded-lg">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium">
                  {lang === 'fr' ? 'Archiver le agora' : 'Archive AGORA'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {lang === 'fr' ? 'Archivez votre agora pour le mettre en lecture seule' : 'Archive your agora to make it read-only'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setArchiveOpen(true)}
              >
                <Archive className="w-4 h-4 mr-2" />
                {lang === 'fr' ? 'Archiver' : 'Archive'}
              </Button>
            </div>
          </div>

          <div className="space-y-3 p-4 border border-destructive rounded-lg bg-destructive/5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="font-medium text-destructive">
                  {lang === 'fr' ? 'Supprimer le agora' : 'Delete AGORA'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {lang === 'fr' ? 'Supprimez définitivement votre agora et toutes ses données' : 'Permanently delete your agora and all its data'}
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                  <li>{lang === 'fr' ? 'Toutes les notes seront supprimées' : 'All notes will be deleted'}</li>
                  <li>{lang === 'fr' ? 'Tous les membres seront retirés' : 'All members will be removed'}</li>
                  <li>{lang === 'fr' ? 'Tous les événements seront perdus' : 'All events will be lost'}</li>
                  <li>{lang === 'fr' ? 'Cette action est irréversible' : 'This action is irreversible'}</li>
                </ul>
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {lang === 'fr' ? 'Supprimer' : 'Delete'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {lang === 'fr' ? 'Confirmer l\'archivage' : 'Confirm Archive'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'fr' 
                ? 'Êtes-vous sûr de vouloir archiver ce agora ? Il sera mis en lecture seule.'
                : 'Are you sure you want to archive this agora? It will be made read-only.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{lang === 'fr' ? 'Annuler' : 'Cancel'}</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive}>
              {lang === 'fr' ? 'Archiver' : 'Archive'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive">
              {lang === 'fr' ? 'Confirmer la suppression' : 'Confirm Deletion'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {lang === 'fr'
                ? 'Cette action est irréversible. Tapez le nom du agora pour confirmer.'
                : 'This action is irreversible. Type the agora name to confirm.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="confirm-name">
              {lang === 'fr' 
                ? `Tapez "${kartelName}" pour confirmer`
                : `Type "${kartelName}" to confirm`
              }
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
              {lang === 'fr' ? 'Annuler' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteConfirmation !== kartelName}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {lang === 'fr' ? 'Supprimer définitivement' : 'Delete Permanently'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
