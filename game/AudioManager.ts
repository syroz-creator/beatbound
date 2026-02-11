
export class AudioManager {
  private ctx: AudioContext | null = null;
  private musicBuffer: AudioBuffer | null = null;
  private musicSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private startTime: number = 0;
  private isPlaying: boolean = false;
  private offsetMs: number = 0;
  private sfxVolume: number = 0.5;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.ctx.createGain();
    this.gainNode.connect(this.ctx.destination);
    this.sfxGainNode = this.ctx.createGain();
    this.sfxGainNode.connect(this.ctx.destination);
  }

  private createProceduralMusicBuffer(durationSec: number = 12) {
    if (!this.ctx) return null;
    const sr = this.ctx.sampleRate;
    const length = Math.floor(durationSec * sr);
    const buffer = this.ctx.createBuffer(1, length, sr);
    const data = buffer.getChannelData(0);

    const notes = [261.63, 329.63, 392.0, 523.25]; // C major arpeggio
    const tempo = 120;
    const beat = 60 / tempo;

    for (let i = 0; i < length; i++) {
      const t = i / sr;
      const step = Math.floor(t / beat) % notes.length;
      const notePos = (t % beat) / beat;
      const env = notePos < 0.08 ? notePos / 0.08 : Math.exp(-6 * (notePos - 0.08));
      const freq = notes[step];

      const lead = Math.sin(2 * Math.PI * freq * t) * 0.18 * env;
      const bass = Math.sin(2 * Math.PI * (freq / 2) * t) * 0.08 * env;

      const hatGate = (Math.floor(t / (beat / 2)) % 2) === 0 ? 1 : 0;
      const hatEnv = Math.max(0, 1 - (notePos * 6));
      const hat = (Math.random() * 2 - 1) * 0.02 * hatGate * hatEnv;

      let sample = lead + bass + hat;
      if (sample > 0.9) sample = 0.9;
      if (sample < -0.9) sample = -0.9;
      data[i] = sample;
    }

    return buffer;
  }

  async loadMusic(url?: string) {
    if (!this.ctx) return;
    if (!url) {
      this.musicBuffer = this.createProceduralMusicBuffer();
      return;
    }
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.musicBuffer = await this.ctx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.warn("Failed to load music:", e);
      this.musicBuffer = this.createProceduralMusicBuffer();
    }
  }

  setVolume(v: number) {
    if (this.gainNode) {
      this.gainNode.gain.setTargetAtTime(v, this.ctx?.currentTime || 0, 0.1);
    }
  }

  setSFXVolume(v: number) {
    this.sfxVolume = v;
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.setTargetAtTime(v, this.ctx?.currentTime || 0, 0.1);
    }
  }

  play(offsetMs: number = 0, seekTime: number = 0) {
    if (!this.ctx || !this.musicBuffer || !this.gainNode) return;
    this.stop();
    this.offsetMs = offsetMs;
    this.musicSource = this.ctx.createBufferSource();
    this.musicSource.buffer = this.musicBuffer;
    this.musicSource.loop = true;
    this.musicSource.connect(this.gainNode);
    
    this.startTime = this.ctx.currentTime - seekTime;
    this.musicSource.start(0, seekTime);
    this.isPlaying = true;
  }

  stop() {
    if (this.musicSource) {
      this.musicSource.stop();
      this.musicSource.disconnect();
      this.musicSource = null;
    }
    this.isPlaying = false;
  }

  // Synthesized Jump SFX
  playJumpSFX() {
    if (!this.ctx || !this.sfxGainNode) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.1, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.1);
    osc.connect(g);
    g.connect(this.sfxGainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Synthesized Death SFX
  playDeathSFX() {
    if (!this.ctx || !this.sfxGainNode) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.5);
    g.gain.setValueAtTime(0.2, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
    osc.connect(g);
    g.connect(this.sfxGainNode);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  get currentTime(): number {
    if (!this.ctx || !this.isPlaying) return 0;
    return this.ctx.currentTime - this.startTime + (this.offsetMs / 1000);
  }

  suspend() { this.ctx?.suspend(); }
  resume() { this.ctx?.resume(); }
}

export const audioManager = new AudioManager();
