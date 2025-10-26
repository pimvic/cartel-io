import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Mindmap from "./pages/Mindmap";
import Glossaire from "./pages/Glossaire";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const LanguageRedirect = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferredLocale');
    const browserLang = navigator.language.split('-')[0];
    const targetLang = savedLocale || (browserLang === 'fr' ? 'fr' : 'en');
    
    i18n.changeLanguage(targetLang);
    navigate(`/${targetLang}${location.pathname}`, { replace: true });
  }, []);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanguageRedirect />} />
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

export default App;
