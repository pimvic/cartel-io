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
import { useTranslation } from "react-i18next";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar = ({ activeSection, onSectionChange, collapsed, onToggleCollapse }: SidebarProps) => {
  const { t } = useTranslation();
  
  const menuItems = [
    { id: "vue-ensemble", label: t('dashboard.menu.overview'), icon: Home },
    { id: "actu-kartel", label: t('dashboard.menu.actuKartel'), icon: Home },
    { id: "messagerie-news-events", label: t('dashboard.menu.messagerie'), icon: MessageSquare },
    { id: "base-connaissances", label: t('dashboard.menu.knowledgeBase'), icon: Brain },
    { id: "outils-pedagogiques", label: t('dashboard.menu.tools'), icon: Wrench },
    { id: "calendrier", label: t('dashboard.menu.calendar'), icon: Calendar },
    { id: "votre-plus-un", label: t('dashboard.menu.plusOne'), icon: Users },
    { id: "rules", label: t('dashboard.menu.rules'), icon: ScrollText },
    { id: "notes", label: t('dashboard.menu.notes'), icon: FileText },
    { id: "visio", label: t('dashboard.menu.visio'), icon: Video },
    { id: "parametres", label: t('dashboard.menu.settings'), icon: SettingsIcon },
    { id: "feedback", label: t('dashboard.menu.feedback'), icon: MessageCircle },
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
            {!collapsed && <span className="ml-2">{t('common.close')}</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};
