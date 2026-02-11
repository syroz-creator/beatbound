
import React, { useEffect, useRef, useState } from 'react';
import { GameEngine, GameState } from '../game/Engine';
import { Renderer } from '../game/Renderer';
import { audioManager } from '../game/AudioManager';
import { LevelData, GameSettings } from '../types';
import { RotateCcw, Pause, Play, Settings, LogOut, Skull, Trophy, MapPin, Trash2 } from 'lucide-react';

interface GameViewProps {
  level: LevelData;
  settings: GameSettings;
  onExit: () => void;
  onRecordProgress: (perc: number) => void;
}

const GameView: React.FC<GameViewProps> = ({ level, settings, onExit, onRecordProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [attempts, setAttempts] = useState(42); // Placeholder
  
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const requestRef = useRef<number | null>(null);

  const initGame = async () => {
    if (!canvasRef.current) return;
    
    rendererRef.current = new Renderer(canvasRef.current);
    
    engineRef.current = new GameEngine(
      level, 
      () => {
        setIsLost(true);
        if (engineRef.current) onRecordProgress(engineRef.current.state.percent);
      }, 
      () => {
        setIsWon(true);
        onRecordProgress(100);
      }
    );

    await audioManager.loadMusic(level.metadata.songUrl);
    audioManager.setVolume(settings.musicVolume);
    audioManager.setSFXVolume(settings.sfxVolume);
    audioManager.play(level.metadata.songOffsetMs);

    const animate = (time: number) => {
      if (!isPaused && !isLost && !isWon && engineRef.current && rendererRef.current) {
        engineRef.current.update(time);
        rendererRef.current.draw(engineRef.current.state, level, settings);
        setGameState({ ...engineRef.current.state });
      } else if ((isPaused || isLost || isWon) && rendererRef.current && engineRef.current) {
         rendererRef.current.draw(engineRef.current.state, level, settings);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
  };

  const restart = () => {
    setIsLost(false);
    setIsWon(false);
    setIsPaused(false);
    setAttempts(a => a + 1);
    if (engineRef.current) {
      engineRef.current = new GameEngine(
        level, 
        () => {
          setIsLost(true);
          if (engineRef.current) onRecordProgress(engineRef.current.state.percent);
        }, 
        () => {
          setIsWon(true);
          onRecordProgress(100);
        }
      );
      audioManager.play(level.metadata.songOffsetMs);
    }
  };

  useEffect(() => {
    initGame();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') engineRef.current?.setInput(true);
      if (e.code === 'Escape') setIsPaused(p => !p);
      if (e.code === 'KeyR' && isLost) restart();
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') engineRef.current?.setInput(false);
    };
    const handleInputStart = (e: Event) => {
      if (e.type === 'touchstart') e.preventDefault();
      engineRef.current?.setInput(true);
    };
    const handleInputEnd = () => engineRef.current?.setInput(false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleInputStart);
    window.addEventListener('mouseup', handleInputEnd);
    window.addEventListener('touchstart', handleInputStart, { passive: false });
    window.addEventListener('touchend', handleInputEnd);

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
      audioManager.stop();
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleInputStart);
      window.removeEventListener('mouseup', handleInputEnd);
      window.removeEventListener('touchstart', handleInputStart);
      window.removeEventListener('touchend', handleInputEnd);
    };
  }, [level]);

  useEffect(() => {
    if (isPaused || isLost || isWon) audioManager.suspend();
    else audioManager.resume();
  }, [isPaused, isLost, isWon]);

  useEffect(() => {
    audioManager.setVolume(settings.musicVolume);
    audioManager.setSFXVolume(settings.sfxVolume);
  }, [settings.musicVolume, settings.sfxVolume]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0510]">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* HUD (Rhythm Grid Style) */}
      <div className="absolute top-0 left-0 w-full p-10 flex justify-between items-start pointer-events-none z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em]">Attempt</span>
            <span className="text-3xl font-black italic text-white/80 leading-none">{attempts}</span>
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1">
            {level.metadata.name} • {level.metadata.difficulty}/10
          </div>
          <div className="flex items-baseline gap-2 mt-1">
             <span className="text-4xl font-black italic text-purple-500 glow-purple leading-none">{gameState?.percent || 0}%</span>
          </div>
        </div>
        <button onClick={() => setIsPaused(true)} className="p-3 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-600/30 transition-all pointer-events-auto shadow-xl">
          <Pause size={20} fill="currentColor" />
        </button>
      </div>

      {/* Practice Tools Footer */}
      <div className="absolute bottom-0 left-0 w-full p-8 flex justify-center gap-4 pointer-events-none z-10">
        <div className="flex gap-2 pointer-events-auto">
          <button className="flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/30 transition-all group">
            <MapPin size={18} className="text-purple-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Set Checkpoint</span>
          </button>
          <button className="flex items-center gap-3 px-6 py-3 bg-black/40 border border-white/10 rounded-xl text-white/60 hover:text-pink-500 hover:border-pink-500/30 transition-all group">
            <Trash2 size={18} className="text-pink-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Delete</span>
          </button>
        </div>
      </div>

      {/* Pause Menu */}
      {isPaused && !isLost && !isWon && (
        <div className="absolute inset-0 z-50 bg-[#0a0510]/80 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="relative w-full max-w-[360px] bg-[#0a0510] border border-purple-500/30 p-12 rounded-2xl shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-5xl font-black italic text-white glow-purple uppercase tracking-tighter">PAUSED</h2>
              <div className="w-16 h-1 bg-purple-600 mx-auto mt-3"></div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <button 
                onClick={() => setIsPaused(false)}
                className="w-full bg-gradient-purple text-white font-black py-5 rounded-xl hover:scale-[1.02] transition-all uppercase text-sm tracking-widest shadow-2xl shadow-purple-600/30"
              >
                Resume
              </button>
              <button 
                onClick={restart}
                className="w-full bg-transparent border border-purple-500/30 text-white font-bold py-4 rounded-xl hover:bg-purple-500/5 transition-all uppercase text-xs tracking-widest"
              >
                Restart
              </button>
              <button 
                className="w-full bg-transparent border border-purple-500/30 text-white font-bold py-4 rounded-xl hover:bg-purple-500/5 transition-all uppercase text-xs tracking-widest"
              >
                Settings
              </button>
            </div>

            <button 
              onClick={onExit}
              className="w-full mt-6 text-purple-400/50 font-black uppercase text-[10px] tracking-[0.3em] hover:text-purple-400 transition-colors"
            >
              Quit to Menu
            </button>
          </div>
        </div>
      )}

      {/* Lost Screen */}
      {isLost && (
        <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
           <div className="bg-[#0a0510] border border-pink-500/50 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full">
              <div className="p-4 bg-pink-500/10 rounded-full text-pink-500 animate-bounce">
                <Skull size={48} />
              </div>
              <div>
                <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase glow-purple">Sync Lost</h2>
                <p className="text-pink-500/60 mt-2 font-black text-xs uppercase tracking-widest">Progress: {gameState?.percent}%</p>
              </div>
              <div className="flex flex-col w-full gap-3 mt-4">
                <button 
                  onClick={restart}
                  className="w-full py-5 bg-white text-black font-black text-sm rounded-xl hover:scale-[1.02] transition-all uppercase tracking-[0.2em]"
                >
                  Quick Reboot
                </button>
                <button 
                  onClick={onExit}
                  className="w-full py-4 bg-transparent border border-white/10 text-white/30 font-bold text-xs rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest"
                >
                  Exit Mission
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Win Screen */}
      {isWon && (
        <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="bg-[#0a0510] border border-emerald-400/50 p-12 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full">
            <div className="p-4 bg-emerald-400/10 rounded-full text-emerald-300 animate-pulse">
              <Trophy size={48} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase glow-purple">Level Complete</h2>
              <p className="text-emerald-300/70 mt-2 font-black text-xs uppercase tracking-widest">Final: 100%</p>
            </div>
            <div className="flex flex-col w-full gap-3 mt-4">
              <button 
                onClick={restart}
                className="w-full py-5 bg-white text-black font-black text-sm rounded-xl hover:scale-[1.02] transition-all uppercase tracking-[0.2em]"
              >
                Run It Back
              </button>
              <button 
                onClick={onExit}
                className="w-full py-4 bg-transparent border border-white/10 text-white/30 font-bold text-xs rounded-xl hover:bg-white/5 transition-all uppercase tracking-widest"
              >
                Back to Levels
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;
