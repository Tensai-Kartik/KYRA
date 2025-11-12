import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { GoogleGenerativeAI } from '@google/generative-ai';

import kyraLogo from '@/assets/kyra.png';

interface VoiceOrbProps {
  onStatusChange?: (status: 'idle' | 'listening' | 'processing' | 'speaking') => void;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({ onStatusChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechQueueRef = useRef<string[]>([]);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    synthesisRef.current = window.speechSynthesis;

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionClass();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
          onStatusChange?.('listening');
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (!isProcessing && !isSpeakingRef.current) {
            onStatusChange?.('idle');
          }
        };
        
        recognitionRef.current.onresult = async (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Voice input:', transcript);
          
          setIsProcessing(true);
          onStatusChange?.('processing');
          
          try {
            await processUserInput(transcript);
          } catch (error) {
            console.error('Error processing input:', error);
            toast({
              title: "Processing Error",
              description: "Failed to process your voice input.",
              variant: "destructive"
            });
          } finally {
            setIsProcessing(false);
            if (!isSpeakingRef.current) {
              onStatusChange?.('idle');
            }
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setIsProcessing(false);
          onStatusChange?.('idle');
          
          if (event.error === 'not-allowed') {
            setHasPermission(false);
            toast({
              title: "Microphone Access Denied",
              description: "Please allow microphone access to use voice features.",
              variant: "destructive"
            });
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      if (synthesisRef.current) synthesisRef.current.cancel();
    };
  }, [onStatusChange]);

  // ✅ Updated function with retry logic and lighter model
  const processUserInput = async (input: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      speak("I need a Gemini API key to process your request. Please set the VITE_GEMINI_API_KEY environment variable.");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" }); // switched model for reliability
      
      const prompt = `You are Kyra, a futuristic AI assistant inspired by Jarvis. Respond concisely and helpfully to: "${input}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('AI Response:', text);
      await speak(text);
      
    } catch (error: any) {
      console.error('Gemini API error:', error);

      // ✅ Retry on 503 overload
      if (error.message?.includes("503") || error.toString().includes("503")) {
        speak("The server is busy right now. Retrying in a few seconds...");
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
          const retryModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
          const retryPrompt = `You are Kyra, a futuristic AI assistant inspired by Jarvis. Respond concisely and helpfully to: "${input}"`;
          const retryResult = await retryModel.generateContent(retryPrompt);
          const retryText = retryResult.response.text();
          await speak(retryText);
        } catch (retryError) {
          console.error("Retry failed:", retryError);
          speak("Still no response. Please try again later.");
        }
        return;
      }

      speak("I'm experiencing technical difficulties. Please try again later.");
    }
  };

  const speak = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      console.log('Speech: Attempting to speak:', text);

      if (!synthesisRef.current) {
        console.error('Speech: Synthesis not available');
        resolve();
        return;
      }

      if (isSpeakingRef.current) {
        console.log('Speech: Already speaking, adding to queue');
        speechQueueRef.current.push(text);
        resolve();
        return;
      }

      synthesisRef.current.cancel();

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        currentUtteranceRef.current = utterance;
        
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;

        utterance.onstart = () => {
          setIsSpeaking(true);
          isSpeakingRef.current = true;
          setIsProcessing(false);
          onStatusChange?.('speaking');
          if (recognitionRef.current && isListening) recognitionRef.current.stop();
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          currentUtteranceRef.current = null;
          setIsProcessing(false);
          onStatusChange?.('idle');
          if (speechQueueRef.current.length > 0) {
            const nextText = speechQueueRef.current.shift();
            if (nextText) setTimeout(() => speak(nextText), 200);
          }
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('Speech: Error occurred:', event);
          setIsSpeaking(false);
          isSpeakingRef.current = false;
          currentUtteranceRef.current = null;
          setIsProcessing(false);
          onStatusChange?.('idle');
          if (speechQueueRef.current.length > 0) {
            const nextText = speechQueueRef.current.shift();
            if (nextText) setTimeout(() => speak(nextText), 300);
          }
          resolve();
        };

        if (synthesisRef.current.paused) synthesisRef.current.resume();
        synthesisRef.current.speak(utterance);
      }, 300);
    });
  };

  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      toast({
        title: "Microphone Access Granted",
        description: "You can now use voice commands.",
      });
    } catch (error) {
      setHasPermission(false);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive"
      });
    }
  };

  const toggleListening = async () => {
    if (isSpeakingRef.current) {
      stopSpeaking();
      return;
    }

    if (hasPermission === null || hasPermission === false) {
      await requestMicrophonePermission();
      return;
    }

    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Unavailable",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) recognitionRef.current.stop();
    else if (!isProcessing) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) recognitionRef.current.stop();
  };

  const stopSpeaking = () => {
    if (synthesisRef.current && isSpeakingRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
      currentUtteranceRef.current = null;
      setIsProcessing(false);
      speechQueueRef.current = [];
      onStatusChange?.('idle');
    }
  };

  const clearSpeechQueue = () => {
    speechQueueRef.current = [];
  };

  const getOrbState = () => {
    if (isSpeaking) return 'speaking';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const getOrbClasses = () => {
    const baseClasses = "relative w-48 h-48 rounded-full transition-all duration-300 cursor-pointer";
    const state = getOrbState();
    
    switch (state) {
      case 'listening':
        return `${baseClasses} animate-pulse-glow bg-gradient-orb shadow-glow-lg`;
      case 'processing':
        return `${baseClasses} animate-orb-pulse bg-gradient-primary shadow-glow`;
      case 'speaking':
        return `${baseClasses} animate-voice-react bg-gradient-orb shadow-glow-lg`;
      default:
        return `${baseClasses} bg-gradient-glow shadow-hologram hover:shadow-glow`;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 relative">
      <div 
        className={getOrbClasses()}
        onClick={toggleListening}
        role="button"
        tabIndex={0}
        aria-label="Voice assistant orb"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleListening();
          }
        }}
      >
        <div className="absolute inset-4 rounded-full bg-background-secondary/20 flex items-center justify-center backdrop-blur-sm border border-glass-border/30">
          <img 
            src={kyraLogo} 
            alt="Kyra AI Assistant" 
            className="w-20 h-20 object-contain opacity-90 animate-hologram-flicker"
          />
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-30" />
      </div>

      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        {isListening && (
          <>
            <Mic className="w-4 h-4 text-primary animate-pulse" />
            <span>Listening...</span>
          </>
        )}
        {isProcessing && (
          <>
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        )}
        {isSpeaking && (
          <>
            <Volume2 className="w-4 h-4 text-accent animate-pulse" />
            <span>
              Speaking...
              {speechQueueRef.current.length > 0 && (
                <span className="ml-1 text-xs text-muted-foreground">
                  (+{speechQueueRef.current.length} queued)
                </span>
              )}
            </span>
          </>
        )}
        {getOrbState() === 'idle' && (
          <>
            <MicOff className="w-4 h-4" />
            <span>Click the orb to let magic begin</span>
          </>
        )}
      </div>

      {isListening && (
        <Button
          variant="destructive"
          size="sm"
          onClick={stopListening}
          className="animate-pulse absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          Stop Listening
        </Button>
      )}

      {isSpeaking && (
        <div className="flex flex-col items-center space-y-2 absolute -bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            variant="destructive"
            size="sm"
            onClick={stopSpeaking}
            className="animate-pulse"
          >
            Stop Speaking
          </Button>
          {speechQueueRef.current.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearSpeechQueue}
              className="text-xs"
            >
              Clear Queue ({speechQueueRef.current.length})
            </Button>
          )}
        </div>
      )}

      {hasPermission === false && (
        <Button 
          onClick={requestMicrophonePermission}
          variant="outline"
          className="border-border-glow bg-glass/50 hover:bg-glass/70"
        >
          Grant Microphone Access
        </Button>
      )}
    </div>
  );
};
