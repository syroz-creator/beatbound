
import { COLORS, PLAYER_SIZE } from '../constants';
import { GameState } from './Engine';
import { LevelData, GameMode, GameSettings } from '../types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileSize: number = 40;
  private particles: Particle[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.tileSize = this.canvas.height / 15; 
  }

  private getTheme(difficulty: number) {
    if (difficulty <= 3) {
      return {
        bg: '#062a6e',
        square: '#1b3f9b',
        squareInner: '#244bb3',
        grid: '#0b2a66',
        ground: '#9fd8ff',
        platformStroke: '#4aa3ff'
      };
    }
    if (difficulty <= 6) {
      return {
        bg: '#1b0f3b',
        square: '#2b1560',
        squareInner: '#381b7a',
        grid: '#1a0a46',
        ground: '#b084ff',
        platformStroke: '#7f6bff'
      };
    }
    return {
      bg: '#2b0b14',
      square: '#3e0f1f',
      squareInner: '#541327',
      grid: '#220812',
      ground: '#ff7aa2',
      platformStroke: '#ff547f'
    };
  }

  draw(state: GameState, level: LevelData, settings: GameSettings) {
    const ctx = this.ctx;
    const ts = this.tileSize;
    const camX = state.cameraX * ts;
    const camY = 0; 
    const theme = this.getTheme(level.metadata.difficulty);

    // 1. Background (Solid Blue)
    ctx.fillStyle = theme.bg; 
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 2. Parallax Large Squares
    if (settings.parallaxEnabled) {
      ctx.strokeStyle = theme.square; 
      ctx.lineWidth = 1;
      const bgSquareSize = ts * 5;
      const parallaxFactor = 0.3;
      const bgOffsetX = -(camX * parallaxFactor) % bgSquareSize;
      for (let x = bgOffsetX - bgSquareSize; x < this.canvas.width; x += bgSquareSize) {
        for (let y = 0; y < this.canvas.height; y += bgSquareSize) {
          ctx.strokeRect(x, y, bgSquareSize, bgSquareSize);
          // Simple inner square pattern to match image
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = theme.squareInner;
          ctx.strokeRect(x + 10, y + 10, bgSquareSize - 20, bgSquareSize - 20);
          ctx.strokeStyle = theme.square;
          ctx.globalAlpha = 1.0;
        }
      }
    }

    // 3. Grid Floor (Horizontal line only mostly)
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 10 * ts);
    ctx.lineTo(this.canvas.width, 10 * ts);
    ctx.stroke();

    // 4. Ground Glow Line
    ctx.strokeStyle = theme.ground;
    ctx.lineWidth = 2;
    if (settings.bloomEnabled) {
      ctx.shadowBlur = 10;
      ctx.shadowColor = theme.ground;
    }
    ctx.beginPath();
    ctx.moveTo(0, 10 * ts);
    ctx.lineTo(this.canvas.width, 10 * ts);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 5. Draw Level Objects
    for (const obj of level.objects) {
      const rx = obj.x * ts - camX;
      const ry = obj.y * ts - camY;
      const rw = obj.w * ts;
      const rh = obj.h * ts;

      if (rx + rw < -100 || rx > this.canvas.width + 100) continue;

      if (obj.type === 'platform') {
        // Black block with blue highlight border
        ctx.fillStyle = '#000000';
        ctx.fillRect(rx, ry, rw, rh);
        ctx.strokeStyle = theme.platformStroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(rx, ry, rw, rh);
      } else if (obj.type === 'spike') {
        // Triangle with glow border
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(rx, ry + rh);
        ctx.lineTo(rx + rw / 2, ry);
        ctx.lineTo(rx + rw, ry + rh);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (obj.type === 'orb') {
        ctx.fillStyle = COLORS.orb;
        if (settings.bloomEnabled) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = COLORS.orb;
        }
        ctx.beginPath();
        ctx.arc(rx + rw/2, ry + rh/2, rw/2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      } else if (obj.type === 'portal') {
        ctx.fillStyle = obj.portalType?.includes('fly') ? '#33ccff' : '#00ff00';
        ctx.globalAlpha = 0.3;
        ctx.fillRect(rx, ry, rw, rh);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(rx, ry, rw, rh);
      }
    }

    // 6. Player Particles
    if (settings.particlesEnabled) {
      if (!state.isDead) {
        this.particles.push({
          x: state.playerX * ts - camX + (PLAYER_SIZE * ts / 2),
          y: state.playerY * ts - camY + (PLAYER_SIZE * ts / 2),
          vx: (Math.random() - 1.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1.0,
          size: Math.random() * 4 + 2
        });
      }

      this.particles = this.particles.filter(p => p.life > 0);
      ctx.fillStyle = COLORS.player;
      for (const p of this.particles) {
        ctx.globalAlpha = p.life;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
      }
      ctx.globalAlpha = 1.0;
    }

    // 7. Draw Player (The Icon)
    const px = state.playerX * ts - camX;
    const py = state.playerY * ts - camY;
    const ps = PLAYER_SIZE * ts;

    ctx.save();
    ctx.translate(px + ps / 2, py + ps / 2);
    ctx.rotate(state.playerRot);
    
    // Outer white border
    ctx.fillStyle = '#ffffff';
    if (settings.bloomEnabled && !state.isDead) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = COLORS.player;
    }
    ctx.fillRect(-ps/2, -ps/2, ps, ps);
    ctx.shadowBlur = 0;
    
    // Body (Green)
    ctx.fillStyle = state.isDead ? '#ff0000' : '#00ff00';
    ctx.fillRect(-ps/2 + 2, -ps/2 + 2, ps - 4, ps - 4);

    // Inner Square Detail
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(-ps/4, -ps/4, ps/2, ps/2);
    ctx.strokeRect(-ps/8, -ps/8, ps/4, ps/4);

    ctx.restore();
  }
}
