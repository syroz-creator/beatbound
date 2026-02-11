
export type EntityType = "platform" | "spike" | "pad" | "orb" | "portal" | "checkpoint" | "deco";

export enum GameMode {
  RUN = "run",
  FLY = "fly"
}

export enum PortalType {
  MODE_RUN = "mode_run",
  MODE_FLY = "mode_fly",
  GRAVITY_INV = "gravity_inv",
  GRAVITY_NORM = "gravity_norm",
  SPEED_75 = "speed_075",
  SPEED_100 = "speed_100",
  SPEED_125 = "speed_125",
  SPEED_150 = "speed_150"
}

export interface LevelObject {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  color?: string;
  portalType?: PortalType;
  timeLock?: boolean; // If true, x is calculated by beat time
}

export interface LevelMetadata {
  id: string;
  name: string;
  author: string;
  bpm: number;
  songUrl?: string;
  songOffsetMs: number;
  difficulty: number; // 1-10
}

export interface LevelData {
  metadata: LevelMetadata;
  objects: LevelObject[];
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  audioOffset: number;
  visualOffset: number;
  showHitboxes: boolean;
  screenShake: boolean;
  reduceMotion: boolean;
  fpsCap: number;
  skinId: number;
  // Graphics specific
  bloomEnabled: boolean;
  particlesEnabled: boolean;
  parallaxEnabled: boolean;
}

export interface ProgressState {
  completedLevels: Record<string, number>; // levelId -> percentage
  attempts: Record<string, number>; // levelId -> attempts
  totalJumps: number;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}
