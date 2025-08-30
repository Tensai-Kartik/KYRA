import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import Assistant from "./pages/Assistant";
import NotFound from "./pages/NotFound";

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
            <Route path="system" element={<div className="p-8 text-center text-muted-foreground">System Monitor - Coming Soon</div>} />
            <Route path="weather" element={<div className="p-8 text-center text-muted-foreground">Weather - Coming Soon</div>} />
            <Route path="calendar" element={<div className="p-8 text-center text-muted-foreground">Calendar - Coming Soon</div>} />
            <Route path="music" element={<div className="p-8 text-center text-muted-foreground">Music Controls - Coming Soon</div>} />
            <Route path="security" element={<div className="p-8 text-center text-muted-foreground">Security Status - Coming Soon</div>} />
            <Route path="notes" element={<div className="p-8 text-center text-muted-foreground">Notes & Tasks - Coming Soon</div>} />
            <Route path="reminders" element={<div className="p-8 text-center text-muted-foreground">Reminders - Coming Soon</div>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
