export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}

export interface TTSOptions {
  text: string;
  settings?: Partial<VoiceSettings>;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private defaultSettings: VoiceSettings = {
    rate: 0.9,
    pitch: 1.1,
    volume: 0.8
  };

  constructor() {
    this.initializeSynthesis();
  }

  private initializeSynthesis() {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      
      // Wait for voices to load
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = () => {
          console.log('Voices loaded:', this.synthesis?.getVoices().length);
        };
      }
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    
    const voices = this.synthesis.getVoices();
    // Filter for English voices and sort by name
    return voices
      .filter(voice => voice.lang.startsWith('en'))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public getDefaultVoice(): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices();
    // Prefer female voices for assistant
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria')
    );
    
    return femaleVoice || voices[0];
  }

  public async speak(options: TTSOptions): Promise<void> {
    if (!this.synthesis) {
      options.onError?.('Speech synthesis not supported');
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        // Cancel any ongoing speech
        this.stop();
        
        const utterance = new SpeechSynthesisUtterance(options.text);
        const settings = { ...this.defaultSettings, ...options.settings };
        
        // Apply voice settings
        utterance.rate = settings.rate;
        utterance.pitch = settings.pitch;
        utterance.volume = settings.volume;
        
        // Set voice if specified, otherwise use default
        if (settings.voice) {
          utterance.voice = settings.voice;
        } else {
          const defaultVoice = this.getDefaultVoice();
          if (defaultVoice) {
            utterance.voice = defaultVoice;
          }
        }

        // Set event handlers
        utterance.onstart = () => {
          this.currentUtterance = utterance;
          options.onStart?.();
        };
        
        utterance.onend = () => {
          this.currentUtterance = null;
          options.onEnd?.();
          resolve();
        };
        
        utterance.onerror = (event) => {
          this.currentUtterance = null;
          const error = `Speech synthesis error: ${event.error}`;
          console.error(error);
          options.onError?.(error);
          reject(new Error(error));
        };

        // Speak the text
        this.synthesis.speak(utterance);
        
      } catch (error) {
        const errorMessage = `Failed to create speech utterance: ${error}`;
        console.error(errorMessage);
        options.onError?.(errorMessage);
        reject(new Error(errorMessage));
      }
    });
  }

  public stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (this.synthesis) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis) {
      this.synthesis.resume();
    }
  }

  public isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  public isPaused(): boolean {
    return this.synthesis ? this.synthesis.paused : false;
  }

  public getSettings(): VoiceSettings {
    return { ...this.defaultSettings };
  }

  public updateSettings(newSettings: Partial<VoiceSettings>): void {
    this.defaultSettings = { ...this.defaultSettings, ...newSettings };
  }

  public destroy(): void {
    this.stop();
    this.synthesis = null;
  }
}

// Factory function to create TTS service
export const createTextToSpeechService = (): TextToSpeechService => {
  return new TextToSpeechService();
};
