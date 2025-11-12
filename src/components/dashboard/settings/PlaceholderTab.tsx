import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PlaceholderTabProps {
  title: string;
  description: string;
  comingSoonMessage: string;
}

export const PlaceholderTab = ({ title, description, comingSoonMessage }: PlaceholderTabProps) => {
  const { t } = useTranslation();
  
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
            {t('dashboard.settings.comingSoonDescription')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
