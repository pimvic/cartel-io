import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Mindmap from "./pages/Mindmap";
import Glossaire from "./pages/Glossaire";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Helper function to get preferred language
const getPreferredLanguage = () => {
  const savedLocale = localStorage.getItem('preferredLocale');
  if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
    return savedLocale;
  }
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'fr' ? 'fr' : 'en';
};

const App = () => {
  const preferredLang = getPreferredLanguage();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={`/${preferredLang}`} replace />} />
            <Route path="/:lang" element={<Landing />} />
            <Route path="/:lang/login" element={<Login />} />
            <Route path="/:lang/dashboard" element={<Dashboard />} />
            <Route path="/:lang/quiz" element={<Quiz />} />
            <Route path="/:lang/flashcards" element={<Flashcards />} />
            <Route path="/:lang/mindmap" element={<Mindmap />} />
            <Route path="/:lang/glossaire" element={<Glossaire />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
