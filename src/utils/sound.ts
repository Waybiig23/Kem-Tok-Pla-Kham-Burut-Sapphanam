/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Dual-Engine Audio Controller:
// Engine A: HTML5 Audio with Pre-Synthesized PCM WAV Blobs (100% reliable in iframes, Chrome, Safari, iOS)
// Engine B: Web Audio API Synthesizer with safe linear ramps

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Generate a valid 16-bit Mono PCM WAV Data Blob URL
function createPcmWavBlob(sampleRate: number, generateSamples: (t: number, total: number) => number, durationSec: number): string {
  const numSamples = Math.floor(sampleRate * durationSec);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1 = Mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // BitsPerSample (16 bits)

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Write 16-bit PCM audio samples
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sampleVal = Math.max(-1, Math.min(1, generateSamples(t, durationSec)));
    view.setInt16(44 + i * 2, sampleVal < 0 ? sampleVal * 0x8000 : sampleVal * 0x7fff, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// Pre-synthesize an upbeat, tropical marimba BGM loop (12-bar phrase, 9.6 seconds loop)
function generateTropicalBgmUrl(): string {
  const sampleRate = 22050;
  const loopDuration = 9.6;

  // Pentatonic notes in Hz
  const melodyNotes = [
    523.25, 659.25, 783.99, 659.25, // C E G E
    587.33, 440.00, 523.25, 440.00, // D A C A
    659.25, 783.99, 880.00, 1046.5, // E G A C
    783.99, 659.25, 587.33, 523.25, // G E D C
    440.00, 523.25, 659.25, 523.25, // A C E C
    587.33, 523.25, 440.00, 392.00, // D C A G
  ];

  const bassNotes = [
    130.81, 130.81, 174.61, 174.61, 196.00, 196.00, 220.00, 220.00,
    130.81, 130.81, 174.61, 174.61, 196.00, 196.00, 130.81, 130.81,
  ];

  const beatLen = loopDuration / melodyNotes.length;

  return createPcmWavBlob(sampleRate, (t) => {
    let sample = 0;

    // Melody layer
    const noteIdx = Math.floor(t / beatLen) % melodyNotes.length;
    const noteTime = t % beatLen;
    const freq = melodyNotes[noteIdx];
    const decay = Math.exp(-noteTime * 7);
    sample += (Math.sin(2 * Math.PI * freq * noteTime) * 0.4 +
               Math.sin(2 * Math.PI * freq * 2 * noteTime) * 0.15) * decay;

    // Bass layer (every 2 beats)
    const bassIdx = Math.floor(t / (beatLen * 1.5)) % bassNotes.length;
    const bassTime = t % (beatLen * 1.5);
    const bassFreq = bassNotes[bassIdx];
    const bassDecay = Math.exp(-bassTime * 4);
    sample += Math.sin(2 * Math.PI * bassFreq * bassTime) * 0.35 * bassDecay;

    return sample * 0.75;
  }, loopDuration);
}

// Pre-synthesize short SFX sound blobs
let correctWavUrl: string = '';
let wrongWavUrl: string = '';
let splashWavUrl: string = '';
let fanfareWavUrl: string = '';
let escapeWavUrl: string = '';
let bgmWavUrl: string = '';

function initWavBlobs() {
  if (typeof window === 'undefined' || correctWavUrl) return;

  const sampleRate = 22050;

  // Correct Ding (C5 - E5 - G5 chime)
  correctWavUrl = createPcmWavBlob(sampleRate, (t) => {
    let s = 0;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const dt = t - idx * 0.07;
      if (dt > 0) {
        s += Math.sin(2 * Math.PI * freq * dt) * Math.exp(-dt * 6) * 0.4;
      }
    });
    return s;
  }, 0.65);

  // Wrong Thump
  wrongWavUrl = createPcmWavBlob(sampleRate, (t) => {
    const f = 200 - t * 120;
    return Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 10) * 0.6;
  }, 0.35);

  // Splash sound
  splashWavUrl = createPcmWavBlob(sampleRate, (t) => {
    const noise = (Math.random() * 2 - 1) * Math.exp(-t * 9);
    const low = Math.sin(2 * Math.PI * 180 * t) * Math.exp(-t * 8) * 0.5;
    return noise * 0.4 + low;
  }, 0.3);

  // Escape line-snap & splash
  escapeWavUrl = createPcmWavBlob(sampleRate, (t) => {
    const f = 600 * Math.exp(-t * 8) + 120;
    const tone = Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 6) * 0.45;
    const splash = (Math.random() * 2 - 1) * Math.exp(-t * 7) * 0.4;
    return tone + splash;
  }, 0.45);

  // Fanfare victory chord
  fanfareWavUrl = createPcmWavBlob(sampleRate, (t) => {
    let s = 0;
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    chords.forEach((freq, idx) => {
      const dt = t - idx * 0.08;
      if (dt > 0) {
        s += Math.sin(2 * Math.PI * freq * dt) * Math.exp(-dt * 3.5) * 0.35;
      }
    });
    return s;
  }, 1.2);

  // Loopable Background Music
  bgmWavUrl = generateTropicalBgmUrl();
}

