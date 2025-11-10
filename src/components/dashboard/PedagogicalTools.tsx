import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ExternalLink, Brain, Map, CreditCard, BarChart3, Video, MessageCircle,
  Lightbulb, Users, FileText, BookOpen, UserCheck, Film, Target, Puzzle,
  Layout, RotateCw, Bot, Trophy, ThumbsUp, PartyPopper, ArrowRight, Book,
  Search, BookMarked, GraduationCap, FolderOpen, FileStack, Sparkles, Home
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ToolModal } from './tools/ToolModal';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface PedagogicalToolsProps {
  onNavigate?: (section: string) => void;
}

interface Tool {
  name: string;
  description: string;
  icon: any;
  color: string;
  section?: string;
  status?: 'new' | 'updated' | 'coming-soon' | 'active';
  progress?: number;
  category: 'module' | 'activity' | 'guide' | 'resource' | 'template' | 'external';
}

export const PedagogicalTools = ({ onNavigate }: PedagogicalToolsProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Define all tools with their categories
  const allTools: Tool[] = [
    // Main modules - Active tools
    {
      name: t('tools.modules.quiz'),
      description: t('tools.descriptions.quiz'),
      icon: Brain,
      color: 'text-blue-500',
      section: 'quiz',
      status: 'active',
      progress: 85,
      category: 'module'
    },
    {
      name: t('tools.modules.flashcards'),
      description: t('tools.descriptions.flashcards'),
      icon: CreditCard,
      color: 'text-green-500',
      section: 'flashcards',
      status: 'active',
      progress: 70,
      category: 'module'
    },
    {
      name: t('tools.modules.mindmap'),
      description: t('tools.descriptions.mindmap'),
      icon: Map,
      color: 'text-purple-500',
      section: 'mindmap',
      status: 'active',
      category: 'module'
    },
    {
      name: t('tools.modules.glossary'),
      description: t('tools.descriptions.glossary'),
      icon: Book,
      color: 'text-indigo-500',
      section: 'glossaire',
      status: 'updated',
      category: 'module'
    },

    // Guides
    {
      name: t('tools.guides.methodology'),
      description: t('tools.descriptions.methodology'),
      icon: BookMarked,
      color: 'text-cyan-500',
      status: 'active',
      category: 'guide'
    },
    {
      name: t('tools.guides.bestPractices'),
      description: t('tools.descriptions.bestPractices'),
      icon: Sparkles,
      color: 'text-amber-500',
      status: 'new',
      category: 'guide'
    },

    // Collaborative activities
    {
      name: t('tools.activities.progressBoard'),
      description: t('tools.descriptions.progressBoard'),
      icon: BarChart3,
      color: 'text-orange-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: t('tools.activities.rolePlaying'),
      description: t('tools.descriptions.rolePlaying'),
      icon: Video,
      color: 'text-red-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: t('tools.activities.debriefing'),
      description: t('tools.descriptions.debriefing'),
      icon: MessageCircle,
      color: 'text-cyan-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: t('tools.activities.brainstorming'),
      description: t('tools.descriptions.brainstorming'),
      icon: Lightbulb,
      color: 'text-yellow-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: t('tools.activities.debate'),
      description: t('tools.descriptions.debate'),
      icon: Users,
      color: 'text-pink-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: t('tools.activities.groupMission'),
      description: t('tools.descriptions.groupMission'),
      icon: Target,
      color: 'text-rose-500',
      status: 'coming-soon',
      category: 'activity'
    },

    // Resources
    {
      name: t('tools.resources.knowledgeSheet'),
      description: t('tools.descriptions.knowledgeSheet'),
      icon: FileText,
      color: 'text-indigo-500',
      status: 'coming-soon',
      category: 'resource'
    },
    {
      name: t('tools.resources.learningJournal'),
      description: t('tools.descriptions.learningJournal'),
      icon: BookOpen,
      color: 'text-teal-500',
      status: 'coming-soon',
      category: 'resource'
    },
    {
      name: t('tools.resources.interactiveVideo'),
      description: t('tools.descriptions.interactiveVideo'),
      icon: Film,
      color: 'text-amber-500',
      status: 'coming-soon',
      category: 'resource'
    },
    {
      name: t('tools.resources.aiSummary'),
      description: t('tools.descriptions.aiSummary'),
      icon: Bot,
      color: 'text-fuchsia-500',
      status: 'new',
      category: 'resource'
    },

    // Templates
    {
      name: t('tools.templates.peerEvaluation'),
      description: t('tools.descriptions.peerEvaluation'),
      icon: UserCheck,
      color: 'text-lime-500',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: t('tools.templates.crossSkills'),
      description: t('tools.descriptions.crossSkills'),
      icon: Puzzle,
      color: 'text-violet-500',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: t('tools.templates.motivationWheel'),
      description: t('tools.descriptions.motivationWheel'),
      icon: RotateCw,
      color: 'text-emerald-500',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: t('tools.templates.challenge'),
      description: t('tools.descriptions.challenge'),
      icon: Trophy,
      color: 'text-yellow-600',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: t('tools.templates.instantFeedback'),
      description: t('tools.descriptions.instantFeedback'),
      icon: ThumbsUp,
      color: 'text-blue-600',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: t('tools.templates.celebration'),
      description: t('tools.descriptions.celebration'),
      icon: PartyPopper,
      color: 'text-pink-600',
      status: 'coming-soon',
      category: 'template'
    },
  ];

  const externalServices = [
    { name: t('tools.external.openai'), url: 'https://openai.com' },
    { name: t('tools.external.notebooklm'), url: 'https://notebooklm.google.com' },
    { name: t('tools.external.specializedGPTs'), url: 'https://chat.openai.com/gpts' },
  ];

  // Filter tools based on search
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return allTools;
    
    const query = searchQuery.toLowerCase();
    return allTools.filter(
      tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.category.toLowerCase().includes(query)
    );
  }, [searchQuery, allTools]);

  // Group tools by category
  const toolsByCategory = useMemo(() => {
    const grouped = {
      module: filteredTools.filter(t => t.category === 'module'),
      guide: filteredTools.filter(t => t.category === 'guide'),
      activity: filteredTools.filter(t => t.category === 'activity'),
      resource: filteredTools.filter(t => t.category === 'resource'),
      template: filteredTools.filter(t => t.category === 'template'),
    };
    return grouped;
  }, [filteredTools]);

  const handleToolClick = (tool: Tool) => {
    if (tool.section && onNavigate) {
      onNavigate(tool.section);
    } else {
      setSelectedTool(tool);
      setModalOpen(true);
    }
  };

  const renderToolCard = (tool: Tool) => (
    <Card
      key={tool.name}
      className="hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => handleToolClick(tool)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <tool.icon className={`w-5 h-5 ${tool.color}`} />
            </div>
            <CardTitle className="text-base">{tool.name}</CardTitle>
          </div>
          {tool.status && (
            <Badge
              variant={
                tool.status === 'new' ? 'default' :
                tool.status === 'updated' ? 'secondary' :
                tool.status === 'coming-soon' ? 'outline' :
                'secondary'
              }
              className="text-xs"
            >
              {tool.status === 'new' && t('tools.status.new')}
              {tool.status === 'updated' && t('tools.status.updated')}
              {tool.status === 'coming-soon' && t('tools.status.comingSoon')}
              {tool.status === 'active' && t('tools.status.active')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-3">{tool.description}</CardDescription>
        {tool.progress !== undefined && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{t('tools.progress')}</span>
              <span className="font-medium">{tool.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${tool.progress}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

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
              {t('tools.breadcrumb.dashboard')}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('tools.breadcrumb.tools')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('tools.title')}</h1>
        <p className="text-muted-foreground text-lg">{t('tools.subtitle')}</p>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={t('tools.searchPlaceholder')}
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Modules Section */}
      {toolsByCategory.module.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('tools.categories.modules')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {toolsByCategory.module.map(renderToolCard)}
          </div>
        </div>
      )}

      {/* Guides Section */}
      {toolsByCategory.guide.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('tools.categories.guides')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolsByCategory.guide.map(renderToolCard)}
          </div>
        </div>
      )}

      {/* Collaborative Activities Section */}
      {toolsByCategory.activity.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('tools.categories.activities')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolsByCategory.activity.map(renderToolCard)}
          </div>
        </div>
      )}

      {/* Resources Section */}
      {toolsByCategory.resource.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('tools.categories.resources')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolsByCategory.resource.map(renderToolCard)}
          </div>
        </div>
      )}

      {/* Templates Section */}
      {toolsByCategory.template.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileStack className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">{t('tools.categories.templates')}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {toolsByCategory.template.map(renderToolCard)}
          </div>
        </div>
      )}

      {/* External Services */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" />
            <CardTitle>{t('tools.categories.external')}</CardTitle>
          </div>
          <CardDescription>{t('tools.externalDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {externalServices.map((service, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-between h-auto py-3"
                onClick={() => window.open(service.url, '_blank')}
              >
                <span>{service.name}</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Empty state */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">{t('tools.noResults')}</p>
        </div>
      )}

      {/* Tool Modal */}
      <ToolModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tool={selectedTool}
      />
    </div>
  );
};
