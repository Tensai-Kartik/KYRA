import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MessageCircle, 
  Activity, 
  Cloud, 
  Calendar, 
  Music, 
  Shield,
  StickyNote,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';
import kyraLogo from '@/assets/kyra.png';

const navigationItems = [
  {
    title: 'Assistant',
    href: '/',
    icon: MessageCircle,
    description: 'Voice & Chat Interface'
  },
  {
    title: 'System',
    href: '/system',
    icon: Activity,
    description: 'Performance Monitor'
  },
  {
    title: 'Weather',
    href: '/weather',
    icon: Cloud,
    description: 'Weather Information'
  },
  {
    title: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    description: 'Schedule & Events'
  },
  {
    title: 'Music',
    href: '/music',
    icon: Music,
    description: 'Media Controls'
  },
  {
    title: 'Security',
    href: '/security',
    icon: Shield,
    description: 'Security Status'
  },
  {
    title: 'Notes',
    href: '/notes',
    icon: StickyNote,
    description: 'Notes & Tasks'
  },
  {
    title: 'Reminders',
    href: '/reminders',
    icon: Bell,
    description: 'Alerts & Reminders'
  }
];

export const Navigation: React.FC = () => {
  return (
    <nav className="h-full bg-sidebar border-r border-sidebar-border backdrop-blur-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-orb p-1 animate-pulse-glow">
              <img 
                src={kyraLogo} 
                alt="Kyra AI" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-sidebar-foreground">Kyra</h1>
              <p className="text-xs text-sidebar-foreground/60">AI Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-2 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent/50 hover:shadow-glow-sm",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-glow"
                      : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
                  )
                }
                end={item.href === '/'}
              >
                {({ isActive }) => (
                  <>
                    <Icon 
                      className={cn(
                        "w-5 h-5 transition-colors",
                        isActive 
                          ? "text-sidebar-primary-foreground" 
                          : "text-sidebar-foreground/60 group-hover:text-primary"
                      )} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {item.title}
                      </div>
                      <div className={cn(
                        "text-xs opacity-0 group-hover:opacity-70 transition-opacity",
                        isActive && "opacity-50"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/50 text-center">
            Powered by Gemini AI
          </div>
        </div>
      </div>
    </nav>
  );
};