class RobustSoundController {
  private bgmAudio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isBgmEnabled: boolean = true;
  public isAudioActive: boolean = false;
  public isUnlocked: boolean = false;

  constructor() {
    this.isMuted = false;
    this.isBgmEnabled = true;

    // Clear any previous bad muting
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('thai_pronoun_fish_muted');
      } catch {
        // ignore
      }
    }
  }

  private initHtml5Audio() {
    if (typeof window === 'undefined') return;
    initWavBlobs();

    if (!this.bgmAudio && bgmWavUrl) {
      try {
        this.bgmAudio = new Audio(bgmWavUrl);
        this.bgmAudio.loop = true;
        this.bgmAudio.volume = 0.6;
      } catch (e) {
        console.warn('HTML5 Audio init notice:', e);
      }
    }
  }

  private initWebAudio() {
    if (!this.ctx && typeof window !== 'undefined') {
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch {
        // ignore
      }
    }
  }

  // Force play audio immediately and unlock both Web Audio & HTML5 Audio
  public unlock(): boolean {
    this.initHtml5Audio();
    this.initWebAudio();

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.isBgmEnabled && !this.isMuted && this.bgmAudio) {
      this.bgmAudio.volume = 0.6;
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isAudioActive = true;
          })
          .catch(() => {
            // will retry on next user gesture
          });
      }
    }

    return true;
  }

  // Called when user clicks "เปิดเสียงดนตรี" button
  public forceEnableAndPlay(): void {
    this.isMuted = false;
    this.isBgmEnabled = true;
    this.initHtml5Audio();
    this.initWebAudio();

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    if (this.bgmAudio) {
      this.bgmAudio.volume = 0.65;
      this.bgmAudio.currentTime = 0;
      this.bgmAudio.play().then(() => {
        this.isAudioActive = true;
      }).catch((e) => {
        console.warn('Play error:', e);
      });
    }

    // Play instant sound feedback
    this.playCorrect(3);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;

    if (this.bgmAudio) {
      if (this.isMuted) {
        this.bgmAudio.pause();
      } else if (this.isBgmEnabled) {
        this.bgmAudio.play().catch(() => {});
      }
    }

    return this.isMuted;
  }

  public toggleBGM(): boolean {
    this.isBgmEnabled = !this.isBgmEnabled;

    if (this.bgmAudio) {
      if (!this.isBgmEnabled || this.isMuted) {
        this.bgmAudio.pause();
      } else {
        this.bgmAudio.play().catch(() => {});
      }
    }

    return this.isBgmEnabled;
  }

  // Play sound using HTML5 Audio (Guaranteed to work across all browsers)
  private playWavClip(url: string, volume: number = 0.7) {
    if (this.isMuted || !url) return;
    try {
      const audio = new Audio(url);
      audio.volume = Math.max(0, Math.min(1, volume));
      audio.play().catch(() => {
        // Fallback to Web Audio if audio.play() was restricted
        this.playWebAudioBeep(650, 0.2);
      });
    } catch {
      this.playWebAudioBeep(650, 0.2);
    }
  }

  // Backup simple Web Audio beep
  private playWebAudioBeep(freq: number, duration: number) {
    if (this.isMuted) return;
    this.initWebAudio();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.linearRampToValueAtTime(0.01, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {
      // ignore
    }
  }

  // Correct answer chime
  public playCorrect(combo: number = 1) {
    if (this.isMuted) return;
    this.unlock();
    initWavBlobs();
    this.playWavClip(correctWavUrl, 0.85);

    // Also trigger Web Audio harmonic triad
    this.initWebAudio();
    if (this.ctx) {
      const base = 523.25 * (1 + (combo % 4) * 0.2);
      [base, base * 1.25, base * 1.5].forEach((f, idx) => {
        setTimeout(() => this.playWebAudioBeep(f, 0.25), idx * 50);
      });
    }
  }

  // Wrong thump
  public playWrong() {
    if (this.isMuted) return;
    this.unlock();
    initWavBlobs();
    this.playWavClip(wrongWavUrl, 0.7);
    this.playWebAudioBeep(180, 0.2);
  }

  // Splash sound
  public playSplash() {
    if (this.isMuted) return;
    this.unlock();
    initWavBlobs();
    this.playWavClip(splashWavUrl, 0.75);
  }

  // Reel click
  public playReel() {
    if (this.isMuted) return;
    this.unlock();
    this.playWebAudioBeep(850, 0.06);
  }

  // Option Click
  public playOptionClick() {
    if (this.isMuted) return;
    this.unlock();
    this.playWebAudioBeep(700, 0.08);
  }

  // Escape sound when creature breaks free
  public playEscape() {
    if (this.isMuted) return;
    this.unlock();
    initWavBlobs();
    this.playWavClip(escapeWavUrl, 0.85);
    this.playWebAudioBeep(220, 0.25);
  }

  // Fanfare when game over or quiz completed
  public playFanfare() {
    if (this.isMuted) return;
    this.unlock();
    initWavBlobs();
    this.playWavClip(fanfareWavUrl, 0.95);
  }
}

export const soundManager = new RobustSoundController();
