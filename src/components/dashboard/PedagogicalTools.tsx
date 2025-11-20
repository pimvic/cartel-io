import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
  category: 'module' | 'activity' | 'guide' | 'resource' | 'template';
}

export const PedagogicalTools = ({ onNavigate }: PedagogicalToolsProps) => {
  const { lang } = useParams<{ lang: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allTools: Tool[] = [
    {
      name: lang === 'fr' ? 'Quiz' : 'Quiz',
      description: lang === 'fr' ? 'Testez vos connaissances avec des quiz interactifs' : 'Test your knowledge with interactive quizzes',
      icon: Brain,
      color: 'text-blue-500',
      section: 'quiz',
      status: 'active',
      progress: 85,
      category: 'module'
    },
    {
      name: lang === 'fr' ? 'Flashcards' : 'Flashcards',
      description: lang === 'fr' ? 'Mémorisez avec des cartes interactives' : 'Memorize with interactive cards',
      icon: CreditCard,
      color: 'text-green-500',
      section: 'flashcards',
      status: 'active',
      progress: 70,
      category: 'module'
    },
    {
      name: lang === 'fr' ? 'Carte Mentale' : 'Mind Map',
      description: lang === 'fr' ? 'Visualisez vos idées de manière structurée' : 'Visualize your ideas in a structured way',
      icon: Map,
      color: 'text-purple-500',
      section: 'mindmap',
      status: 'active',
      category: 'module'
    },
    {
      name: lang === 'fr' ? 'Glossaire' : 'Glossary',
      description: lang === 'fr' ? 'Dictionnaire des termes clés' : 'Dictionary of key terms',
      icon: Book,
      color: 'text-indigo-500',
      section: 'glossaire',
      status: 'updated',
      category: 'module'
    },
    {
      name: lang === 'fr' ? 'Méthodologie' : 'Methodology',
      description: lang === 'fr' ? 'Guide complet des méthodes d\'apprentissage' : 'Complete guide to learning methods',
      icon: BookMarked,
      color: 'text-cyan-500',
      status: 'active',
      category: 'guide'
    },
    {
      name: lang === 'fr' ? 'Bonnes pratiques' : 'Best Practices',
      description: lang === 'fr' ? 'Conseils et astuces pour optimiser votre apprentissage' : 'Tips and tricks to optimize your learning',
      icon: Sparkles,
      color: 'text-amber-500',
      status: 'new',
      category: 'guide'
    },
    {
      name: lang === 'fr' ? 'Tableau de progression' : 'Progress Board',
      description: lang === 'fr' ? 'Suivez la progression collective du groupe' : 'Track collective group progress',
      icon: BarChart3,
      color: 'text-orange-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: lang === 'fr' ? 'Jeu de rôle' : 'Role Playing',
      description: lang === 'fr' ? 'Mettez en pratique vos compétences' : 'Practice your skills',
      icon: Video,
      color: 'text-red-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: lang === 'fr' ? 'Debriefing' : 'Debriefing',
      description: lang === 'fr' ? 'Analysez et partagez vos apprentissages' : 'Analyze and share your learnings',
      icon: MessageCircle,
      color: 'text-cyan-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: lang === 'fr' ? 'Brainstorming' : 'Brainstorming',
      description: lang === 'fr' ? 'Générez des idées en groupe' : 'Generate ideas as a group',
      icon: Lightbulb,
      color: 'text-yellow-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: lang === 'fr' ? 'Débat' : 'Debate',
      description: lang === 'fr' ? 'Échangez et argumentez sur des sujets' : 'Exchange and argue on topics',
      icon: Users,
      color: 'text-pink-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: lang === 'fr' ? 'Mission de groupe' : 'Group Mission',
      description: lang === 'fr' ? 'Collaborez pour atteindre un objectif commun' : 'Collaborate to achieve a common goal',
      icon: Target,
      color: 'text-rose-500',
      status: 'coming-soon',
      category: 'activity'
    },
    {
      name: lang === 'fr' ? 'Fiche de connaissance' : 'Knowledge Sheet',
      description: lang === 'fr' ? 'Synthèses structurées des concepts clés' : 'Structured summaries of key concepts',
      icon: FileText,
      color: 'text-indigo-500',
      status: 'coming-soon',
      category: 'resource'
    },
    {
      name: lang === 'fr' ? 'Journal d\'apprentissage' : 'Learning Journal',
      description: lang === 'fr' ? 'Documentez votre parcours d\'apprentissage' : 'Document your learning journey',
      icon: BookOpen,
      color: 'text-teal-500',
      status: 'coming-soon',
      category: 'resource'
    },
    {
      name: lang === 'fr' ? 'Vidéo interactive' : 'Interactive Video',
      description: lang === 'fr' ? 'Vidéos avec questions et interactions' : 'Videos with questions and interactions',
      icon: Film,
      color: 'text-amber-500',
      status: 'coming-soon',
      category: 'resource'
    },
    {
      name: lang === 'fr' ? 'Résumé IA' : 'AI Summary',
      description: lang === 'fr' ? 'Résumés générés automatiquement par IA' : 'AI-generated automatic summaries',
      icon: Bot,
      color: 'text-fuchsia-500',
      status: 'new',
      category: 'resource'
    },
    {
      name: lang === 'fr' ? 'Évaluation par les pairs' : 'Peer Evaluation',
      description: lang === 'fr' ? 'Évaluez et donnez du feedback à vos pairs' : 'Evaluate and give feedback to your peers',
      icon: UserCheck,
      color: 'text-lime-500',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: lang === 'fr' ? 'Compétences transversales' : 'Cross Skills',
      description: lang === 'fr' ? 'Développez vos soft skills' : 'Develop your soft skills',
      icon: Puzzle,
      color: 'text-violet-500',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: lang === 'fr' ? 'Roue de la motivation' : 'Motivation Wheel',
      description: lang === 'fr' ? 'Identifiez vos sources de motivation' : 'Identify your sources of motivation',
      icon: RotateCw,
      color: 'text-emerald-500',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: lang === 'fr' ? 'Challenge' : 'Challenge',
      description: lang === 'fr' ? 'Relevez des défis pour progresser' : 'Take on challenges to progress',
      icon: Trophy,
      color: 'text-yellow-600',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: lang === 'fr' ? 'Feedback positif' : 'Positive Feedback',
      description: lang === 'fr' ? 'Partagez des encouragements' : 'Share encouragement',
      icon: ThumbsUp,
      color: 'text-green-600',
      status: 'coming-soon',
      category: 'template'
    },
    {
      name: lang === 'fr' ? 'Célébration' : 'Celebration',
      description: lang === 'fr' ? 'Célébrez les réussites ensemble' : 'Celebrate successes together',
      icon: PartyPopper,
      color: 'text-pink-600',
      status: 'coming-soon',
      category: 'template'
    },
  ];

  const externalServices = [
    { name: 'OpenAI', url: 'https://openai.com' },
    { name: 'NotebookLM', url: 'https://notebooklm.google.com' },
    { name: lang === 'fr' ? 'GPTs spécialisés' : 'Specialized GPTs', url: 'https://chat.openai.com/gpts' },
  ];

  const filteredTools = useMemo(() => {
    return allTools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allTools]);

  const toolsByCategory = useMemo(() => {
    return {
      module: filteredTools.filter(t => t.category === 'module'),
      guide: filteredTools.filter(t => t.category === 'guide'),
      activity: filteredTools.filter(t => t.category === 'activity'),
      resource: filteredTools.filter(t => t.category === 'resource'),
      template: filteredTools.filter(t => t.category === 'template'),
    };
  }, [filteredTools]);

  const handleToolClick = (tool: Tool) => {
    if (tool.section && onNavigate) {
      onNavigate(tool.section);
    } else {
      setSelectedTool(tool);
      setModalOpen(true);
    }
  };

  const getStatusLabel = (status?: 'new' | 'updated' | 'coming-soon' | 'active') => {
    if (!status) return '';
    const labels = {
      new: lang === 'fr' ? 'Nouveau' : 'New',
      updated: lang === 'fr' ? 'Mis à jour' : 'Updated',
      'coming-soon': lang === 'fr' ? 'Bientôt' : 'Coming Soon',
      active: lang === 'fr' ? 'Actif' : 'Active'
    };
    return labels[status];
  };

  const renderToolCard = (tool: Tool) => (
    <Card
      key={tool.name}
      className="hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => handleToolClick(tool)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <tool.icon className={`w-8 h-8 ${tool.color} group-hover:scale-110 transition-transform`} />
          {tool.status && (
            <Badge variant={
              tool.status === 'new' ? 'default' :
              tool.status === 'updated' ? 'secondary' :
              tool.status === 'coming-soon' ? 'outline' : 'default'
            }>
              {getStatusLabel(tool.status)}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg mt-2">{tool.name}</CardTitle>
        <CardDescription className="text-sm">{tool.description}</CardDescription>
      </CardHeader>
      {tool.progress !== undefined && (
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{lang === 'fr' ? 'Progression' : 'Progress'}</span>
              <span className="font-medium">{tool.progress}%</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all"
                style={{ width: `${tool.progress}%` }}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => onNavigate?.('vue-ensemble')} className="cursor-pointer flex items-center gap-1">
              <Home className="w-4 h-4" />
              {lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{lang === 'fr' ? 'Outils Pédagogiques' : 'Learning Tools'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          {lang === 'fr' ? 'Outils Pédagogiques' : 'Learning Tools'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {lang === 'fr' 
            ? 'Découvrez nos outils pour optimiser votre apprentissage' 
            : 'Discover our tools to optimize your learning'}
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={lang === 'fr' ? 'Rechercher un outil...' : 'Search for a tool...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredTools.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {lang === 'fr' 
                ? `Aucun outil trouvé pour "${searchQuery}"` 
                : `No tools found for "${searchQuery}"`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {toolsByCategory.module.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Layout className="w-6 h-6 text-primary" />
                {lang === 'fr' ? 'Modules' : 'Modules'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {toolsByCategory.module.map(renderToolCard)}
              </div>
            </section>
          )}

          {toolsByCategory.guide.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <BookMarked className="w-6 h-6 text-primary" />
                {lang === 'fr' ? 'Guides' : 'Guides'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {toolsByCategory.guide.map(renderToolCard)}
              </div>
            </section>
          )}

          {toolsByCategory.activity.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {lang === 'fr' ? 'Activités collaboratives' : 'Collaborative Activities'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {toolsByCategory.activity.map(renderToolCard)}
              </div>
            </section>
          )}

          {toolsByCategory.resource.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FolderOpen className="w-6 h-6 text-primary" />
                {lang === 'fr' ? 'Ressources' : 'Resources'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {toolsByCategory.resource.map(renderToolCard)}
              </div>
            </section>
          )}

          {toolsByCategory.template.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <FileStack className="w-6 h-6 text-primary" />
                {lang === 'fr' ? 'Modèles' : 'Templates'}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {toolsByCategory.template.map(renderToolCard)}
              </div>
            </section>
          )}
        </>
      )}

      <section>
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <ExternalLink className="w-6 h-6 text-primary" />
          {lang === 'fr' ? 'Services externes' : 'External Services'}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {externalServices.map((service) => (
            <Button
              key={service.name}
              variant="outline"
              className="h-auto py-4"
              asChild
            >
              <a href={service.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between">
                <span>{service.name}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          ))}
        </div>
      </section>

      <ToolModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tool={selectedTool}
      />
    </div>
  );
};
