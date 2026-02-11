
import React, { useState } from 'react';
import { ChevronLeft, Play, Lock, User, Trophy, LayoutGrid, ShoppingBag, BarChart3, Settings } from 'lucide-react';
import { LevelData } from '../types';

interface LevelSelectViewProps {
  levels: LevelData[];
  onStart: (level: LevelData) => void;
  onBack: () => void;
  onNavigateProfile: () => void;
}

const LevelSelectView: React.FC<LevelSelectViewProps> = ({ levels, onStart, onBack, onNavigateProfile }) => {
  const [activeTab, setActiveTab] = useState('all');

  const getDifficultyTier = (difficulty: number) => {
    if (difficulty <= 3) return 'easy';
    if (difficulty <= 6) return 'normal';
    return 'hard';
  };

  const getDifficultyLabel = (difficulty: number) => {
    const tier = getDifficultyTier(difficulty);
    if (tier === 'easy') return 'Easy';
    if (tier === 'normal') return 'Normal';
    return 'Hard';
  };

  const getTheme = (difficulty: number) => {
    const tier = getDifficultyTier(difficulty);
    if (tier === 'easy') {
      return {
        accent: 'from-cyan-500/30 via-blue-500/20 to-transparent',
        border: 'border-cyan-400/30',
        badge: 'text-cyan-300',
        glow: 'shadow-cyan-500/20'
      };
    }
    if (tier === 'normal') {
      return {
        accent: 'from-purple-500/30 via-indigo-500/20 to-transparent',
        border: 'border-purple-500/30',
        badge: 'text-purple-300',
        glow: 'shadow-purple-600/20'
      };
    }
    return {
      accent: 'from-pink-500/30 via-red-500/20 to-transparent',
      border: 'border-pink-500/30',
      badge: 'text-pink-300',
      glow: 'shadow-pink-500/20'
    };
  };

  const filteredLevels = activeTab === 'all'
    ? levels
    : levels.filter(level => getDifficultyTier(level.metadata.difficulty) === activeTab);

  return (
    <div className="w-full h-full flex flex-col bg-[#0a0510] overflow-hidden font-['Space_Grotesk']">
      {/* Header */}
      <div className="flex items-center justify-between p-8 relative z-20">
        <button onClick={onBack} className="p-2 text-white/50 hover:text-white transition-colors">
          <ChevronLeft size={28} />
        </button>
        <h2 className="text-2xl font-black italic tracking-tighter text-purple-500 uppercase glow-purple">Level Select</h2>
        <button className="p-2.5 bg-purple-600 rounded-lg text-white shadow-lg shadow-purple-600/30">
          <Trophy size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4 px-8 mb-8">
        {['easy', 'normal', 'hard', 'all'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === tab ? 'bg-purple-600 border-purple-600 text-white' : 'bg-transparent border-white/10 text-white/40 hover:text-white/70'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Level List */}
      <div className="flex-1 overflow-y-auto px-8 pb-32 flex flex-col gap-6">
        {filteredLevels.length === 0 && (
          <div className="w-full border border-white/10 rounded-2xl p-10 text-center text-white/40 uppercase text-xs tracking-[0.3em]">
            No levels in this difficulty yet
          </div>
        )}
        {filteredLevels.map((level, idx) => {
          const theme = getTheme(level.metadata.difficulty);
          return (
          <div 
            key={level.metadata.id}
            className={`w-full bg-purple-900/10 border ${theme.border} rounded-2xl overflow-hidden shadow-2xl ${theme.glow}`}
          >
            <div className="p-5 flex justify-between items-center">
              <div>
                <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${theme.badge}`}>
                  Level {idx + 1} • {getDifficultyLabel(level.metadata.difficulty)}
                </span>
                <h3 className="text-xl font-black italic text-white uppercase tracking-tighter mt-0.5">{level.metadata.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest">BPM</span>
                <p className="text-lg font-black text-white leading-none">{level.metadata.bpm}</p>
              </div>
            </div>

            {/* Preview Image Placeholder */}
            <div className="relative w-full aspect-video bg-black/40 px-5 flex items-end pb-4 group cursor-pointer" onClick={() => onStart(level)}>
               <div className={`absolute inset-0 w-full h-full bg-gradient-to-br ${theme.accent} opacity-80`} />
               <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.06)_25%,rgba(255,255,255,0.06)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.06)_76%,transparent_77%)] opacity-30" />
               <div className="relative z-10 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                       <BarChart3 size={14} className="text-orange-500" />
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Preview Ready</span>
                    </div>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30 w-[40%]"></div>
                  </div>
               </div>
            </div>

            <div className="p-5 flex gap-3">
              <button 
                onClick={() => onStart(level)}
                className="flex-1 bg-purple-900/40 border border-purple-500/20 text-white font-black py-3 rounded-xl hover:bg-purple-600 transition-all uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-2"
              >
                <Play size={14} fill="currentColor" /> Play
              </button>
            </div>
          </div>
        )})}
      </div>

      {/* Footer Nav */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-8 bg-[#0a0510]/80 backdrop-blur-xl border-t border-purple-500/20 flex justify-between items-center z-30">
        <button className="flex flex-col items-center gap-1 group">
          <LayoutGrid size={22} className="text-purple-600 group-hover:text-white transition-colors" />
          <span className="text-[7px] text-purple-600 font-black uppercase tracking-widest">Levels</span>
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <ShoppingBag size={22} className="text-white/20 group-hover:text-white transition-colors" />
          <span className="text-[7px] text-white/20 font-black uppercase tracking-widest">Shop</span>
        </button>
        <button onClick={() => onStart(levels[0])} className="w-14 h-14 bg-gradient-purple rounded-full flex items-center justify-center -mt-12 shadow-2xl shadow-purple-600/50 border-4 border-[#0a0510] hover:scale-110 transition-transform">
          <Play size={24} className="text-white ml-1" fill="currentColor" />
        </button>
        <button className="flex flex-col items-center gap-1 group">
          <Trophy size={22} className="text-white/20 group-hover:text-white transition-colors" />
          <span className="text-[7px] text-white/20 font-black uppercase tracking-widest">Ranks</span>
        </button>
        <button onClick={onNavigateProfile} className="flex flex-col items-center gap-1 group">
          <User size={22} className="text-white/20 group-hover:text-white transition-colors" />
          <span className="text-[7px] text-white/20 font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default LevelSelectView;
