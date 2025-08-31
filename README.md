# Kyra 🎤

A futuristic AI assistant with unified voice and text chat capabilities, powered by Google's Gemini AI. Experience the future of human-AI interaction with seamless voice recognition, natural language processing, and persistent chat history.

![Kyra](src/assets/kyra.png)

## ✨ Features

### 🎯 Unified Chat Interface
- **Voice & Text Integration**: Seamlessly switch between typing and voice commands
- **Persistent Chat History**: All conversations are saved and accessible across sessions
- **Multiple Chat Sessions**: Create, manage, and switch between different conversation threads
- **Export/Import**: Backup and restore your chat history

### 🎤 Advanced Voice Features
- **Wake Word Detection**: Say "Hey Kyra" or "Kyra" to activate voice commands
- **Continuous Listening**: Optional always-on listening mode for hands-free operation
- **Customizable Voice Settings**: Adjust recognition sensitivity, TTS parameters, and more
- **Natural Language Processing**: Powered by Gemini AI for intelligent responses

### 🔊 Text-to-Speech
- **Multiple Voice Options**: Choose from available system voices
- **Customizable Settings**: Adjust speed, pitch, and volume
- **Auto-Speak**: Automatically speak AI responses for voice interactions
- **Voice Testing**: Test your voice settings before using them

### 🎨 Modern UI
- **Glassmorphism Design**: Beautiful, modern interface with backdrop blur effects
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Easy on the eyes with customizable color schemes
- **Smooth Animations**: Engaging visual feedback for all interactions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern browser with microphone support (Chrome, Edge, Safari)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kyra.git
   cd kyra
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   ```bash
   cp env.template .env.local
   ```
   
   Add your Gemini API key to `.env.local`:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage Guide

### Basic Chat
- **Text Input**: Type your message and press Enter
- **Voice Input**: Click the voice orb or say "Hey Kyra"
- **New Sessions**: Click "+ New Chat" to start fresh conversations

### Voice Commands
- **Wake Word**: "Hey Kyra" or "Kyra"
- **Examples**:
  - "Hey Kyra, what's the weather like?"
  - "Kyra, tell me a joke"
  - "What's the capital of France?"

### Voice Settings
- Access voice settings via the "Voice" button in the sidebar
- Customize wake words, recognition sensitivity, and TTS parameters
- Test voice settings before using them

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Tailwind CSS
- **Voice Recognition**: Web Speech API
- **Text-to-Speech**: Web Speech Synthesis API
- **AI Integration**: Google Generative AI (Gemini)
- **State Management**: React Hooks + Local Storage
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── VoiceOrb.tsx    # Voice activation orb
│   ├── UnifiedChat.tsx # Main chat interface
│   └── VoiceSettings.tsx # Voice configuration
├── hooks/               # Custom React hooks
│   └── useChatStorage.ts # Chat persistence
├── services/            # Voice and AI services
│   ├── VoiceActivationService.ts
│   └── TextToSpeechService.ts
├── pages/               # Application pages
│   └── Assistant.tsx   # Main assistant page
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Voice Settings
- **Wake Words**: Customize activation phrases
- **Language**: Select preferred language variant
- **Confidence Threshold**: Set recognition sensitivity
- **Continuous Listening**: Enable always-on mode
- **TTS Parameters**: Adjust speed, pitch, and volume

### Environment Variables
- `VITE_GEMINI_API_KEY`: Your Gemini API key
- Additional configuration options available in voice settings

## 🌐 Browser Support

- **Chrome**: Full support (recommended)
- **Edge**: Full support
- **Safari**: Limited support (WebKit)
- **Firefox**: Basic support

## 📱 Mobile Support

- Responsive design for mobile devices
- Touch-friendly interface
- Mobile-optimized voice recognition

## 🔒 Privacy & Security

- **Local Storage**: Chat history stored locally in your browser
- **No Server Storage**: Conversations remain private on your device
- **API Calls**: Only necessary data sent to Gemini for processing
- **Microphone Access**: Explicit user consent required

## 🚧 Troubleshooting

### Common Issues

#### Voice Not Working
1. Check microphone permissions
2. Verify browser compatibility
3. Test microphone in other applications
4. Check voice settings configuration

#### Poor Recognition
1. Adjust confidence threshold
2. Speak clearly and at normal volume
3. Reduce background noise
4. Check language settings

#### No Audio Output
1. Verify speaker/headphone connection
2. Check system volume
3. Test TTS settings
4. Ensure auto-speak is enabled

### Performance Tips
1. **Continuous Listening**: Disable if not needed to save resources
2. **Voice Quality**: Use high-quality microphones for better recognition
3. **Browser**: Use Chrome or Edge for best voice recognition performance
4. **Network**: Ensure stable internet for Gemini API calls

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Update `homepage` in `package.json` with your repository URL
2. Install `gh-pages`: `npm install --save-dev gh-pages`
3. Add deploy script to `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
4. Run `npm run deploy`

### Deploy to Vercel/Netlify
- Connect your GitHub repository
- Set build command: `npm run build`
- Set output directory: `dist`
- Add environment variable: `VITE_GEMINI_API_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Type checking
npm run type-check

# Build
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI**: Gemini API for intelligent responses
- **Shadcn/ui**: Beautiful UI components
- **Web Speech API**: Voice recognition and synthesis
- **React Community**: Excellent framework and ecosystem

## 📞 Support

- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/yourusername/kyra/issues)
- **Discussions**: Join community discussions for help and ideas
- **Documentation**: Check the code comments and component documentation

---

**Note**: Voice features require modern browsers with microphone support. For best results, use Chrome or Edge on a desktop device with a quality microphone.

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/kyra&type=Date)](https://star-history.com/#yourusername/kyra&Date)
