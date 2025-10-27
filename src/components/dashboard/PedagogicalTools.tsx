import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Brain, Map, CreditCard, BarChart3, Video, MessageCircle, Lightbulb, Users, FileText, BookOpen, UserCheck, Film, Target, Puzzle, Layout, RotateCw, Bot, Trophy, ThumbsUp, PartyPopper, ArrowRight, Book } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PedagogicalToolsProps {
  onNavigate?: (section: string) => void;
}

export const PedagogicalTools = ({ onNavigate }: PedagogicalToolsProps) => {
  const { t } = useTranslation();
  
  const mainTools = [
    { name: t('dashboard.tools.quiz.title'), description: t('dashboard.tools.quiz.description'), icon: Brain, color: "text-blue-500", section: "quiz" },
    { name: t('dashboard.tools.flashcards.title'), description: t('dashboard.tools.flashcards.description'), icon: CreditCard, color: "text-green-500", section: "flashcards" },
    { name: t('dashboard.tools.mindmap.title'), description: t('dashboard.tools.mindmap.description'), icon: Map, color: "text-purple-500", section: "mindmap" },
    { name: t('dashboard.tools.glossary.title'), description: t('dashboard.tools.glossary.description'), icon: Book, color: "text-indigo-500", section: "glossaire" },
  ];

  const tools = [
    { name: t('dashboard.tools.otherTools.progressBoard.name'), description: t('dashboard.tools.otherTools.progressBoard.description'), icon: BarChart3, color: "text-orange-500" },
    { name: t('dashboard.tools.otherTools.rolePlaying.name'), description: t('dashboard.tools.otherTools.rolePlaying.description'), icon: Video, color: "text-red-500" },
    { name: t('dashboard.tools.otherTools.debriefing.name'), description: t('dashboard.tools.otherTools.debriefing.description'), icon: MessageCircle, color: "text-cyan-500" },
    { name: t('dashboard.tools.otherTools.brainstorming.name'), description: t('dashboard.tools.otherTools.brainstorming.description'), icon: Lightbulb, color: "text-yellow-500" },
    { name: t('dashboard.tools.otherTools.debate.name'), description: t('dashboard.tools.otherTools.debate.description'), icon: Users, color: "text-pink-500" },
    { name: t('dashboard.tools.otherTools.knowledgeSheet.name'), description: t('dashboard.tools.otherTools.knowledgeSheet.description'), icon: FileText, color: "text-indigo-500" },
    { name: t('dashboard.tools.otherTools.learningJournal.name'), description: t('dashboard.tools.otherTools.learningJournal.description'), icon: BookOpen, color: "text-teal-500" },
    { name: t('dashboard.tools.otherTools.peerEvaluation.name'), description: t('dashboard.tools.otherTools.peerEvaluation.description'), icon: UserCheck, color: "text-lime-500" },
    { name: t('dashboard.tools.otherTools.interactiveVideo.name'), description: t('dashboard.tools.otherTools.interactiveVideo.description'), icon: Film, color: "text-amber-500" },
    { name: t('dashboard.tools.otherTools.groupMission.name'), description: t('dashboard.tools.otherTools.groupMission.description'), icon: Target, color: "text-rose-500" },
    { name: t('dashboard.tools.otherTools.crossSkills.name'), description: t('dashboard.tools.otherTools.crossSkills.description'), icon: Puzzle, color: "text-violet-500" },
    { name: t('dashboard.tools.otherTools.ideaWall.name'), description: t('dashboard.tools.otherTools.ideaWall.description'), icon: Layout, color: "text-sky-500" },
    { name: t('dashboard.tools.otherTools.motivationWheel.name'), description: t('dashboard.tools.otherTools.motivationWheel.description'), icon: RotateCw, color: "text-emerald-500" },
    { name: t('dashboard.tools.otherTools.aiSummary.name'), description: t('dashboard.tools.otherTools.aiSummary.description'), icon: Bot, color: "text-fuchsia-500" },
    { name: t('dashboard.tools.otherTools.challenge.name'), description: t('dashboard.tools.otherTools.challenge.description'), icon: Trophy, color: "text-yellow-600" },
    { name: t('dashboard.tools.otherTools.instantFeedback.name'), description: t('dashboard.tools.otherTools.instantFeedback.description'), icon: ThumbsUp, color: "text-blue-600" },
    { name: t('dashboard.tools.otherTools.celebration.name'), description: t('dashboard.tools.otherTools.celebration.description'), icon: PartyPopper, color: "text-pink-600" },
  ];

  const externalServices = [
    { name: t('dashboard.tools.externalServices.openai'), url: "https://openai.com" },
    { name: t('dashboard.tools.externalServices.notebooklm'), url: "https://notebooklm.google.com" },
    { name: t('dashboard.tools.externalServices.specializedGPTs'), url: "https://chat.openai.com/gpts" },
  ];

  return (
    <div className="space-y-6">
      <div className="pt-2">
        <p className="text-muted-foreground text-[110%]">{t('dashboard.tools.subtitle')}</p>
      </div>

      <Card className="relative">
        <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
        <CardHeader>
          <CardTitle>{t('dashboard.tools.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {mainTools.map((tool, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all cursor-pointer relative group"
                onClick={() => onNavigate?.(tool.section)}
              >
                <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                  <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {t('dashboard.tools.access')}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">{t('dashboard.tools.otherTools.title')}</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {tools.map((tool, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative">
                <div className="absolute top-2 left-2 w-3 h-3 bg-accent/20 rounded cursor-move" title="Déplaçable" />
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    {tool.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.tools.externalServices.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {externalServices.map((service, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-between"
                onClick={() => window.open(service.url, "_blank")}
              >
                {service.name}
                <ExternalLink className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
