import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import CaptureScreen from './components/CaptureScreen';
import EditorScreen from './components/EditorScreen';
import { Camera } from 'lucide-react';

export default function App() {
  const [step, setStep] = useState('welcome'); // 'welcome' | 'capture' | 'editor'
  const [photos, setPhotos] = useState([]);

  const handleStartSession = () => {
    setPhotos([]);
    setStep('capture');
  };

  const handlePhotosCaptured = (capturedPhotos) => {
    setPhotos(capturedPhotos);
    setStep('editor');
  };

  const handleRetake = () => {
    setPhotos([]);
    setStep('capture');
  };

  const handleBackToWelcome = () => {
    setPhotos([]);
    setStep('welcome');
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col font-sans selection:bg-[#E6DFD3] selection:text-[#121212]">
      {/* Premium Header */}
      {step !== 'welcome' && (
        <header className="w-full max-w-6xl mx-auto px-6 py-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-200 to-amber-50 flex items-center justify-center text-[#121212] shadow-md shadow-amber-300/10">
              <Camera className="w-4 h-4 font-bold" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold tracking-wider text-white">MINIPHOTOBOX CIPA ❤️</span>
              <span className="text-[10px] text-gray-500 font-light tracking-widest block leading-none">PHOTO BOOTH</span>
            </div>
          </div>

          {/* Live Studio Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 text-[10px] text-gray-400 font-medium tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Studio Active
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col justify-center py-8">
        {step === 'welcome' && (
          <WelcomeScreen onStart={handleStartSession} />
        )}
        {step === 'capture' && (
          <CaptureScreen 
            onPhotosCaptured={handlePhotosCaptured} 
            onBack={handleBackToWelcome} 
          />
        )}
        {step === 'editor' && (
          <EditorScreen 
            photos={photos} 
            onRetake={handleRetake} 
          />
        )}
      </main>

      {/* Premium Minimalist Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600 font-light tracking-wide">
        <div className="flex items-center gap-1">
          <span>&copy; {new Date().getFullYear()} CIPA STUDIO. All rights reserved.</span>
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}
