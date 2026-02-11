
import { FIXED_STEP, GRAVITY, JUMP_VELOCITY, PLAYER_SIZE, DEFAULT_SPEED, FLY_THRUST } from '../constants';
import { GameMode, LevelData, LevelObject, PortalType } from '../types';
import { audioManager } from './AudioManager';

export interface GameState {
  playerX: number;
  playerY: number;
  playerVelY: number;
  playerRot: number;
  isDead: boolean;
  isGrounded: boolean;
  mode: GameMode;
  gravityInverted: boolean;
  speedMultiplier: number;
  percent: number;
  cameraX: number;
}

export class GameEngine {
  private level: LevelData;
  public state: GameState;
  private accumulator: number = 0;
  private lastTime: number = 0;
  private inputActive: boolean = false;
  private onDeath: () => void;
  private onWin: () => void;
  private floorY: number = 10; 

  constructor(level: LevelData, onDeath: () => void, onWin: () => void) {
    this.level = level;
    this.onDeath = onDeath;
    this.onWin = onWin;
    this.state = this.resetState();
  }

  private resetState(): GameState {
    return {
      playerX: 0,
      playerY: 5,
      playerVelY: 0,
      playerRot: 0,
      isDead: false,
      isGrounded: false,
      mode: GameMode.RUN,
      gravityInverted: false,
      speedMultiplier: 1.0,
      percent: 0,
      cameraX: 0
    };
  }

  public setInput(active: boolean) {
    this.inputActive = active;
  }

  public update(time: number) {
    if (this.state.isDead) return;
    if (this.lastTime === 0) {
      this.lastTime = time;
      return;
    }
    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;
    this.accumulator += deltaTime;
    while (this.accumulator >= FIXED_STEP) {
      this.step();
      this.accumulator -= FIXED_STEP;
    }
  }

  private step() {
    const s = this.state;
    const currentGravity = (s.gravityInverted ? -1 : 1) * GRAVITY;
    const currentJumpVel = (s.gravityInverted ? 1 : -1) * Math.abs(JUMP_VELOCITY);

    s.isGrounded = false;

    // X-Movement
    const stepSpeed = DEFAULT_SPEED * s.speedMultiplier * FIXED_STEP;
    s.playerX += stepSpeed;
    s.cameraX = s.playerX - 5; 

    // Y-Movement
    if (s.mode === GameMode.RUN) {
      s.playerVelY += currentGravity * FIXED_STEP;
    } else {
      if (this.inputActive) {
        s.playerVelY += (s.gravityInverted ? -FLY_THRUST : FLY_THRUST) * 2.0;
        // Ship mode thrust sound could go here if we had one
      } else {
        s.playerVelY += currentGravity * FIXED_STEP * 0.9;
      }
      const maxVel = 15;
      s.playerVelY = Math.max(-maxVel, Math.min(maxVel, s.playerVelY));
    }

    s.playerY += s.playerVelY * FIXED_STEP;

    this.checkCollisions();

    // Floor constraint
    if (!s.gravityInverted) {
      if (s.playerY + PLAYER_SIZE >= this.floorY) {
        s.playerY = this.floorY - PLAYER_SIZE;
        s.playerVelY = 0;
        s.isGrounded = true;
      }
    } else {
      if (s.playerY <= 0) {
        s.playerY = 0;
        s.playerVelY = 0;
        s.isGrounded = true;
      }
    }

    // In fly mode, cap the top range at the roof so the ship cannot go above it.
    if (s.mode === GameMode.FLY && s.playerY < 0) {
      s.playerY = 0;
      s.playerVelY = 0;
    }

    // Input
    if (s.mode === GameMode.RUN && this.inputActive && s.isGrounded) {
      s.playerVelY = currentJumpVel;
      s.isGrounded = false;
      audioManager.playJumpSFX();
    }

    // Rotation
    if (s.mode === GameMode.RUN) {
      if (s.isGrounded) {
        // Snap rotation when hitting ground
        const snap = Math.PI / 2;
        s.playerRot = Math.round(s.playerRot / snap) * snap;
      } else {
        s.playerRot += (s.gravityInverted ? -1 : 1) * 8 * FIXED_STEP;
      }
    } else {
      // Rotate ship based on velocity
      const targetRot = Math.atan2(s.playerVelY, DEFAULT_SPEED);
      s.playerRot = targetRot * 0.7;
    }

    // Death
    if (s.playerY > 30 || s.playerY < -20) this.die();

    // Progress
    const lastObj = this.level.objects[this.level.objects.length - 1];
    const finishX = (lastObj ? lastObj.x + lastObj.w : 100) + 10;
    s.percent = Math.min(100, Math.floor((s.playerX / finishX) * 100));
    if (s.percent >= 100) this.onWin();
  }

  private checkCollisions() {
    const s = this.state;
    const px = s.playerX;
    const py = s.playerY;
    const ps = PLAYER_SIZE;

    for (const obj of this.level.objects) {
      if (Math.abs(obj.x - px) > 12) continue;

      if (obj.type === 'platform') {
        if (px + ps > obj.x && px < obj.x + obj.w &&
            py + ps > obj.y && py < obj.y + obj.h) {
          
          const fromTop = py + ps - obj.y;
          const fromBottom = obj.y + obj.h - py;
          const fromLeft = px + ps - obj.x;

          if (fromLeft < 0.2) {
            this.die();
            return;
          } else if (fromTop < 0.4 && !s.gravityInverted) {
            s.playerY = obj.y - ps;
            s.playerVelY = 0;
            s.isGrounded = true;
          } else if (fromBottom < 0.4 && s.gravityInverted) {
            s.playerY = obj.y + obj.h;
            s.playerVelY = 0;
            s.isGrounded = true;
          } else {
            this.die();
            return;
          }
        }
      } else if (obj.type === 'spike') {
        const margin = 0.25;
        if (px + ps - margin > obj.x && px + margin < obj.x + obj.w &&
            py + ps - margin > obj.y && py + margin < obj.y + obj.h) {
          this.die();
          return;
        }
      } else if (obj.type === 'orb') {
        if (this.inputActive && 
            px + ps > obj.x && px < obj.x + obj.w &&
            py + ps > obj.y && py < obj.y + obj.h) {
          s.playerVelY = (s.gravityInverted ? 1 : -1) * Math.abs(JUMP_VELOCITY) * 0.85;
          audioManager.playJumpSFX(); // Orb acts like a mid-air jump
        }
      } else if (obj.type === 'portal') {
        if (px + ps > obj.x && px < obj.x + obj.w &&
            py + ps > obj.y && py < obj.y + obj.h) {
           if (obj.portalType === PortalType.MODE_FLY) s.mode = GameMode.FLY;
           if (obj.portalType === PortalType.MODE_RUN) s.mode = GameMode.RUN;
        }
      }
    }
  }

  private die() {
    if (this.state.isDead) return;
    this.state.isDead = true;
    audioManager.playDeathSFX();
    this.onDeath();
  }
}
