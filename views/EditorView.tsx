
import React, { useState, useRef, useEffect } from 'react';
import { Save, ChevronLeft, Plus, Trash2, Play, MousePointer2, Grid3X3 } from 'lucide-react';
import { LevelData, LevelObject, EntityType } from '../types';

interface EditorViewProps {
  onSave: (level: LevelData) => void;
  onBack: () => void;
}

const EditorView: React.FC<EditorViewProps> = ({ onSave, onBack }) => {
  const [level, setLevel] = useState<LevelData>({
    metadata: {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Track',
      author: 'Player',
      bpm: 120,
      songOffsetMs: 0,
      difficulty: 1
    },
    objects: []
  });

  const [selectedType, setSelectedType] = useState<EntityType>('platform');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cameraX, setCameraX] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileSize = 40;

  const addObject = (x: number, y: number) => {
    const gridX = Math.floor(x / tileSize) + Math.floor(cameraX / tileSize);
    const gridY = Math.floor(y / tileSize);

    const newObj: LevelObject = {
      id: Math.random().toString(36).substr(2, 9),
      type: selectedType,
      x: gridX,
      y: gridY,
      w: selectedType === 'platform' ? 5 : 1,
      h: selectedType === 'platform' ? 1 : 1
    };

    setLevel(prev => ({
      ...prev,
      objects: [...prev.objects, newObj]
    }));
  };

  const removeObject = (id: string) => {
    setLevel(prev => ({
      ...prev,
      objects: prev.objects.filter(o => o.id !== id)
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const draw = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const offsetX = -(cameraX % tileSize);
      for (let x = offsetX; x < canvas.width; x += tileSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += tileSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Objects
      for (const obj of level.objects) {
        const rx = obj.x * tileSize - cameraX;
        const ry = obj.y * tileSize;
        const rw = obj.w * tileSize;
        const rh = obj.h * tileSize;

        ctx.fillStyle = obj.id === selectedId ? '#06b6d4' : '#334155';
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(rx, ry, rw, rh);
      }
    };

    draw();
  }, [level, cameraX, selectedId]);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950">
      {/* Top Bar */}
      <div className="p-4 border-b border-slate-900 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg">
            <ChevronLeft size={20} />
          </button>
          <input 
            type="text" 
            value={level.metadata.name}
            onChange={(e) => setLevel({ ...level, metadata: { ...level.metadata, name: e.target.value }})}
            className="bg-transparent text-xl font-bold border-none outline-none focus:text-cyan-400"
          />
        </div>
        <div className="flex gap-2">
           <button onClick={() => setCameraX(c => Math.max(0, c - 200))} className="px-3 py-1 bg-slate-800 rounded text-xs uppercase font-bold tracking-widest">Prev</button>
           <button onClick={() => setCameraX(c => c + 200)} className="px-3 py-1 bg-slate-800 rounded text-xs uppercase font-bold tracking-widest">Next</button>
           <button onClick={() => onSave(level)} className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded-lg font-bold hover:bg-cyan-500 transition-colors">
             <Save size={18} /> SAVE
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Left: Palette */}
        <div className="w-64 p-4 border-r border-slate-900 flex flex-col gap-4 bg-slate-900/20">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Palette</h4>
          {(['platform', 'spike', 'orb', 'pad', 'portal'] as EntityType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-4 rounded-2xl flex items-center justify-between transition-all border ${selectedType === type ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
            >
              <span className="capitalize font-bold">{type}</span>
              <Plus size={16} />
            </button>
          ))}
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative cursor-crosshair">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            onMouseDown={(e) => {
              const rect = canvasRef.current!.getBoundingClientRect();
              addObject(e.clientX - rect.left, e.clientY - rect.top);
            }}
          />
          <div className="absolute bottom-4 right-4 bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[10px] text-slate-500 font-mono">
            X: {Math.floor(cameraX/tileSize)} | ZOOM: 1.0x
          </div>
        </div>

        {/* Sidebar Right: Properties */}
        <div className="w-80 p-6 border-l border-slate-900 bg-slate-900/20">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">Properties</h4>
          
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-500 font-bold">BPM</label>
              <input 
                type="number" 
                value={level.metadata.bpm} 
                onChange={(e) => setLevel({ ...level, metadata: { ...level.metadata, bpm: parseInt(e.target.value) }})}
                className="w-full bg-slate-900 border border-slate-800 p-2 rounded-xl text-white outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase text-slate-500 font-bold">Difficulty</label>
              <input 
                type="range" min="1" max="10"
                value={level.metadata.difficulty} 
                onChange={(e) => setLevel({ ...level, metadata: { ...level.metadata, difficulty: parseInt(e.target.value) }})}
                className="w-full accent-cyan-500"
              />
            </div>

            <div className="mt-8">
              <h5 className="text-sm font-bold mb-4">Object List</h5>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {level.objects.map(obj => (
                  <div key={obj.id} className="p-3 bg-slate-900 rounded-xl flex justify-between items-center group">
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-400">{obj.type}</span>
                      <p className="text-[10px] text-slate-500">X: {obj.x} Y: {obj.y}</p>
                    </div>
                    <button onClick={() => removeObject(obj.id)} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorView;
