import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { WidgetPanel } from '@/components/WidgetPanel';

export const MainLayout: React.FC = () => {
  return (
    <div className="h-screen w-full bg-background flex overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <div className="w-64 flex-shrink-0">
        <Navigation />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
      
      {/* Right Sidebar - Widgets */}
      <div className="w-80 flex-shrink-0 border-l border-border/30 bg-background-secondary/20 backdrop-blur-sm">
        <WidgetPanel />
      </div>
    </div>
  );
};