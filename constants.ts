
import { GameSettings, LevelData, GameMode, PortalType } from './types';

export const APP_NAME = "RHYTHM GRID";
export const VERSION = "ALPHA 1.0";

/**
 * GOOGLE CONFIGURATION
 * Replace this with your Client ID from the Google Cloud Console.
 * Origin: The URL of this website.
 */
export const GOOGLE_CLIENT_ID = "109119360257-j53k46f9uncfcdk44gsv9o52cd67r8ks.apps.googleusercontent.com";

// Physics Constants (Balanced for GD-style "Earth" gravity feel)
export const PHYSICS_TPS = 120;
export const FIXED_STEP = 1 / PHYSICS_TPS;
export const GRAVITY = 32; 
export const JUMP_VELOCITY = -12.5; 
export const FLY_THRUST = -0.6;
export const PLAYER_SIZE = 0.8; 
export const DEFAULT_SPEED = 10.4; // GD standard speed roughly translates to this at 120hz

export const COLORS = {
  bg: '#0033cc', // Iconic GD blue
  player: '#00ff00', // Classic lime green player
  hazard: '#ffffff', // Spikes often have white outlines
  platform: '#000000', // Platforms usually black centers
  accent: '#00ccff',
  portal: '#00ff9d',
  orb: '#ffcc00', 
  pad: '#ff33ff',
};

export const DEFAULT_SETTINGS: GameSettings = {
  musicVolume: 0.7,
  sfxVolume: 0.5,
  audioOffset: 0,
  visualOffset: 0,
  showHitboxes: false,
  screenShake: true,
  reduceMotion: false,
  fpsCap: 0, 
  skinId: 0,
  bloomEnabled: true,
  particlesEnabled: true,
  parallaxEnabled: true,
};

const buildLongTail = (prefix: string, startX: number, segments: number): LevelData['objects'] => {
  const objs: LevelData['objects'] = [];
  let x = startX;
  for (let i = 0; i < segments; i++) {
    const width = 26 + (i % 3) * 6;
    objs.push({ id: `${prefix}-f${i}`, type: 'platform', x, y: 10, w: width, h: 2 });
    if (i % 4 === 1) {
      objs.push({ id: `${prefix}-s${i}`, type: 'spike', x: x + Math.max(6, Math.floor(width / 3)), y: 9, w: 1, h: 1 });
    }
    if (i % 6 === 3) {
      objs.push({ id: `${prefix}-b${i}`, type: 'platform', x: x + width - 6, y: 7, w: 5, h: 1 });
    }
    x += width + 6;
  }
  return objs;
};

export const TUTORIAL_LEVEL: LevelData = {
  metadata: {
    id: 'track-01',
    name: 'STEREO MADNESS',
    author: 'SYSTEM',
    bpm: 128,
    songUrl: '/audio/A Lonely Cherry Tree 🌸 - Pix.mp3',
    songOffsetMs: 0,
    difficulty: 1
  },
  objects: [
    // Starting straight
    { id: 'f1', type: 'platform', x: 0, y: 10, w: 50, h: 2 },
    { id: 's1', type: 'spike', x: 18, y: 9, w: 1, h: 1 },
    { id: 's2', type: 'spike', x: 28, y: 9, w: 1, h: 1 },
    { id: 's3', type: 'spike', x: 29, y: 9, w: 1, h: 1 },
    
    // First blocks
    { id: 'b1', type: 'platform', x: 40, y: 8, w: 3, h: 1 },
    { id: 'b2', type: 'platform', x: 46, y: 6, w: 3, h: 1 },
    
    // Gap
    { id: 'f2', type: 'platform', x: 55, y: 10, w: 40, h: 2 },
    { id: 's4', type: 'spike', x: 60, y: 9, w: 1, h: 1 },
    { id: 's5', type: 'spike', x: 61, y: 9, w: 1, h: 1 },
    
    // Higher path
    { id: 'b3', type: 'platform', x: 70, y: 7, w: 10, h: 1 },
    { id: 's6', type: 'spike', x: 75, y: 6, w: 1, h: 1 },
    
    // Orb jump
    { id: 'f3', type: 'platform', x: 100, y: 10, w: 50, h: 2 },
    { id: 'o1', type: 'orb', x: 105, y: 7, w: 1, h: 1 },
    { id: 'b4', type: 'platform', x: 112, y: 5, w: 5, h: 1 },
    
    // Ship section (Quack mode)
    { id: 'p1', type: 'portal', x: 130, y: 7, w: 1, h: 4, portalType: PortalType.MODE_FLY },
    { id: 'floor', type: 'platform', x: 130, y: 13, w: 100, h: 1 },
    { id: 'ceil', type: 'platform', x: 130, y: 0, w: 100, h: 1 },
    { id: 'h1', type: 'platform', x: 150, y: 4, w: 2, h: 6 },
    { id: 'h2', type: 'platform', x: 170, y: 6, w: 2, h: 4 },
    { id: 'h3', type: 'platform', x: 190, y: 3, w: 2, h: 7 },
    
    // Exit ship
    { id: 'p2', type: 'portal', x: 210, y: 7, w: 1, h: 4, portalType: PortalType.MODE_RUN },
    { id: 'f4', type: 'platform', x: 210, y: 10, w: 50, h: 2 },
    
    // End sequence
    { id: 's7', type: 'spike', x: 230, y: 9, w: 1, h: 1 },
    { id: 's8', type: 'spike', x: 231, y: 9, w: 1, h: 1 },
    { id: 's9', type: 'spike', x: 232, y: 9, w: 1, h: 1 },
    { id: 'f5', type: 'platform', x: 260, y: 10, w: 10, h: 2 },
    ...buildLongTail('t', 280, 18),
  ]
};

