import React, { useState } from 'react';
import { VoiceOrb } from '@/components/VoiceOrb';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, User, Bot } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { toast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m Kyra, your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orbStatus, setOrbStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('Gemini API key not configured');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `You are Kyra, a futuristic AI assistant inspired by Jarvis. You are helpful, intelligent, and speak in a modern, slightly technical tone. Respond to: "${content}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: text,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m experiencing technical difficulties. Please ensure your Gemini API key is configured correctly.',
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to get AI response. Please check your API configuration.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-background via-background-secondary to-background-tertiary relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-glow opacity-20 animate-pulse-glow"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-orb opacity-10 rounded-full blur-3xl animate-orb-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-primary opacity-10 rounded-full blur-2xl animate-pulse"></div>
      
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-border/30 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-primary">
              Kyra AI Assistant
            </h1>
            <p className="text-muted-foreground mt-1">
              Voice & Chat Interface • Status: {orbStatus}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Voice Orb Section */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <VoiceOrb onStatusChange={setOrbStatus} />
              
              <Card className="p-6 bg-glass/30 border-glass-border/50 backdrop-blur-sm max-w-md w-full">
                <h3 className="text-lg font-semibold text-center text-foreground mb-3">
                  Voice Commands
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• "What's the weather like?"</p>
                  <p>• "Show me my calendar"</p>
                  <p>• "Set a reminder for 3 PM"</p>
                  <p>• "Play some music"</p>
                  <p>• "How's my system performance?"</p>
                </div>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="flex flex-col h-[600px] max-h-[600px]">
              <Card className="flex-1 flex flex-col bg-glass/20 border-glass-border/50 backdrop-blur-sm">
                <div className="p-4 border-b border-border/30">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-primary" />
                    Chat with Kyra
                  </h3>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
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
                            <div className="flex-1">
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-secondary/50 text-secondary-foreground border border-border/30 rounded-lg px-4 py-2">
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
                </ScrollArea>
                
                <div className="p-4 border-t border-border/30">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}