
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

const buildLongTail = (
  prefix: string,
  startX: number,
  segments: number,
  difficulty: number
): LevelData['objects'] => {
  const objs: LevelData['objects'] = [];
  let x = startX;

  for (let i = 0; i < segments; i++) {
    const pattern = i % 6;
    const width = 24 + ((i + difficulty) % 3) * 6;
    const pid = `${prefix}-${i}`;

    objs.push({ id: `${pid}-floor`, type: 'platform', x, y: 10, w: width, h: 2 });

    if (pattern === 0) {
      objs.push({ id: `${pid}-s1`, type: 'spike', x: x + 7, y: 9, w: 1, h: 1 });
      objs.push({ id: `${pid}-s2`, type: 'spike', x: x + 8, y: 9, w: 1, h: 1 });
      if (difficulty >= 5) objs.push({ id: `${pid}-s3`, type: 'spike', x: x + 14, y: 9, w: 1, h: 1 });
      objs.push({ id: `${pid}-b1`, type: 'platform', x: x + width - 7, y: 7, w: 5, h: 1 });
    } else if (pattern === 1) {
      objs.push({ id: `${pid}-step1`, type: 'platform', x: x + 6, y: 8, w: 4, h: 1 });
      objs.push({ id: `${pid}-step2`, type: 'platform', x: x + 13, y: 6, w: 4, h: 1 });
      objs.push({ id: `${pid}-orb`, type: 'orb', x: x + 11, y: 7, w: 1, h: 1 });
      if (difficulty >= 8) objs.push({ id: `${pid}-s1`, type: 'spike', x: x + 18, y: 9, w: 1, h: 1 });
    } else if (pattern === 2) {
      objs.push({ id: `${pid}-archL`, type: 'platform', x: x + 8, y: 5, w: 2, h: 5 });
      objs.push({ id: `${pid}-archR`, type: 'platform', x: x + 15, y: 5, w: 2, h: 5 });
      objs.push({ id: `${pid}-s1`, type: 'spike', x: x + 11, y: 9, w: 1, h: 1 });
      objs.push({ id: `${pid}-s2`, type: 'spike', x: x + 12, y: 9, w: 1, h: 1 });
      if (difficulty >= 5) objs.push({ id: `${pid}-top`, type: 'platform', x: x + 10, y: 4, w: 5, h: 1 });
    } else if (pattern === 3 && difficulty >= 4) {
      const flyLen = 30 + (difficulty >= 8 ? 8 : 0);
      objs.push({ id: `${pid}-flyIn`, type: 'portal', x: x + 4, y: 7, w: 1, h: 4, portalType: PortalType.MODE_FLY });
      objs.push({ id: `${pid}-flyFloor`, type: 'platform', x: x + 4, y: 13, w: flyLen, h: 1 });
      objs.push({ id: `${pid}-flyCeil`, type: 'platform', x: x + 4, y: 0, w: flyLen, h: 1 });
      for (let sx = x + 8; sx < x + flyLen; sx += 4) {
        objs.push({ id: `${pid}-ceilSpike-${sx}`, type: 'spike', x: sx, y: 1, w: 1, h: 1, rotation: 180 });
      }
      objs.push({ id: `${pid}-flyP1`, type: 'platform', x: x + 12, y: 3, w: 2, h: 7 });
      objs.push({ id: `${pid}-flyP2`, type: 'platform', x: x + 20, y: 6, w: 2, h: 4 });
      if (difficulty >= 8) objs.push({ id: `${pid}-flyP3`, type: 'platform', x: x + 28, y: 4, w: 2, h: 6 });
      objs.push({ id: `${pid}-flyOut`, type: 'portal', x: x + flyLen + 2, y: 7, w: 1, h: 4, portalType: PortalType.MODE_RUN });
      objs.push({ id: `${pid}-land`, type: 'platform', x: x + flyLen + 2, y: 10, w: 12, h: 2 });
      x += flyLen + 10;
      continue;
    } else if (pattern === 4) {
      objs.push({ id: `${pid}-s1`, type: 'spike', x: x + 6, y: 9, w: 1, h: 1 });
      objs.push({ id: `${pid}-s2`, type: 'spike', x: x + 10, y: 9, w: 1, h: 1 });
      objs.push({ id: `${pid}-s3`, type: 'spike', x: x + 14, y: 9, w: 1, h: 1 });
      if (difficulty >= 5) objs.push({ id: `${pid}-s4`, type: 'spike', x: x + 15, y: 9, w: 1, h: 1 });
      objs.push({ id: `${pid}-lift`, type: 'platform', x: x + width - 8, y: 7, w: 6, h: 1 });
    } else {
      objs.push({ id: `${pid}-orb1`, type: 'orb', x: x + 8, y: 7, w: 1, h: 1 });
      objs.push({ id: `${pid}-orb2`, type: 'orb', x: x + 15, y: difficulty >= 8 ? 6 : 7, w: 1, h: 1 });
      objs.push({ id: `${pid}-b1`, type: 'platform', x: x + 18, y: 6, w: 5, h: 1 });
      objs.push({ id: `${pid}-s1`, type: 'spike', x: x + width - 5, y: 9, w: 1, h: 1 });
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
    { id: 'cs1', type: 'spike', x: 138, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'cs2', type: 'spike', x: 146, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'cs3', type: 'spike', x: 154, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'cs4', type: 'spike', x: 162, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'cs5', type: 'spike', x: 170, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'cs6', type: 'spike', x: 178, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'cs7', type: 'spike', x: 186, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'cs8', type: 'spike', x: 194, y: 1, w: 1, h: 1, rotation: 180 },
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
    ...buildLongTail('t', 280, 18, 1),
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
    ...buildLongTail('e', 220, 20, 2),
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
    { id: 'n-cs1', type: 'spike', x: 98, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'n-cs2', type: 'spike', x: 106, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'n-cs3', type: 'spike', x: 114, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'n-cs4', type: 'spike', x: 122, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'n-cs5', type: 'spike', x: 130, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'n-cs6', type: 'spike', x: 138, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'n-h1', type: 'platform', x: 104, y: 4, w: 2, h: 6 },
    { id: 'n-h2', type: 'platform', x: 118, y: 7, w: 2, h: 4 },
    { id: 'n-h3', type: 'platform', x: 132, y: 3, w: 2, h: 7 },
    { id: 'n-p2', type: 'portal', x: 150, y: 7, w: 1, h: 4, portalType: PortalType.MODE_RUN },
    { id: 'n-f3', type: 'platform', x: 150, y: 10, w: 40, h: 2 },
    { id: 'n-s4', type: 'spike', x: 165, y: 9, w: 1, h: 1 },
    { id: 'n-s5', type: 'spike', x: 172, y: 9, w: 1, h: 1 },
    { id: 'n-f4', type: 'platform', x: 185, y: 10, w: 35, h: 2 },
    ...buildLongTail('n', 230, 20, 5),
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
    { id: 'h-cs1', type: 'spike', x: 78, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs2', type: 'spike', x: 84, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs3', type: 'spike', x: 90, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs4', type: 'spike', x: 96, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs5', type: 'spike', x: 102, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs6', type: 'spike', x: 108, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs7', type: 'spike', x: 114, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs8', type: 'spike', x: 120, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs9', type: 'spike', x: 126, y: 1, w: 1, h: 1, rotation: 180 },
    { id: 'h-cs10', type: 'spike', x: 132, y: 1, w: 1, h: 1, rotation: 180 },
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
    ...buildLongTail('h', 230, 22, 8),
  ]
};

export const BUILTIN_LEVELS: LevelData[] = [
  TUTORIAL_LEVEL,
  EASY_LEVEL,
  NORMAL_LEVEL,
  HARD_LEVEL
];
