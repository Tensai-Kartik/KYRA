import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Assistant from "./pages/Assistant";
import System from "./pages/System";
import Weather from "./pages/Weather";
import Calendar from "./pages/Calendar";
import Music from "./pages/Music";
import Security from "./pages/Security";
import Notes from "./pages/Notes";
import Reminders from "./pages/Reminders";
import NotFound from "./pages/NotFound";

// Debug: Check if environment variables are loaded
console.log('App Debug: Environment check');
console.log('App Debug: VITE_GEMINI_API_KEY exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
console.log('App Debug: VITE_GEMINI_API_KEY length:', import.meta.env.VITE_GEMINI_API_KEY ? import.meta.env.VITE_GEMINI_API_KEY.length : 'undefined');

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Assistant />} />
            <Route path="system" element={<System />} />
            <Route path="weather" element={<Weather />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="music" element={<Music />} />
            <Route path="security" element={<Security />} />
            <Route path="notes" element={<Notes />} />
            <Route path="reminders" element={<Reminders />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
