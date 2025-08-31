import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Mic, Volume2, Settings, Save, RotateCcw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { createTextToSpeechService, VoiceSettings } from '@/services/TextToSpeechService';

interface VoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: VoiceSettingsState) => void;
  currentSettings: VoiceSettingsState;
}

export interface VoiceSettingsState {
  // Voice Recognition Settings
  wakeWords: string[];
  continuousListening: boolean;
  language: string;
  confidenceThreshold: number;
  
  // Text-to-Speech Settings
  ttsRate: number;
  ttsPitch: number;
  ttsVolume: number;
  ttsVoice: string;
  
  // General Settings
  autoSpeak: boolean;
  soundEffects: boolean;
}

const defaultSettings: VoiceSettingsState = {
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

const supportedLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'en-AU', name: 'English (Australia)' },
  { code: 'en-CA', name: 'English (Canada)' },
];

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  isOpen,
  onClose,
  onSettingsChange,
  currentSettings
}) => {
  const [settings, setSettings] = useState<VoiceSettingsState>(currentSettings);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingTTS, setIsTestingTTS] = useState(false);
  const [newWakeWord, setNewWakeWord] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAvailableVoices();
    }
  }, [isOpen]);

  const loadAvailableVoices = async () => {
    const ttsService = createTextToSpeechService();
    const voices = ttsService.getVoices();
    setAvailableVoices(voices);
    
    // Set default voice if none selected
    if (!settings.ttsVoice && voices.length > 0) {
      const defaultVoice = ttsService.getDefaultVoice();
      if (defaultVoice) {
        setSettings(prev => ({ ...prev, ttsVoice: defaultVoice.name }));
      }
    }
  };

  const handleSettingChange = (key: keyof VoiceSettingsState, value: string | number | boolean | string[]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addWakeWord = () => {
    if (newWakeWord.trim() && !settings.wakeWords.includes(newWakeWord.trim().toLowerCase())) {
      const updatedWakeWords = [...settings.wakeWords, newWakeWord.trim().toLowerCase()];
      handleSettingChange('wakeWords', updatedWakeWords);
      setNewWakeWord('');
    }
  };

  const removeWakeWord = (word: string) => {
    const updatedWakeWords = settings.wakeWords.filter(w => w !== word);
    handleSettingChange('wakeWords', updatedWakeWords);
  };

  const testTTS = async () => {
    if (isTestingTTS) return;
    
    setIsTestingTTS(true);
    const ttsService = createTextToSpeechService();
    
    try {
      const selectedVoice = availableVoices.find(v => v.name === settings.ttsVoice);
      
      await ttsService.speak({
        text: "Hello! This is a test of the text-to-speech settings. How do I sound?",
        settings: {
          rate: settings.ttsRate,
          pitch: settings.ttsPitch,
          volume: settings.ttsVolume,
          voice: selectedVoice
        },
        onError: (error) => {
          toast({
            title: "TTS Test Failed",
            description: error,
            variant: "destructive"
          });
        }
      });
    } catch (error) {
      console.error('TTS test failed:', error);
    } finally {
      setIsTestingTTS(false);
    }
  };

  const saveSettings = () => {
    onSettingsChange(settings);
    toast({
      title: "Settings Saved",
      description: "Voice settings have been updated successfully.",
    });
    onClose();
  };

  const resetToDefaults = () => {
    setSettings(defaultSettings);
    toast({
      title: "Settings Reset",
      description: "Voice settings have been reset to defaults.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Voice Settings
          </CardTitle>
          <CardDescription>
            Customize voice recognition and text-to-speech preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Voice Recognition Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Recognition
            </h3>
            
            <div className="space-y-3">
              <Label>Wake Words</Label>
              <div className="flex gap-2">
                <Input
                  value={newWakeWord}
                  onChange={(e) => setNewWakeWord(e.target.value)}
                  placeholder="Add wake word..."
                  onKeyPress={(e) => e.key === 'Enter' && addWakeWord()}
                />
                <Button onClick={addWakeWord} size="sm">
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {settings.wakeWords.map((word, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                    <span className="text-sm">{word}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeWakeWord(word)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Confidence Threshold: {settings.confidenceThreshold}</Label>
                <Slider
                  value={[settings.confidenceThreshold]}
                  onValueChange={(value) => handleSettingChange('confidenceThreshold', value[0])}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="continuous-listening"
                checked={settings.continuousListening}
                onCheckedChange={(checked) => handleSettingChange('continuousListening', checked)}
              />
              <Label htmlFor="continuous-listening">Continuous Listening Mode</Label>
            </div>
          </div>

          <Separator />

          {/* Text-to-Speech Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Text-to-Speech
            </h3>
            
            <div className="space-y-3">
              <Label>Voice</Label>
              <Select value={settings.ttsVoice} onValueChange={(value) => handleSettingChange('ttsVoice', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Speed: {settings.ttsRate}</Label>
                <Slider
                  value={[settings.ttsRate]}
                  onValueChange={(value) => handleSettingChange('ttsRate', value[0])}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Pitch: {settings.ttsPitch}</Label>
                <Slider
                  value={[settings.ttsPitch]}
                  onValueChange={(value) => handleSettingChange('ttsPitch', value[0])}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Volume: {settings.ttsVolume}</Label>
                <Slider
                  value={[settings.ttsVolume]}
                  onValueChange={(value) => handleSettingChange('ttsVolume', value[0])}
                  min={0.0}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              onClick={testTTS}
              disabled={isTestingTTS}
              variant="outline"
              className="w-full"
            >
              {isTestingTTS ? 'Testing...' : 'Test Voice Settings'}
            </Button>
          </div>

          <Separator />

          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">General</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-speak"
                  checked={settings.autoSpeak}
                  onCheckedChange={(checked) => handleSettingChange('autoSpeak', checked)}
                />
                <Label htmlFor="auto-speak">Auto-speak responses</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                />
                <Label htmlFor="sound-effects">Sound effects</Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={resetToDefaults} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button onClick={saveSettings} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
