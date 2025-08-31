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
          {/* Feedback Section */}
          <div className="mb-3 text-center">
            <button
              onClick={() => {
                console.log('Feedback button clicked!');
                try {
                  // Try the mailto approach first
                  const mailtoLink = 'mailto:kartikvarunsharma2005@gmail.com?subject=KYRA Feedback';
                  console.log('Attempting to open:', mailtoLink);
                  
                  // Method 1: Direct window.location
                  window.location.href = mailtoLink;
                  
                  // Method 2: Fallback - open Gmail compose
                  setTimeout(() => {
                    const gmailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=kartikvarunsharma2005@gmail.com&su=KYRA Feedback';
                    window.open(gmailLink, '_blank');
                  }, 1000);
                  
                } catch (error) {
                  console.error('Error opening email:', error);
                  // Fallback to Gmail
                  const gmailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=kartikvarunsharma2005@gmail.com&su=KYRA Feedback';
                  window.open(gmailLink, '_blank');
                }
              }}
              className="inline-flex items-center space-x-2 text-xs text-sidebar-foreground/60 hover:text-primary transition-colors duration-200 hover:underline cursor-pointer px-2 py-1 rounded hover:bg-sidebar-accent/30"
              title="Send feedback via email"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Send Feedback</span>
            </button>
          </div>
          
          <div className="text-xs text-sidebar-foreground/50 text-center">
            Made By Kartik Sharma
          </div>
        </div>
      </div>
    </nav>
  );
};