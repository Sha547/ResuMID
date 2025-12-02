import React, { useState, useEffect } from 'react';
import { LOADING_PHRASES } from '../constants';
import { ScanLine, FileSearch } from 'lucide-react';

export const LoadingScreen = () => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[400px] text-center space-y-8 animate-in fade-in duration-700">
      
      {/* Sleek Scanning Animation */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
        <div className="relative p-6 bg-dark-surface border border-dark-border rounded-2xl shadow-xl">
            <FileSearch size={48} className="text-gray-400" />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
                 <ScanLine size={64} className="text-primary animate-pulse-slow opacity-80" />
            </div>
        </div>
      </div>

      {/* Text Typewriter Placeholder */}
      <div className="h-16 max-w-md px-4 flex items-center justify-center">
        <p className="text-lg md:text-xl font-display font-medium text-gray-200 typewriter-cursor">
          {LOADING_PHRASES[currentPhraseIndex]}
        </p>
      </div>

      {/* Subtle Progress Bar */}
      <div className="w-48 h-1 bg-dark-border rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-width w-0"></div>
      </div>
    </div>
  );
};