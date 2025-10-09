import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/Overview";
import { KnowledgeBase } from "@/components/dashboard/KnowledgeBase";
import { Calendar } from "@/components/dashboard/Calendar";
import { GroupDiscussion } from "@/components/dashboard/GroupDiscussion";
import { NotesCommunes } from "@/components/dashboard/NotesCommunes";
import { Rules } from "@/components/dashboard/Rules";
import { KBChat } from "@/components/dashboard/KBChat";
import { Settings } from "@/components/dashboard/Settings";
import { PedagogicalTools } from "@/components/dashboard/PedagogicalTools";
import { BugReport } from "@/components/dashboard/BugReport";
import { NewsNotesTasks } from "@/components/dashboard/NewsNotesTasks";
import Flashcards from "@/pages/Flashcards";
import QCM from "@/pages/QCM";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("vue-ensemble");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "vue-ensemble":
        return <Overview />;
      case "news-notes-taches":
        return <NewsNotesTasks />;
      case "base-connaissances":
        return <KnowledgeBase />;
      case "flashcards":
        return <Flashcards />;
      case "qcm":
        return <QCM />;
      case "calendrier":
        return <Calendar />;
      case "discussion":
        return <GroupDiscussion />;
      case "notes-communes":
        return <NotesCommunes />;
      case "rules":
        return <Rules />;
      case "kb-chat":
        return <KBChat />;
      case "parametres":
        return <Settings />;
      case "outils-pedagogiques":
        return <PedagogicalTools />;
      case "feedback":
        return <BugReport />;
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <p className="text-muted-foreground">Section en cours de développement...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className={`flex-1 p-6 transition-all ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
          {renderContent()}
          <BugReport />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
