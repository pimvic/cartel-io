/**
 * Main Application Component
 * 
 * Root component that sets up routing, authentication, and global providers.
 * Handles internationalization (i18n) with English and French support.
 * 
 * @module App
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Flashcards from "./pages/Flashcards";
import Mindmap from "./pages/Mindmap";
import Glossaire from "./pages/Glossaire";
import NotFound from "./pages/NotFound";

/**
 * React Query client instance
 * Handles server state management and caching
 */
const queryClient = new QueryClient();

/**
 * Determines user's preferred language from localStorage or browser settings
 * 
 * @returns Language code ('en' or 'fr')
 */
const getPreferredLanguage = (): 'en' | 'fr' => {
  const savedLocale = localStorage.getItem('preferredLocale');
  if (savedLocale && (savedLocale === 'en' || savedLocale === 'fr')) {
    return savedLocale as 'en' | 'fr';
  }
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'fr' ? 'fr' : 'en';
};

/**
 * App Component
 * 
 * Main application component that configures:
 * - React Query for server state
 * - React Router for navigation
 * - Authentication context
 * - Toast notifications
 * - Tooltip system
 * - Protected routes
 */
const App = () => {
  const preferredLang = getPreferredLanguage();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to={`/${preferredLang}`} replace />} />
              <Route path="/:lang" element={<Landing />} />
              <Route path="/:lang/login" element={<Login />} />
              <Route path="/:lang/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/:lang/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
              <Route path="/:lang/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
              <Route path="/:lang/mindmap" element={<ProtectedRoute><Mindmap /></ProtectedRoute>} />
              <Route path="/:lang/glossaire" element={<ProtectedRoute><Glossaire /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
