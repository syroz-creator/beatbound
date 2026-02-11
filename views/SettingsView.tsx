
import React from 'react';
import { ChevronLeft, Volume2, Monitor, Keyboard, Eye, Info, Sparkles, Layers, Box } from 'lucide-react';
import { GameSettings } from '../types';
import { audioManager } from '../game/AudioManager';

interface SettingsViewProps {
  settings: GameSettings;
  onUpdate: (s: GameSettings) => void;
  onBack: () => void;
  forceDesktopLayout?: boolean;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdate, onBack, forceDesktopLayout = false }) => {
  const categories = [
    { id: 'audio', label: 'Audio', icon: <Volume2 size={20} /> },
    { id: 'graphics', label: 'Graphics', icon: <Monitor size={20} /> },
    { id: 'input', label: 'Controls', icon: <Keyboard size={20} /> },
    { id: 'credits', label: 'Credits', icon: <Info size={20} /> },
  ];

  const [activeTab, setActiveTab] = React.useState('audio');

  return (
    <div className="w-full h-full flex flex-col p-8 md:p-12 overflow-y-auto bg-[#0a0510]">
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={onBack}
          className="p-3 bg-purple-900/40 rounded-full border border-purple-500/20 hover:bg-purple-800 transition-all text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter glow-purple">Settings</h2>
      </div>

      <div className={`max-w-4xl mx-auto w-full grid gap-8 ${forceDesktopLayout ? 'grid-cols-4' : 'grid-cols-1 md:grid-cols-4'}`}>
        <div className="flex flex-col gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all font-bold uppercase text-xs tracking-widest ${activeTab === cat.id ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'bg-purple-900/20 text-purple-400 hover:bg-purple-800/40 border border-purple-500/10'}`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className={`${forceDesktopLayout ? 'col-span-3' : 'md:col-span-3'} bg-purple-900/10 rounded-3xl border border-purple-500/20 p-8 flex flex-col gap-8`}>
          {activeTab === 'audio' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-xs font-black text-purple-400 uppercase tracking-widest">Music Volume</label>
                  <span className="text-white font-mono">{Math.round(settings.musicVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={settings.musicVolume} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdate({ ...settings, musicVolume: val });
                    audioManager.setVolume(val);
                  }}
                  className="w-full accent-purple-500 bg-purple-900/30 h-1.5 rounded-lg appearance-none cursor-pointer" 
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-xs font-black text-purple-400 uppercase tracking-widest">SFX Volume</label>
                  <span className="text-white font-mono">{Math.round(settings.sfxVolume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={settings.sfxVolume} 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdate({ ...settings, sfxVolume: val });
                    audioManager.setSFXVolume(val);
                  }}
                  className="w-full accent-purple-500 bg-purple-900/30 h-1.5 rounded-lg appearance-none cursor-pointer" 
                />
              </div>
            </div>
          )}

          {activeTab === 'graphics' && (
            <div className="space-y-4">
               <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-purple-400" />
                    <span className="font-bold text-sm uppercase tracking-widest">Bloom & Glow</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.bloomEnabled} 
                    onChange={(e) => onUpdate({ ...settings, bloomEnabled: e.target.checked })}
                    className="w-6 h-6 accent-purple-500 rounded border-none"
                  />
               </div>
               <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Box size={18} className="text-purple-400" />
                    <span className="font-bold text-sm uppercase tracking-widest">Particles</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.particlesEnabled} 
                    onChange={(e) => onUpdate({ ...settings, particlesEnabled: e.target.checked })}
                    className="w-6 h-6 accent-purple-500 rounded border-none"
                  />
               </div>
               <div className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <Layers size={18} className="text-purple-400" />
                    <span className="font-bold text-sm uppercase tracking-widest">Parallax Background</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.parallaxEnabled} 
                    onChange={(e) => onUpdate({ ...settings, parallaxEnabled: e.target.checked })}
                    className="w-6 h-6 accent-purple-500 rounded border-none"
                  />
               </div>
            </div>
          )}

          {activeTab === 'input' && (
             <div className="text-sm space-y-6 text-purple-400/70">
                <p className="text-xs font-black uppercase tracking-widest text-white">Keyboard Bindings</p>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-black/40 rounded-xl border border-purple-500/10">
                      <span className="block text-[10px] uppercase font-black text-purple-500/50 mb-1">Action</span>
                      <span className="font-bold text-white uppercase tracking-widest">Jump / Fly</span>
                   </div>
                   <div className="p-4 bg-black/40 rounded-xl border border-purple-500/10">
                      <span className="block text-[10px] uppercase font-black text-purple-500/50 mb-1">Key</span>
                      <span className="font-bold text-white uppercase tracking-widest">[SPACE] or [UP]</span>
                   </div>
                   <div className="p-4 bg-black/40 rounded-xl border border-purple-500/10">
                      <span className="block text-[10px] uppercase font-black text-purple-500/50 mb-1">Action</span>
                      <span className="font-bold text-white uppercase tracking-widest">Pause Menu</span>
                   </div>
                   <div className="p-4 bg-black/40 rounded-xl border border-purple-500/10">
                      <span className="block text-[10px] uppercase font-black text-purple-500/50 mb-1">Key</span>
                      <span className="font-bold text-white uppercase tracking-widest">[ESC]</span>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'credits' && (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <h3 className="text-xl font-black italic text-white uppercase tracking-tighter">RHYTHM GRID Team</h3>
                <div className="w-12 h-0.5 bg-purple-600 mx-auto mt-2"></div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-purple-500/10 flex justify-between items-center">
                   <span className="text-xs font-black text-purple-400 uppercase tracking-widest">Created By</span>
                   <span className="text-white font-bold tracking-widest">AHMADUWAIDA</span>
                </div>
              </div>
              <p className="text-[10px] text-purple-400/40 text-center uppercase font-bold tracking-widest mt-8">
                Created with passion for rhythm and geometry. <br/> ALPHA 1.0 - BUILD #0563
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
