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
      label: t('settings.tabs.general'),
      icon: Settings2,
      scope: 'workspace',
    },
    {
      value: 'members',
      label: t('settings.tabs.members'),
      icon: Users,
      scope: 'workspace',
    },
    {
      value: 'display',
      label: t('settings.tabs.display'),
      icon: Palette,
      scope: 'workspace',
    },
    {
      value: 'notifications',
      label: t('settings.tabs.notifications'),
      icon: Bell,
      scope: 'workspace',
    },
    {
      value: 'integrations',
      label: t('settings.tabs.integrations'),
      icon: Plug,
      scope: 'workspace',
    },
    {
      value: 'automations',
      label: t('settings.tabs.automations'),
      icon: Zap,
      scope: 'workspace',
    },
    {
      value: 'privacy',
      label: t('settings.tabs.privacy'),
      icon: Shield,
      scope: 'workspace',
    },
    {
      value: 'billing',
      label: t('settings.tabs.billing'),
      icon: CreditCard,
      scope: 'workspace',
    },
    {
      value: 'advanced',
      label: t('settings.tabs.advanced'),
      icon: SlidersHorizontal,
      scope: 'workspace',
    },
    {
      value: 'danger',
      label: t('settings.tabs.danger'),
      icon: AlertTriangle,
      scope: 'workspace',
    },
    {
      value: 'account',
      label: t('settings.tabs.account'),
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
              {t('settings.breadcrumb.dashboard')}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('settings.breadcrumb.settings')}</BreadcrumbPage>
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
          <h1 className="text-3xl font-bold mb-2">{t('settings.title')}</h1>
          <p className="text-muted-foreground text-lg">{t('settings.subtitle')}</p>
        </div>
        <Badge variant={scope === 'workspace' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
          {scope === 'workspace' ? t('settings.scope.workspace') : t('settings.scope.personal')}
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
              title={t('settings.tabs.display')}
              description={t('settings.display.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>

          <TabsContent value="notifications">
            <PlaceholderTab
              title={t('settings.tabs.notifications')}
              description={t('settings.notifications.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>

          <TabsContent value="integrations">
            <PlaceholderTab
              title={t('settings.tabs.integrations')}
              description={t('settings.integrations.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>

          <TabsContent value="automations">
            <PlaceholderTab
              title={t('settings.tabs.automations')}
              description={t('settings.automations.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>

          <TabsContent value="privacy">
            <PlaceholderTab
              title={t('settings.tabs.privacy')}
              description={t('settings.privacy.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>

          <TabsContent value="billing">
            <PlaceholderTab
              title={t('settings.tabs.billing')}
              description={t('settings.billing.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>

          <TabsContent value="advanced">
            <PlaceholderTab
              title={t('settings.tabs.advanced')}
              description={t('settings.advanced.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>

          <TabsContent value="danger">
            <DangerZoneTab />
          </TabsContent>

          <TabsContent value="account">
            <PlaceholderTab
              title={t('settings.tabs.account')}
              description={t('settings.account.description')}
              comingSoonMessage={t('settings.comingSoon')}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
