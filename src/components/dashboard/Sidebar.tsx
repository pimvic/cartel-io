import { Button } from "@/components/ui/button";
import {
  Home,
  BookOpen,
  FileText,
  MessageSquare,
  Wrench,
  Calendar,
  ScrollText,
  Settings as SettingsIcon,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Brain,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar = ({ activeSection, onSectionChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const { lang } = useParams<{ lang: string }>();
  
  const menuItems = [
    { id: "vue-ensemble", label: lang === 'fr' ? 'Vue d\'ensemble' : 'Overview', icon: Home },
    { id: "actu-kartel", label: lang === 'fr' ? 'Actu Kartel' : 'Kartel News', icon: Home },
    { id: "messagerie-news-events", label: lang === 'fr' ? 'Messagerie' : 'Messaging', icon: MessageSquare },
    { id: "base-connaissances", label: lang === 'fr' ? 'Base de connaissances' : 'Knowledge Base', icon: Brain },
    { id: "outils-pedagogiques", label: lang === 'fr' ? 'Outils pédagogiques' : 'Pedagogical Tools', icon: Wrench },
    { id: "calendrier", label: lang === 'fr' ? 'Calendrier' : 'Calendar', icon: Calendar },
    { id: "votre-plus-un", label: lang === 'fr' ? 'Votre +1' : 'Your +1', icon: Users },
    { id: "rules", label: lang === 'fr' ? 'L\'esprit du Kartel' : 'Kartel Spirit', icon: ScrollText },
    { id: "notes", label: lang === 'fr' ? 'Notes' : 'Notes', icon: FileText },
    { id: "visio", label: lang === 'fr' ? 'Visio' : 'Video', icon: Video },
    { id: "parametres", label: lang === 'fr' ? 'Paramètres' : 'Settings', icon: SettingsIcon },
    { id: "feedback", label: lang === 'fr' ? 'Feedback' : 'Feedback', icon: MessageCircle },
  ];
  
  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 transition-colors",
                  activeSection === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-full"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span className="ml-2">{lang === 'fr' ? 'Fermer' : 'Close'}</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};
