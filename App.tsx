
import React, { useState, useEffect } from 'react';
import { GameSettings, ProgressState, LevelData } from './types';
import { DEFAULT_SETTINGS, TUTORIAL_LEVEL, GOOGLE_CLIENT_ID, BUILTIN_LEVELS } from './constants';
import HomeView from './views/HomeView';
import LevelSelectView from './views/LevelSelectView';
import GameView from './views/GameView';
import EditorView from './views/EditorView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';
import { AlertCircle, Copy, Check } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'play' | 'game' | 'editor' | 'settings' | 'profile'>('home');
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [progress, setProgress] = useState<ProgressState>({
    completedLevels: {},
    attempts: {},
    totalJumps: 0
  });
  const [activeLevel, setActiveLevel] = useState<LevelData>(TUTORIAL_LEVEL);
  const [userLevels, setUserLevels] = useState<LevelData[]>([]);
  const [copied, setCopied] = useState(false);

  const isConfigured = GOOGLE_CLIENT_ID && !GOOGLE_CLIENT_ID.includes("YOUR_GOOGLE_CLIENT_ID_HERE");
  const origin = window.location.origin;

  // Log origin for easy access in F12
  useEffect(() => {
    console.log("%c--- RHYTHM GRID CONFIG ---", "color: #a855f7; font-weight: bold; font-size: 16px;");
    console.log("%cYour Google Origin URL:", "color: #fff; font-weight: bold;", origin);
    console.log("%cPlace this in 'Authorized JavaScript origins' in Google Cloud Console.", "color: #aaa;");
  }, [origin]);

  // Load from LocalStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('beatbound_settings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const savedProgress = localStorage.getItem('beatbound_progress');
    if (savedProgress) setProgress(JSON.parse(savedProgress));

    const savedLevels = localStorage.getItem('beatbound_user_levels');
    if (savedLevels) setUserLevels(JSON.parse(savedLevels));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('beatbound_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('beatbound_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('beatbound_user_levels', JSON.stringify(userLevels));
  }, [userLevels]);

  const handleStartGame = (level: LevelData) => {
    setActiveLevel(level);
    setCurrentView('game');
  };

  const handleLevelSave = (level: LevelData) => {
    const exists = userLevels.find(l => l.metadata.id === level.metadata.id);
    if (exists) {
      setUserLevels(userLevels.map(l => l.metadata.id === level.metadata.id ? level : l));
    } else {
      setUserLevels([...userLevels, level]);
    }
  };

  const copyOrigin = () => {
    navigator.clipboard.writeText(origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-screen text-slate-100 overflow-hidden bg-slate-950 font-['Space_Grotesk'] flex flex-col">
      {/* Global Config Banner (Visible only when Client ID is missing) */}
      {!isConfigured && currentView !== 'game' && (
        <div className="w-full bg-purple-600/20 border-b border-purple-500/30 p-3 flex items-center justify-between px-6 animate-in slide-in-from-top duration-500 z-[100] backdrop-blur-md">
           <div className="flex items-center gap-3">
              <AlertCircle size={16} className="text-purple-400" />
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-200">
                Setup Required: <span className="opacity-60 lowercase font-mono ml-2">{origin}</span>
              </p>
           </div>
           <button 
             onClick={copyOrigin}
             className="flex items-center gap-2 bg-purple-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all active:scale-95 shadow-lg shadow-purple-600/20"
           >
             {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Origin URL</>}
           </button>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden">
        {currentView === 'home' && (
          <HomeView 
            onNavigate={(v) => setCurrentView(v as any)} 
          />
        )}
        {currentView === 'play' && (
          <LevelSelectView 
            levels={[...BUILTIN_LEVELS, ...userLevels]} 
            onStart={handleStartGame} 
            onBack={() => setCurrentView('home')} 
            onNavigateProfile={() => setCurrentView('profile')}
          />
        )}
        {currentView === 'game' && (
          <GameView 
            level={activeLevel} 
            settings={settings} 
            onExit={() => setCurrentView('play')}
            onRecordProgress={(perc) => {
                const currentBest = progress.completedLevels[activeLevel.metadata.id] || 0;
                if (perc > currentBest) {
                    setProgress(prev => ({
                        ...prev,
                        completedLevels: { ...prev.completedLevels, [activeLevel.metadata.id]: perc }
                    }));
                }
            }}
          />
        )}
        {currentView === 'editor' && (
          <EditorView 
            onSave={handleLevelSave} 
            onBack={() => setCurrentView('home')} 
          />
        )}
        {currentView === 'settings' && (
          <SettingsView 
            settings={settings} 
            onUpdate={setSettings} 
            onBack={() => setCurrentView('home')} 
          />
        )}
        {currentView === 'profile' && (
          <ProfileView
            progress={progress}
            onBack={() => setCurrentView('home')}
          />
        )}
      </div>
    </div>
  );
};

export default App;
