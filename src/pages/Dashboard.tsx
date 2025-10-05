import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Overview } from "@/components/dashboard/Overview";
import { KnowledgeBase } from "@/components/dashboard/KnowledgeBase";
import { Calendar } from "@/components/dashboard/Calendar";
import { GroupDiscussion } from "@/components/dashboard/GroupDiscussion";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("vue-ensemble");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "vue-ensemble":
        return <Overview />;
      case "base-connaissances":
        return <KnowledgeBase />;
      case "calendrier":
        return <Calendar />;
      case "discussion":
        return <GroupDiscussion />;
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
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
