import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

export const GeneralTab = () => {
  const { lang } = useParams<{ lang: string }>();
  const { toast } = useToast();
  
  const [kartelName, setKartelName] = useState('Formation Psychanalyse - Promotion 2025');
  const [objective, setObjective] = useState('Préparation à l\'examen ECF de psychanalyse');
  const [deadline, setDeadline] = useState('2026-04-15');
  const [timezone, setTimezone] = useState('Europe/Paris');
  const [defaultLanguage, setDefaultLanguage] = useState('fr');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: lang === 'fr' ? 'Paramètres enregistrés' : 'Settings saved',
      description: lang === 'fr' ? 'Vos modifications ont été enregistrées avec succès' : 'Your changes have been saved successfully',
    });
    
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{lang === 'fr' ? 'Paramètres généraux' : 'General Settings'}</CardTitle>
          <CardDescription>
            {lang === 'fr' ? 'Configurez les informations de base de votre kartel' : 'Configure your kartel\'s basic information'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kartel-name">
              {lang === 'fr' ? 'Nom du kartel' : 'Kartel Name'} *
            </Label>
            <Input
              id="kartel-name"
              value={kartelName}
              onChange={(e) => setKartelName(e.target.value)}
              placeholder={lang === 'fr' ? 'Nom de votre kartel' : 'Your kartel name'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">
              {lang === 'fr' ? 'Objectif' : 'Objective'}
            </Label>
            <Textarea
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder={lang === 'fr' ? 'Décrivez l\'objectif de votre kartel' : 'Describe your kartel\'s objective'}
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="deadline">
                {lang === 'fr' ? 'Échéance' : 'Deadline'}
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">
                {lang === 'fr' ? 'Fuseau horaire' : 'Timezone'}
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                  <SelectItem value="America/Los_Angeles">America/Los_Angeles (UTC-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">
              {lang === 'fr' ? 'Langue par défaut' : 'Default Language'}
            </Label>
            <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving 
                ? (lang === 'fr' ? 'Enregistrement...' : 'Saving...')
                : (lang === 'fr' ? 'Enregistrer' : 'Save')
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
