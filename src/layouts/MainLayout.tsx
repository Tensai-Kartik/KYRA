import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { WidgetPanel } from '@/components/WidgetPanel';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isAssistantPage = location.pathname === '/';

  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 flex-shrink-0">
        <Navigation />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-20">
        <main className={`flex-1 ${isAssistantPage ? '' : 'overflow-y-auto'}`}>
          <Outlet />
        </main>
      </div>
      
      {/* Right Sidebar - Widgets */}
      <div className="w-80 flex-shrink-0 border-l border-border/30 bg-background-secondary/20 backdrop-blur-sm relative z-0">
        <WidgetPanel />
      </div>
    </div>
  );
};