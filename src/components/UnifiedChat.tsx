import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, User, Bot, Volume2, Settings, Trash2, Download, Upload, MoreVertical } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from '@/components/ui/use-toast';
import { VoiceOrb } from './VoiceOrb';
import { VoiceSettings, VoiceSettingsState } from './VoiceSettings';
import { useChatStorage, Message, ChatSession } from '@/hooks/useChatStorage';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const defaultVoiceSettings: VoiceSettingsState = {
  wakeWords: ['kyra', 'hey kyra', 'hello kyra'],
  continuousListening: false,
  language: 'en-US',
  confidenceThreshold: 0.7,
  ttsRate: 0.9,
  ttsPitch: 1.1,
  ttsVolume: 0.8,
  ttsVoice: '',
  autoSpeak: true,
  soundEffects: true,
};

export const UnifiedChat: React.FC = () => {
  const {
    sessions,
    isLoaded,
    createSession,
    updateSession,
    addMessage,
    deleteSession,
    clearAllSessions,
    exportSessions,
    importSessions
  } = useChatStorage();
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orbStatus, setOrbStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettingsState>(defaultVoiceSettings);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize chat session
  useEffect(() => {
    if (isLoaded && sessions.length === 0) {
      const initialSession = createSession();
      setCurrentSessionId(initialSession.id);
    } else if (isLoaded && sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [isLoaded, sessions, currentSessionId, createSession]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    };
    
    scrollToBottom();
    const timeoutId = setTimeout(scrollToBottom, 50);
    
    return () => clearTimeout(timeoutId);
  }, [sessions, currentSessionId]);

  // Get current session
  const currentSession = sessions.find(s => s.id === currentSessionId);

  // Create new chat session
  const handleCreateNewSession = () => {
    const newSession = createSession();
    setCurrentSessionId(newSession.id);
    setInputValue('');
  };

  // Delete chat session
  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
    if (currentSessionId === sessionId) {
      if (sessions.length > 1) {
        const remainingSessions = sessions.filter(s => s.id !== sessionId);
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        handleCreateNewSession();
      }
    }
  };

  // Update session title based on first user message
  const updateSessionTitle = (sessionId: string, firstUserMessage: string) => {
    updateSession(sessionId, {
      title: firstUserMessage.slice(0, 50) + (firstUserMessage.length > 50 ? '...' : '')
    });
  };



  // Handle file import
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await importSessions(file);
        toast({
          title: "Import Successful",
          description: "Chat sessions have been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Failed to import chat sessions. Please check the file format.",
          variant: "destructive"
        });
      }
    }
  };

  // Send text message (separate from voice)
  const sendTextMessage = async (content: string) => {
    if (!content.trim() || !currentSession) return;

    console.log('UnifiedChat: sendTextMessage called with:', { content, sessionId: currentSessionId });

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
      isVoice: false
    };

    // Add user message to session
    addMessage(currentSessionId!, userMessage);
    console.log('UnifiedChat: Text message added to session');

    // Update title if this is the first user message
    if (currentSession.messages.filter(m => m.role === 'user').length === 0) {
      updateSessionTitle(currentSessionId!, content.trim());
    }

    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('UnifiedChat Debug: API Key length:', apiKey ? apiKey.length : 'undefined');
      console.log('UnifiedChat Debug: API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
      
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      
      // Get conversation history for context (only text messages)
      const textConversationHistory = currentSession.messages
        .filter(m => !m.isVoice) // Only include text messages
        .map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));
      
      console.log('UnifiedChat Debug: Text conversation history length:', textConversationHistory.length);
      console.log('UnifiedChat Debug: Sending text to Gemini:', content.trim());
      
      const prompt = `You are Kyra, a helpful AI assistant. Previous text conversation context: ${textConversationHistory.map(m => `${m.role}: ${m.parts[0].text}`).join('\n')}\n\nUser: ${content.trim()}\n\nKyra:`;
      
      console.log('UnifiedChat Debug: Sending text prompt to Gemini...');
      
      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      
      console.log('UnifiedChat Debug: Received text response from Gemini:', text);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: text,
        role: 'assistant',
        timestamp: new Date(),
        isVoice: false
      };

      // Add AI response to session
      addMessage(currentSessionId!, assistantMessage);
      console.log('UnifiedChat Debug: Text assistant message added to session');

    } catch (error) {
      console.error('UnifiedChat Error sending text message:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I'm experiencing technical difficulties. Error: ${error.message}`,
        role: 'assistant',
        timestamp: new Date(),
        isVoice: false
      };

      addMessage(currentSessionId!, errorMessage);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to AI service. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };



  // Handle voice settings change
  const handleVoiceSettingsChange = (newSettings: VoiceSettingsState) => {
    setVoiceSettings(newSettings);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendTextMessage(inputValue);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage(inputValue);
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
        {/* Sidebar - Chat Sessions */}
        <div className="w-80 bg-glass/20 border-r border-border/30 backdrop-blur-sm flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border/30">
            <Button 
              onClick={handleCreateNewSession}
              className="w-full bg-primary/20 hover:bg-primary/30 border border-primary/30"
            >
              + New Chat
            </Button>
            
            {/* Settings and Import/Export */}
            <div className="mt-3 flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => setShowVoiceSettings(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Voice
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MoreVertical className="w-4 h-4" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={exportSessions}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Chats
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Chats
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={clearAllSessions} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Chats
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Hidden file input for import */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
          </div>

          {/* Sessions List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                    currentSessionId === session.id
                      ? 'bg-primary/20 border border-primary/30'
                      : 'hover:bg-glass/30 border border-transparent'
                  }`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.updatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative z-50 min-w-0 overflow-hidden" style={{ zIndex: 9999 }}>
          {/* Header */}
          <div className="flex-shrink-0 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-primary">
                  Kyra AI Assistant
                </h1>
                <p className="text-muted-foreground text-sm">
                  Voice & Chat Interface • Status: {orbStatus}
                </p>
              </div>
              
              {/* Voice Orb */}
              <div className="flex items-center pb-6">
                <VoiceOrb 
                  onStatusChange={setOrbStatus}
                />
              </div>
              
              {/* Separator Line */}
              <div className="border-t border-border/30 mx-4 mt-4" />
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col min-h-0 mt-16">
            <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-450px)]">
              <div className="space-y-4 pb-4">
                {currentSession?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 break-words ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary/50 text-secondary-foreground border border-border/30'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        )}
                        {message.role === 'user' && (
                          <User className="w-4 h-4 text-primary-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center gap-2 mb-2 w-full">
                            {message.isVoice && (
                              <Volume2 className="w-3 h-3 text-muted-foreground" />
                            )}
                            <p className="text-sm leading-relaxed break-words whitespace-pre-wrap w-full">{message.content}</p>
                          </div>
                          <p className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {message.isVoice && ' • Voice'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/50 text-secondary-foreground border border-border/30 rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>
            
            {/* Input Area */}
            <div className="p-6 border-t border-border/30 bg-background sticky bottom-0 shadow-lg min-h-[80px] mt-auto">
              <form onSubmit={handleSubmit} className="flex space-x-2 max-w-full">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or use voice commands..."
                  className="flex-1 bg-background-secondary/50 border-input-border"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-primary/20 hover:bg-primary/30 border border-primary/30"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Voice Settings Modal */}
        <VoiceSettings
          isOpen={showVoiceSettings}
          onClose={() => setShowVoiceSettings(false)}
          onSettingsChange={handleVoiceSettingsChange}
          currentSettings={voiceSettings}
        />
      </div>
  );
};

export default UnifiedChat;
