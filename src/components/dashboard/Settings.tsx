import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useParams } from 'react-router-dom';
import { Home, Settings2, Users, Palette, Bell, Plug, Zap, Shield, CreditCard, SlidersHorizontal, AlertTriangle, User } from 'lucide-react';
import { GeneralTab } from './settings/GeneralTab';
import { MembersTab } from './settings/MembersTab';
import { DangerZoneTab } from './settings/DangerZoneTab';
import { PlaceholderTab } from './settings/PlaceholderTab';

interface SettingsProps {
  onNavigate?: (section: string) => void;
}

export const Settings = ({ onNavigate }: SettingsProps) => {
  const { lang } = useParams<{ lang: string }>();
  const [activeTab, setActiveTab] = useState('general');
  const [scope, setScope] = useState<'personal' | 'workspace'>('workspace');

  // Persist active tab
  useEffect(() => {
    const savedTab = localStorage.getItem('settings-active-tab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  useEffect(() => {
    localStorage.setItem('settings-active-tab', activeTab);
  }, [activeTab]);

  // Determine scope based on active tab
  useEffect(() => {
    if (activeTab === 'account') {
      setScope('personal');
    } else {
      setScope('workspace');
    }
  }, [activeTab]);

  const tabs = [
    {
      value: 'general',
      label: lang === 'fr' ? 'Général' : 'General',
      icon: Settings2,
      scope: 'workspace',
    },
    {
      value: 'members',
      label: lang === 'fr' ? 'Membres' : 'Members',
      icon: Users,
      scope: 'workspace',
    },
    {
      value: 'display',
      label: lang === 'fr' ? 'Affichage' : 'Display',
      icon: Palette,
      scope: 'workspace',
    },
    {
      value: 'notifications',
      label: lang === 'fr' ? 'Notifications' : 'Notifications',
      icon: Bell,
      scope: 'workspace',
    },
    {
      value: 'integrations',
      label: lang === 'fr' ? 'Intégrations' : 'Integrations',
      icon: Plug,
      scope: 'workspace',
    },
    {
      value: 'automations',
      label: lang === 'fr' ? 'Automatisations' : 'Automations',
      icon: Zap,
      scope: 'workspace',
    },
    {
      value: 'privacy',
      label: lang === 'fr' ? 'Confidentialité' : 'Privacy',
      icon: Shield,
      scope: 'workspace',
    },
    {
      value: 'billing',
      label: lang === 'fr' ? 'Facturation' : 'Billing',
      icon: CreditCard,
      scope: 'workspace',
    },
    {
      value: 'advanced',
      label: lang === 'fr' ? 'Avancé' : 'Advanced',
      icon: SlidersHorizontal,
      scope: 'workspace',
    },
    {
      value: 'danger',
      label: lang === 'fr' ? 'Zone de danger' : 'Danger Zone',
      icon: AlertTriangle,
      scope: 'workspace',
    },
    {
      value: 'account',
      label: lang === 'fr' ? 'Compte' : 'Account',
      icon: User,
      scope: 'personal',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => onNavigate?.('overview')}
              className="cursor-pointer flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{lang === 'fr' ? 'Paramètres' : 'Settings'}</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {tabs.find(t => t.value === activeTab)?.label}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with scope badge */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{lang === 'fr' ? 'Paramètres' : 'Settings'}</h1>
          <p className="text-muted-foreground text-lg">
            {lang === 'fr' ? 'Gérez les préférences de votre kartel' : 'Manage your kartel preferences'}
          </p>
        </div>
        <Badge variant={scope === 'workspace' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
          {scope === 'workspace' 
            ? (lang === 'fr' ? 'Espace de travail' : 'Workspace')
            : (lang === 'fr' ? 'Personnel' : 'Personal')
          }
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-auto flex-wrap gap-1 bg-transparent p-0">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-2 data-[state=active]:bg-muted"
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>

          <TabsContent value="members">
            <MembersTab />
          </TabsContent>

          <TabsContent value="display">
            <PlaceholderTab
              title={lang === 'fr' ? 'Affichage' : 'Display'}
              description={lang === 'fr' ? 'Personnalisez l\'apparence de votre espace' : 'Customize your workspace appearance'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <PlaceholderTab
              title={lang === 'fr' ? 'Notifications' : 'Notifications'}
              description={lang === 'fr' ? 'Gérez vos préférences de notification' : 'Manage your notification preferences'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>

          <TabsContent value="integrations">
            <PlaceholderTab
              title={lang === 'fr' ? 'Intégrations' : 'Integrations'}
              description={lang === 'fr' ? 'Connectez des services externes' : 'Connect external services'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>

          <TabsContent value="automations">
            <PlaceholderTab
              title={lang === 'fr' ? 'Automatisations' : 'Automations'}
              description={lang === 'fr' ? 'Automatisez vos flux de travail' : 'Automate your workflows'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>

          <TabsContent value="privacy">
            <PlaceholderTab
              title={lang === 'fr' ? 'Confidentialité' : 'Privacy'}
              description={lang === 'fr' ? 'Contrôlez vos données et votre confidentialité' : 'Control your data and privacy'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>

          <TabsContent value="billing">
            <PlaceholderTab
              title={lang === 'fr' ? 'Facturation' : 'Billing'}
              description={lang === 'fr' ? 'Gérez votre abonnement et vos paiements' : 'Manage your subscription and payments'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>

          <TabsContent value="advanced">
            <PlaceholderTab
              title={lang === 'fr' ? 'Avancé' : 'Advanced'}
              description={lang === 'fr' ? 'Paramètres avancés' : 'Advanced settings'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>

          <TabsContent value="danger">
            <DangerZoneTab />
          </TabsContent>

          <TabsContent value="account">
            <PlaceholderTab
              title={lang === 'fr' ? 'Compte' : 'Account'}
              description={lang === 'fr' ? 'Gérez vos informations personnelles' : 'Manage your personal information'}
              comingSoonMessage={lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
