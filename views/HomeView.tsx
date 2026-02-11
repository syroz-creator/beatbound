
import React from 'react';
import { Play, Settings, User, Bell, Volume2, Info, Share2, Gamepad2 } from 'lucide-react';
import { APP_NAME, VERSION } from '../constants';

interface HomeViewProps {
  onNavigate: (view: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#0a0510] overflow-hidden font-['Space_Grotesk']">
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 w-full h-full" style={{
          backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          perspective: '500px',
          transform: 'rotateX(60deg) translateY(-20%)'
        }}></div>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-start z-20">
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/40 border border-purple-500/20 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Server: Online</span>
        </div>
        <div className="flex gap-3">
          <button className="p-2 bg-purple-900/40 rounded-lg text-purple-400 border border-purple-500/20 hover:bg-purple-500/10"><Bell size={18} /></button>
          <button className="p-2 bg-purple-900/40 rounded-lg text-purple-400 border border-purple-500/20 hover:bg-purple-500/10"><Volume2 size={18} /></button>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center pt-20">
        {/* Alpha Tag */}
        <div className="absolute top-[8rem] right-4 bg-pink-500 text-white text-[8px] font-black px-2 py-0.5 rounded rotate-12 z-20 shadow-lg">
          {VERSION}
        </div>

        {/* Branding */}
        <div className="text-center mb-16 relative">
          <h1 className="text-6xl font-black italic tracking-tighter text-white glow-purple uppercase leading-none">
            RHYTHM<br/><span className="text-purple-500">GRID</span>
          </h1>
          <p className="text-purple-400/40 text-[10px] font-bold tracking-[0.5em] uppercase mt-4">
            Sync or Defeat
          </p>
        </div>

        {/* Menu Actions */}
        <div className="flex flex-col gap-4 w-full px-12">
          <button 
            onClick={() => onNavigate('play')}
            className="w-full bg-gradient-purple text-white font-black py-5 rounded-sm hover:scale-[1.05] transition-all shadow-[0_10px_40px_rgba(168,85,247,0.4)] uppercase text-lg tracking-[0.2em]"
          >
            Play Game
          </button>
          
          <button 
            onClick={() => onNavigate('settings')}
            className="w-full bg-transparent border border-purple-500/30 text-white font-bold py-3.5 rounded-sm hover:bg-purple-500/10 transition-all uppercase text-xs tracking-widest"
          >
            Settings
          </button>
          <button 
            onClick={() => onNavigate('profile')}
            className="w-full bg-transparent border border-purple-500/30 text-white font-bold py-3.5 rounded-sm hover:bg-purple-500/10 transition-all uppercase text-xs tracking-widest"
          >
            Profile
          </button>
          <button className="text-purple-400/30 font-bold uppercase text-[9px] tracking-[0.3em] mt-4 hover:text-purple-400 transition-colors">
            Credits & Build Info
          </button>
        </div>

        {/* Visualizer bars */}
        <div className="flex items-end gap-1 mt-12 h-16 w-full px-12 opacity-40">
          {[4,7,5,9,12,6,10,4,8,14,5,10,6,8].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-purple-900 to-pink-500 rounded-t-sm animate-pulse" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}></div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end bg-black/40 backdrop-blur-md border-t border-purple-500/10 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('profile')}
              className="w-10 h-10 bg-purple-500/20 rounded-lg overflow-hidden border border-purple-500/30 flex items-center justify-center hover:bg-purple-500/40 transition-all"
            >
              <User size={20} className="text-purple-400" />
            </button>
            <div className="flex flex-col">
              <span className="text-[8px] text-purple-400 font-bold uppercase tracking-widest opacity-50">Player One</span>
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">LVL. 42</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex flex-col items-center gap-1 group">
               <Gamepad2 size={16} className="text-purple-400 group-hover:text-white transition-colors" />
               <span className="text-[7px] text-purple-400/50 font-bold uppercase tracking-widest">Games</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
               <Share2 size={16} className="text-purple-400 group-hover:text-white transition-colors" />
               <span className="text-[7px] text-purple-400/50 font-bold uppercase tracking-widest">Social</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
               <Info size={16} className="text-purple-400 group-hover:text-white transition-colors" />
               <span className="text-[7px] text-purple-400/50 font-bold uppercase tracking-widest">Info</span>
            </button>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-[7px] text-purple-400/50 font-bold uppercase tracking-widest">Now Playing</span>
            <span className="text-[9px] text-pink-400 font-bold uppercase tracking-widest italic leading-tight">Sync Wave - 128<br/>BPM</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
