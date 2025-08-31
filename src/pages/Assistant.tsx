import React from 'react';
import { UnifiedChat } from '@/components/UnifiedChat';

export default function Assistant() {
  return (
    <div className="h-full bg-gradient-to-br from-background via-background-secondary to-background-tertiary relative">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20 animate-pulse-glow"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-orb opacity-10 rounded-full blur-3xl animate-orb-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="relative h-full">
        {/* Main Content - Full Unified Chat Interface */}
        <div className="flex-1 h-full flex flex-col">
          <UnifiedChat />
        </div>
      </div>
    </div>
  );
}