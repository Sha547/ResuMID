import React, { useState, useEffect } from 'react';
import { Sun, Moon, FileText, Upload, Flame, ArrowRight } from 'lucide-react';
import { RoastIntensity } from './types';
import { LoadingScreen } from './components/LoadingScreen';
import { RoastDisplay } from './components/RoastDisplay';
import { IntensitySlider } from './components/IntensitySlider';
import { generateRoast } from './services/geminiService';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [appState, setAppState] = useState('IDLE');
  const [intensity, setIntensity] = useState(RoastIntensity.REALITY);
  const [fileData, setFileData] = useState(null);
  const [roastData, setRoastData] = useState(null);
  const [error, setError] = useState(null);

  // User Name State
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [tempName, setTempName] = useState('');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    document.body.classList.toggle('light-mode');
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (tempName.trim()) {
      setUserName(tempName);
      setShowNameInput(false);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    let file = null;

    if (event.dataTransfer) {
      file = event.dataTransfer.files[0];
    } else if (event.target && event.target.files) {
      file = event.target.files[0];
    }

    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("whoa there, file's too big. keep it under 5mb.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      if (typeof base64String !== 'string') return;

      const base64Content = base64String.split(',')[1];

      setFileData({
        file,
        previewUrl: file.type.startsWith('image') ? base64String : undefined,
        base64: base64Content,
        mimeType: file.type || 'application/pdf'
      });
      setError(null);
    };
    reader.onerror = () => setError("bruh, couldn't read that file.");
    reader.readAsDataURL(file);
  };

  const handleRoast = async () => {
    if (!fileData) return;

    setAppState('LOADING');
    setError(null);

    try {
      const data = await generateRoast(fileData.base64, fileData.mimeType, intensity, userName);
      setRoastData(data);
      setAppState('RESULTS');
    } catch (e) {
      setError(e.message || "something went wrong. probably my fault tbh.");
      setAppState('IDLE');
    }
  };

  const reset = () => {
    setAppState('IDLE');
    setRoastData(null);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-dark-bg text-gray-200' : 'bg-gray-50 text-gray-900'}`}>

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="fixed inset-0 z-[100] bg-dark-bg flex items-center justify-center p-4 animate-in fade-in duration-500">
          <div className="max-w-md w-full space-y-8 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                Resu<span className="text-primary">MID</span>
              </h1>
              <p className="text-gray-400 text-lg">welcome to the roast show.</p>
            </div>

            <div className="bg-dark-card/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl space-y-6">
              <label className="block text-xl font-medium text-white">
                who dares disturb me?
              </label>
              <p className="text-sm text-gray-500 -mt-4">enter your name so i can laugh at it.</p>

              <form onSubmit={handleNameSubmit} className="space-y-4">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="your name..."
                  className="w-full bg-dark-bg/50 border border-dark-border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-center text-lg"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!tempName.trim()}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  Prepare for Pain
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ambient Background Blobs - Optimized */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[80px] opacity-20"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-dark-bg/40 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center transition-all duration-300 supports-[backdrop-filter]:bg-dark-bg/20">
        <h1 className="text-xl font-display font-bold tracking-tight flex items-center gap-2 cursor-pointer group" onClick={() => window.location.reload()}>
          <span className="group-hover:text-white transition-colors text-glow duration-500">Resu<span className="text-primary font-normal group-hover:text-primary-light transition-colors">MID</span></span>
        </h1>

        <div className="flex items-center gap-6">
          {userName && (
            <span className="text-sm text-gray-400 hidden md:flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              victim: <span className="text-primary font-medium">{userName}</span>
            </span>
          )}
          <button onClick={toggleTheme} className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 text-gray-400 hover:text-white group">
            {theme === 'dark' ? <Sun size={18} className="group-hover:rotate-90 transition-transform duration-500" /> : <Moon size={18} className="group-hover:-rotate-12 transition-transform duration-500" />}
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-20 relative z-10">

        {/* Intro Text */}
        {appState === 'IDLE' && (
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl md:text-5xl font-display font-medium leading-tight text-white drop-shadow-lg">
              let's humble that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-pulse-slow text-glow">resume fr</span>
            </h2>
            <p className="text-base text-gray-400 font-light max-w-lg mx-auto leading-relaxed">
              drop your cv. i'll tell you why you're still unemployed.
              no cap, just facts.
            </p>
          </div>
        )}

        {/* Interaction Area */}
        <div className={`mx-auto relative transition-all duration-500 ${appState === 'RESULTS' ? 'max-w-6xl' : 'max-w-3xl'}`}>

          {/* State: IDLE - Upload & Settings */}
          {appState === 'IDLE' && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500">

              {/* Drag & Drop Zone */}
              <div
                className={`
                   relative group border-2 border-dashed rounded-3xl p-12 transition-all duration-300 transform glass-panel
                   ${fileData
                    ? 'border-primary bg-primary/5 scale-[1.01] shadow-xl shadow-primary/10'
                    : 'border-dark-border hover:border-primary/50 hover:bg-dark-surface/50 hover:scale-[1.01] hover:shadow-2xl hover:shadow-primary/5'}
                 `}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileUpload}
              >
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileUpload}
                  accept=".pdf, .png, .jpg, .jpeg, .docx"
                />

                <div className="flex flex-col items-center justify-center space-y-6 pointer-events-none">
                  {fileData ? (
                    <div className="text-center animate-in fade-in zoom-in duration-300">
                      <div className="w-20 h-20 mx-auto bg-dark-card rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/5 relative overflow-hidden group-hover:rotate-3 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <FileText size={40} className="text-primary relative z-10" />
                      </div>
                      <p className="text-xl font-medium text-white tracking-tight">{fileData.file.name}</p>
                      <p className="text-sm text-primary-light mt-1 font-medium">ready to get cooked</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-dark-surface rounded-full flex items-center justify-center mb-2 group-hover:scale-110 group-hover:bg-dark-card transition-all duration-300 shadow-lg group-hover:shadow-primary/20 ring-1 ring-white/5 group-hover:ring-primary/20">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-medium text-white group-hover:text-primary-light transition-colors">drop it here</h3>
                        <p className="text-sm text-gray-500 mt-2 group-hover:text-gray-400 transition-colors">pdf, docx, or images. don't be shy.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Intensity & Action */}
              <div className="space-y-8">
                <IntensitySlider value={intensity} onChange={setIntensity} disabled={false} />

                <button
                  onClick={handleRoast}
                  disabled={!fileData}
                  className={`
                     w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform relative overflow-hidden
                     ${fileData
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] ring-offset-2 ring-offset-dark-bg focus:ring-2 focus:ring-primary hover:animate-shake'
                      : 'bg-dark-surface text-gray-600 cursor-not-allowed opacity-50'}
                   `}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {fileData ? (
                      <>
                        <Flame className="w-5 h-5 animate-pulse" />
                        Don't be a crybaby
                      </>
                    ) : (
                      'upload something first'
                    )}
                  </span>
                </button>
              </div>

              {/* Error Toast */}
              {error && (
                <div className="p-4 bg-red-900/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm animate-in slide-in-from-bottom-2 fade-in">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* State: LOADING */}
          {appState === 'LOADING' && (
            <LoadingScreen />
          )}

          {/* State: RESULTS */}
          {appState === 'RESULTS' && roastData && (
            <RoastDisplay
              data={roastData}
              intensity={intensity}
              onReset={reset}
            />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full p-6 text-center pointer-events-none z-0">
        <p className="text-xs text-gray-600 opacity-50">
          powered by gemini 2.5 flash • sorry not sorry
        </p>
      </footer>

    </div>
  );
}