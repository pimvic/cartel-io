import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface PlaceholderTabProps {
  title: string;
  description: string;
  comingSoonMessage: string;
}

export const PlaceholderTab = ({ title, description, comingSoonMessage }: PlaceholderTabProps) => {
  const { lang } = useParams<{ lang: string }>();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">{comingSoonMessage}</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {lang === 'fr' 
              ? 'Cette fonctionnalité sera bientôt disponible. Restez à l\'écoute !' 
              : 'This feature will be available soon. Stay tuned!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