export const EASY_LEVEL: LevelData = {
  metadata: {
    id: 'track-02',
    name: 'NEON PATH',
    author: 'SYSTEM',
    bpm: 120,
    songUrl: '/audio/A Lonely Cherry Tree 🌸 - Pix.mp3',
    songOffsetMs: 0,
    difficulty: 2
  },
  objects: [
    { id: 'e-f1', type: 'platform', x: 0, y: 10, w: 60, h: 2 },
    { id: 'e-s1', type: 'spike', x: 22, y: 9, w: 1, h: 1 },
    { id: 'e-s2', type: 'spike', x: 36, y: 9, w: 1, h: 1 },
    { id: 'e-b1', type: 'platform', x: 55, y: 8, w: 6, h: 1 },
    { id: 'e-f2', type: 'platform', x: 70, y: 10, w: 50, h: 2 },
    { id: 'e-o1', type: 'orb', x: 80, y: 7, w: 1, h: 1 },
    { id: 'e-b2', type: 'platform', x: 88, y: 6, w: 6, h: 1 },
    { id: 'e-s3', type: 'spike', x: 98, y: 9, w: 1, h: 1 },
    { id: 'e-f3', type: 'platform', x: 110, y: 10, w: 45, h: 2 },
    { id: 'e-b3', type: 'platform', x: 125, y: 7, w: 6, h: 1 },
    { id: 'e-s4', type: 'spike', x: 135, y: 9, w: 1, h: 1 },
    { id: 'e-f4', type: 'platform', x: 150, y: 10, w: 40, h: 2 },
    { id: 'e-s5', type: 'spike', x: 165, y: 9, w: 1, h: 1 },
    { id: 'e-f5', type: 'platform', x: 180, y: 10, w: 30, h: 2 },
    ...buildLongTail('e', 220, 20),
  ]
};

