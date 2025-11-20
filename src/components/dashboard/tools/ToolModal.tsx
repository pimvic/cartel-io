import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface ToolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: {
    name: string;
    description: string;
    status?: 'new' | 'updated' | 'coming-soon' | 'active';
    progress?: number;
    icon: any;
    color: string;
  } | null;
}

export const ToolModal = ({ open, onOpenChange, tool }: ToolModalProps) => {
  const { lang } = useParams<{ lang: string }>();

  if (!tool) return null;

  const isComingSoon = tool.status === 'coming-soon';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-muted`}>
              <tool.icon className={`w-6 h-6 ${tool.color}`} />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">{tool.name}</DialogTitle>
              {tool.status && (
                <Badge
                  variant={
                    tool.status === 'new' ? 'default' :
                    tool.status === 'updated' ? 'secondary' :
                    'outline'
                  }
                  className="mt-1"
                >
                  {tool.status === 'new' && (lang === 'fr' ? 'Nouveau' : 'New')}
                  {tool.status === 'updated' && (lang === 'fr' ? 'Mis à jour' : 'Updated')}
                  {tool.status === 'coming-soon' && (lang === 'fr' ? 'Bientôt' : 'Coming Soon')}
                  {tool.status === 'active' && (lang === 'fr' ? 'Actif' : 'Active')}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <DialogDescription className="text-base mt-4">
          {tool.description}
        </DialogDescription>

        {isComingSoon ? (
          <div className="mt-6 p-6 border border-dashed rounded-lg text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">{lang === 'fr' ? 'Bientôt disponible' : 'Coming Soon'}</h3>
            <p className="text-sm text-muted-foreground">
              {lang === 'fr' ? 'Cet outil sera disponible prochainement.' : 'This tool will be available soon.'}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {tool.progress !== undefined && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{lang === 'fr' ? 'Progression' : 'Progress'}</span>
                  <span className="font-medium">{tool.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${tool.progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button className="flex-1">
                {lang === 'fr' ? 'Lancer' : 'Launch'}
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
