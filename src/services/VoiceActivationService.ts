export interface VoiceCommand {
  transcript: string;
  confidence: number;
  isWakeWord: boolean;
}

export interface VoiceActivationOptions {
  wakeWords: string[];
  continuous: boolean;
  language: string;
  onCommand: (command: VoiceCommand) => void;
  onWakeWord: () => void;
  onError: (error: string) => void;
  onStatusChange: (status: 'idle' | 'listening' | 'processing') => void;
}

export class VoiceActivationService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private isProcessing = false;
  private options: VoiceActivationOptions;
  private wakeWordTimeout: NodeJS.Timeout | null = null;

  constructor(options: VoiceActivationOptions) {
    this.options = options;
    this.initializeRecognition();
  }

  private initializeRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      this.options.onError('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognitionClass = (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition || 
                                  (window as unknown as { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    this.recognition = new SpeechRecognitionClass();

    if (this.recognition) {
      this.recognition.continuous = this.options.continuous;
      this.recognition.interimResults = false;
      this.recognition.lang = this.options.language;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.options.onStatusChange('listening');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (!this.isProcessing) {
          this.options.onStatusChange('idle');
        }
        // Restart listening if continuous mode is enabled
        if (this.options.continuous && !this.isProcessing) {
          this.startListening();
        }
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const confidence = event.results[event.results.length - 1][0].confidence;
        
        console.log('Voice input:', transcript, 'Confidence:', confidence);

        // Check if this is a wake word
        const isWakeWord = this.options.wakeWords.some(wakeWord => 
          transcript.toLowerCase().includes(wakeWord.toLowerCase())
        );

        if (isWakeWord) {
          this.handleWakeWord(transcript, confidence);
        } else {
          this.handleCommand(transcript, confidence);
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        this.isProcessing = false;
        this.options.onStatusChange('idle');
        
        if (event.error === 'not-allowed') {
          this.options.onError('Microphone access denied');
        } else if (event.error === 'no-speech') {
          // Restart listening for continuous mode
          if (this.options.continuous) {
            setTimeout(() => this.startListening(), 100);
          }
        } else {
          this.options.onError(`Speech recognition error: ${event.error}`);
        }
      };

      this.recognition.onaudiostart = () => {
        console.log('Audio capturing started');
      };

      this.recognition.onaudioend = () => {
        console.log('Audio capturing ended');
      };

      this.recognition.onsoundstart = () => {
        console.log('Sound detected');
      };

      this.recognition.onsoundend = () => {
        console.log('Sound ended');
      };

      this.recognition.onspeechstart = () => {
        console.log('Speech started');
      };

      this.recognition.onspeechend = () => {
        console.log('Speech ended');
      };
    }
  }

  private handleWakeWord(transcript: string, confidence: number) {
    console.log('Wake word detected:', transcript);
    this.options.onWakeWord();
    
    // If continuous mode, restart listening for the actual command
    if (this.options.continuous) {
      this.isProcessing = true;
      this.options.onStatusChange('processing');
      
      // Clear any existing timeout
      if (this.wakeWordTimeout) {
        clearTimeout(this.wakeWordTimeout);
      }
      
      // Set timeout to restart listening
      this.wakeWordTimeout = setTimeout(() => {
        this.isProcessing = false;
        this.startListening();
      }, 1000);
    }
  }

  private handleCommand(transcript: string, confidence: number) {
    console.log('Command detected:', transcript);
    this.isProcessing = true;
    this.options.onStatusChange('processing');
    
    const command: VoiceCommand = {
      transcript,
      confidence,
      isWakeWord: false
    };
    
    this.options.onCommand(command);
  }

  public async startListening(): Promise<void> {
    if (!this.recognition || this.isListening || this.isProcessing) {
      return;
    }

    try {
      await this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.options.onError('Failed to start voice recognition');
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  public pause(): void {
    this.stopListening();
  }

  public resume(): void {
    if (this.options.continuous) {
      this.startListening();
    }
  }

  public destroy(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
    if (this.wakeWordTimeout) {
      clearTimeout(this.wakeWordTimeout);
    }
  }

  public isActive(): boolean {
    return this.isListening || this.isProcessing;
  }

  public getStatus(): 'idle' | 'listening' | 'processing' {
    if (this.isProcessing) return 'processing';
    if (this.isListening) return 'listening';
    return 'idle';
  }
}

// Factory function to create voice activation service
export const createVoiceActivationService = (options: VoiceActivationOptions): VoiceActivationService => {
  return new VoiceActivationService(options);
};