export const NORMAL_LEVEL: LevelData = {
  metadata: {
    id: 'track-03',
    name: 'PULSE DRIVE',
    author: 'SYSTEM',
    bpm: 140,
    songUrl: '/audio/A Lonely Cherry Tree 🌸 - Pix.mp3',
    songOffsetMs: 0,
    difficulty: 5
  },
  objects: [
    { id: 'n-f1', type: 'platform', x: 0, y: 10, w: 45, h: 2 },
    { id: 'n-s1', type: 'spike', x: 18, y: 9, w: 1, h: 1 },
    { id: 'n-s2', type: 'spike', x: 26, y: 9, w: 1, h: 1 },
    { id: 'n-b1', type: 'platform', x: 40, y: 7, w: 6, h: 1 },
    { id: 'n-f2', type: 'platform', x: 52, y: 10, w: 35, h: 2 },
    { id: 'n-o1', type: 'orb', x: 60, y: 7, w: 1, h: 1 },
    { id: 'n-b2', type: 'platform', x: 70, y: 6, w: 5, h: 1 },
    { id: 'n-s3', type: 'spike', x: 80, y: 9, w: 1, h: 1 },
    { id: 'n-p1', type: 'portal', x: 90, y: 7, w: 1, h: 4, portalType: PortalType.MODE_FLY },
    { id: 'n-floor', type: 'platform', x: 90, y: 13, w: 60, h: 1 },
    { id: 'n-ceil', type: 'platform', x: 90, y: 0, w: 60, h: 1 },
    { id: 'n-h1', type: 'platform', x: 104, y: 4, w: 2, h: 6 },
    { id: 'n-h2', type: 'platform', x: 118, y: 7, w: 2, h: 4 },
    { id: 'n-h3', type: 'platform', x: 132, y: 3, w: 2, h: 7 },
    { id: 'n-p2', type: 'portal', x: 150, y: 7, w: 1, h: 4, portalType: PortalType.MODE_RUN },
    { id: 'n-f3', type: 'platform', x: 150, y: 10, w: 40, h: 2 },
    { id: 'n-s4', type: 'spike', x: 165, y: 9, w: 1, h: 1 },
    { id: 'n-s5', type: 'spike', x: 172, y: 9, w: 1, h: 1 },
    { id: 'n-f4', type: 'platform', x: 185, y: 10, w: 35, h: 2 },
    ...buildLongTail('n', 230, 20),
  ]
};

export const HARD_LEVEL: LevelData = {
  metadata: {
    id: 'track-04',
    name: 'EDGE SHIFT',
    author: 'SYSTEM',
    bpm: 160,
    songUrl: '/audio/A Lonely Cherry Tree 🌸 - Pix.mp3',
    songOffsetMs: 0,
    difficulty: 8
  },
  objects: [
    { id: 'h-f1', type: 'platform', x: 0, y: 10, w: 35, h: 2 },
    { id: 'h-s1', type: 'spike', x: 12, y: 9, w: 1, h: 1 },
    { id: 'h-s2', type: 'spike', x: 13, y: 9, w: 1, h: 1 },
    { id: 'h-s3', type: 'spike', x: 20, y: 9, w: 1, h: 1 },
    { id: 'h-b1', type: 'platform', x: 28, y: 6, w: 5, h: 1 },
    { id: 'h-o1', type: 'orb', x: 32, y: 5, w: 1, h: 1 },
    { id: 'h-b2', type: 'platform', x: 40, y: 7, w: 5, h: 1 },
    { id: 'h-f2', type: 'platform', x: 52, y: 10, w: 30, h: 2 },
    { id: 'h-s4', type: 'spike', x: 60, y: 9, w: 1, h: 1 },
    { id: 'h-s5', type: 'spike', x: 61, y: 9, w: 1, h: 1 },
    { id: 'h-p1', type: 'portal', x: 70, y: 7, w: 1, h: 4, portalType: PortalType.MODE_FLY },
    { id: 'h-floor', type: 'platform', x: 70, y: 13, w: 80, h: 1 },
    { id: 'h-ceil', type: 'platform', x: 70, y: 0, w: 80, h: 1 },
    { id: 'h-h1', type: 'platform', x: 86, y: 2, w: 2, h: 9 },
    { id: 'h-h2', type: 'platform', x: 100, y: 6, w: 2, h: 5 },
    { id: 'h-h3', type: 'platform', x: 114, y: 3, w: 2, h: 8 },
    { id: 'h-h4', type: 'platform', x: 128, y: 5, w: 2, h: 6 },
    { id: 'h-p2', type: 'portal', x: 150, y: 7, w: 1, h: 4, portalType: PortalType.MODE_RUN },
    { id: 'h-f3', type: 'platform', x: 150, y: 10, w: 40, h: 2 },
    { id: 'h-s6', type: 'spike', x: 162, y: 9, w: 1, h: 1 },
    { id: 'h-s7', type: 'spike', x: 170, y: 9, w: 1, h: 1 },
    { id: 'h-s8', type: 'spike', x: 178, y: 9, w: 1, h: 1 },
    { id: 'h-f4', type: 'platform', x: 190, y: 10, w: 30, h: 2 },
    ...buildLongTail('h', 230, 22),
  ]
};

export const BUILTIN_LEVELS: LevelData[] = [
  TUTORIAL_LEVEL,
  EASY_LEVEL,
  NORMAL_LEVEL,
  HARD_LEVEL
];
