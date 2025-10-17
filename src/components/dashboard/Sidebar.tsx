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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: "actu-kartel", label: "L'Actu du Kartel", icon: Home },
  { id: "messagerie-news-events", label: "Communications", icon: MessageSquare },
  { id: "base-connaissances", label: "Base de Connaissances AI", icon: Brain },
  { id: "outils-pedagogiques", label: "Outils Pédagogiques", icon: Wrench },
  { id: "calendrier", label: "Agenda", icon: Calendar },
  { id: "votre-plus-un", label: "Votre +1", icon: Users },
  { id: "rules", label: "L'Esprit du Kartel", icon: ScrollText },
  { id: "vue-ensemble", label: "Statistiques", icon: Home },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "visio", label: "Visio", icon: MessageCircle },
  { id: "parametres", label: "Paramètres", icon: SettingsIcon },
  { id: "feedback", label: "Feedback", icon: MessageCircle },
];

export const Sidebar = ({ activeSection, onSectionChange, collapsed, onToggleCollapse }: SidebarProps) => {
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
            {!collapsed && <span className="ml-2">Réduire</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};
