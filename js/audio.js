// ============================================================================
// PROCEDURAL WEB AUDIO SYNTHESIZER & PULSAR SONIFIER
// 100% Procedural (Zero External Audio Files Needed)
// ============================================================================

class AstroAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.engineGain = null;
    this.engineOsc = null;
    this.engineFilter = null;
    this.bgmInterval = null;
    this.pulsarOsc = null;
    this.pulsarGain = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.initEngineSound();
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio init warning:", e);
    }
  }

  toggleMute() {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.8, now, 0.05);
    }
    if (!this.isMuted && !this.bgmInterval) {
      this.startAmbientMusic();
    }
    return this.isMuted;
  }

  // Continuous Engine Hum (frequency and volume modulated by throttle/boost)
  initEngineSound() {
    if (!this.ctx) return;
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.001, this.ctx.currentTime);

    this.engineFilter = this.ctx.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.setValueAtTime(110, this.ctx.currentTime);

    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(42, this.ctx.currentTime);

    this.engineOsc.connect(this.engineFilter);
    this.engineFilter.connect(this.engineGain);
    this.engineGain.connect(this.sfxGain);
    this.engineOsc.start();
  }

  updateEngine(throttle = 0, isBoosting = false) {
    if (!this.engineGain || !this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const targetFreq = isBoosting ? 135 : 42 + throttle * 55;
    const targetFilter = isBoosting ? 440 : 110 + throttle * 180;
    const targetVol = throttle > 0.01 || isBoosting ? (isBoosting ? 0.32 : 0.16 * throttle) : 0.001;

    this.engineOsc.frequency.setTargetAtTime(targetFreq, now, 0.1);
    this.engineFilter.frequency.setTargetAtTime(targetFilter, now, 0.1);
    this.engineGain.gain.setTargetAtTime(targetVol, now, 0.1);
  }

  // Retro Sci-Fi UI Click / Chirp
  playBlip(freq = 880, dur = 0.07) {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + dur);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + dur + 0.01);
    } catch (e) {}
  }

  // Lock-on Target Chirp
  playLockOn() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [587.33, 880, 1174.66].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.11);
      });
    } catch (e) {}
  }

  // Hyperspace Warp Jump Acoustic Boom
  playWarp() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High rising sweep
      const sweep = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      sweep.type = 'sawtooth';
      sweep.frequency.setValueAtTime(120, now);
      sweep.frequency.exponentialRampToValueAtTime(1900, now + 1.1);
      sweepGain.gain.setValueAtTime(0.01, now);
      sweepGain.gain.linearRampToValueAtTime(0.28, now + 0.7);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      // Deep sub-bass thunder
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(75, now + 0.7);
      sub.frequency.exponentialRampToValueAtTime(25, now + 1.9);
      subGain.gain.setValueAtTime(0.38, now + 0.7);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

      sweep.connect(sweepGain);
      sweepGain.connect(this.sfxGain);
      sub.connect(subGain);
      subGain.connect(this.sfxGain);

      sweep.start(now);
      sweep.stop(now + 1.5);
      sub.start(now + 0.7);
      sub.stop(now + 2.1);
    } catch (e) {}
  }

  // Docking / Panel Open Musical Chime
  playDock() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.07;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) {}
  }

  // ==========================================================================
  // REALISTIC PULSAR ACOUSTIC SONIFICATION
  // Millisecond pulsars rotate hundreds of times per second, producing audible tones!
  // ==========================================================================
  playPulsarTone(freqHz = 218.8, duration = 2.5) {
    if (!this.isInitialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Sharp pulse harmonics (pulsar radio beam profile)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freqHz, now);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freqHz * 1.5, now);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
      gain.gain.setValueAtTime(0.35, now + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {}
  }

  // Ambient Deep Space Music (Procedural Sci-Fi Chords: Gm9 - Ebmaj7 - Cm7 - D7alt)
  startAmbientMusic() {
    if (!this.ctx) return;
    const chords = [
      [196.00, 233.08, 293.66, 349.23, 440.00], // G, Bb, D, F, A (Gm9)
      [155.56, 196.00, 233.08, 293.66],         // Eb, G, Bb, D (Ebmaj7)
      [130.81, 155.56, 196.00, 233.08],         // C, Eb, G, Bb (Cm7)
      [146.83, 185.00, 220.00, 261.63, 311.13]  // D, F#, A, C, Eb (D7b9)
    ];
    let chordIdx = 0;

    const playNext = () => {
      if (this.isMuted || !this.ctx) return;
      const chord = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.ctx.currentTime;
      const dur = 6.2;

      chord.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.linearRampToValueAtTime(550, now + dur * 0.5);
        filter.frequency.linearRampToValueAtTime(280, now + dur);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.032, now + 1.8);
        gain.gain.linearRampToValueAtTime(0.001, now + dur - 0.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + dur);
      });
    };

    playNext();
    this.bgmInterval = setInterval(playNext, 5800);
  }
}

window.astroAudio = new AstroAudio();
