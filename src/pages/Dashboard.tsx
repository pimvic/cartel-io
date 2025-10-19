import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/Overview";
import { KnowledgeBase } from "@/components/dashboard/KnowledgeBase";
import { Calendar } from "@/components/dashboard/Calendar";
import { GroupDiscussion } from "@/components/dashboard/GroupDiscussion";
import { Rules } from "@/components/dashboard/Rules";
import { VotrePlusUn } from "@/components/dashboard/VotrePlusUn";
import { Settings } from "@/components/dashboard/Settings";
import { PedagogicalTools } from "@/components/dashboard/PedagogicalTools";
import { BugReport } from "@/components/dashboard/BugReport";
import { ActuKartel } from "@/components/dashboard/ActuKartel";
import { MessagerieNewsEvents } from "@/components/dashboard/MessagerieNewsEvents";
import { Notes } from "@/components/dashboard/Notes";
import { Visio } from "@/components/dashboard/Visio";
import { Feedback } from "@/components/dashboard/Feedback";
import Quiz from "@/pages/Quiz";
import Flashcards from "@/pages/Flashcards";
import Mindmap from "@/pages/Mindmap";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("actu-kartel");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "actu-kartel":
        return <ActuKartel />;
      case "messagerie-news-events":
        return <MessagerieNewsEvents />;
      case "base-connaissances":
        return <KnowledgeBase />;
      case "outils-pedagogiques":
        return <PedagogicalTools onNavigate={setActiveSection} />;
      case "calendrier":
        return <Calendar />;
      case "votre-plus-un":
        return <VotrePlusUn />;
      case "rules":
        return <Rules />;
      case "vue-ensemble":
        return <Overview />;
      case "notes":
        return <Notes />;
      case "visio":
        return <Visio />;
      case "parametres":
        return <Settings />;
      case "feedback":
        return <Feedback />;
      case "quiz":
        return <Quiz />;
      case "flashcards":
        return <Flashcards />;
      case "mindmap":
        return <Mindmap />;
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
        <main className={`flex-1 p-6 pt-20 transition-all ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
          {renderContent()}
          <BugReport />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
