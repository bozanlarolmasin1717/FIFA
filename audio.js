/**
 * YASIRIN FIFA 26 - AUDIO & MUSIC SYNTHESIS ENGINE
 * High-performance Web Audio API engine providing:
 * - Multi-track procedural FIFA Soundtrack (3 electronic/stadium tracks with drums, bass, chords, leads)
 * - Living 60,000-seat stadium crowd atmosphere & dynamic chants
 * - Authentic football sound effects (kicks, passes, shots, tackles, crossbar clang, net ripple, pea whistle)
 * - 4-channel audio mixer (Master, Music, SFX, Crowd)
 * - Zero network latency, zero external asset dependencies
 */

class FIFAAudioEngine {
  constructor() {
    this.ctx = null;
    this.isUnlocked = false;

    // Volume states (0.0 to 1.0)
    this.volumes = {
      master: 0.85,
      music: 0.70,
      sfx: 0.85,
      crowd: 0.65
    };
    this.isMuted = false;

    // Gain Nodes
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.crowdGain = null;

    // Crowd Ambience State
    this.crowdSource = null;
    this.crowdFilter = null;
    this.crowdLFO = null;
    this.isCrowdPlaying = false;
    this.chantTimer = null;

    // Music Player State
    this.isPlayingMusic = false;
    this.currentTrackIndex = 0;
    this.musicSchedulerTimer = null;
    this.nextNoteTime = 0;
    this.current16thNote = 0;
    this.tracks = [
      {
        id: 1,
        title: "Electric Kickoff",
        artist: "Yasirin Sound Lab",
        genre: "Electro Stadium Hype",
        bpm: 124,
        scale: [57, 60, 62, 64, 67, 69, 72], // A minor pentatonic / hexatonic
        chords: [
          [45, 57, 60, 64], // Am
          [41, 53, 57, 60], // F
          [48, 55, 60, 64], // C
          [43, 55, 59, 62]  // G
        ]
      },
      {
        id: 2,
        title: "Golden Trophy",
        artist: "Bernabéu Beats",
        genre: "Groovy Synthwave",
        bpm: 114,
        scale: [50, 53, 55, 57, 60, 62, 65], // D minor
        chords: [
          [50, 57, 62, 65], // Dm
          [46, 53, 58, 62], // Bb
          [48, 55, 60, 65], // C
          [45, 52, 57, 60]  // Am
        ]
      },
      {
        id: 3,
        title: "Champions Arena",
        artist: "FIFA Grand Stage",
        genre: "Festival Bass Rush",
        bpm: 128,
        scale: [52, 55, 57, 59, 62, 64, 67], // E minor
        chords: [
          [40, 52, 55, 59], // Em
          [48, 55, 60, 64], // C
          [43, 55, 59, 62], // G
          [45, 57, 60, 64]  // D/Am
        ]
      }
    ];

    // UI callbacks
    this.onTrackChange = null;
  }

  // --- Audio Context & Graph Initialization ---
  init() {
    if (this.isUnlocked && this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioContextClass();
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Build Master Graph
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volumes.master, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        // Music Channel
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.volumes.music, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        // SFX Channel
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.volumes.sfx, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        // Stadium Crowd Channel
        this.crowdGain = this.ctx.createGain();
        this.crowdGain.gain.setValueAtTime(this.volumes.crowd, this.ctx.currentTime);
        this.crowdGain.connect(this.masterGain);
      }

      this.isUnlocked = true;
    } catch (e) {
      console.warn("Web Audio API not supported or blocked:", e);
    }
  }

  // Convert MIDI note number to frequency (Hz)
  mtof(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  // --- Master & Channel Volume Control ---
  setMasterVolume(val) {
    this.volumes.master = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volumes.master, this.ctx.currentTime);
    }
  }

  setMusicVolume(val) {
    this.volumes.music = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.volumes.music, this.ctx.currentTime);
    }
  }

  setSFXVolume(val) {
    this.volumes.sfx = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.volumes.sfx, this.ctx.currentTime);
    }
  }

  setCrowdVolume(val) {
    this.volumes.crowd = Math.max(0, Math.min(1, val));
    if (this.crowdGain && this.ctx) {
      this.crowdGain.gain.setValueAtTime(this.volumes.crowd, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volumes.master, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // =========================================================================
  // --- PROCEDURAL FIFA SOUNDTRACK SYNTHESIZER (BGM) ---
  // =========================================================================
  startMusic(trackIndex = 0) {
    this.init();
    if (!this.ctx) return;

    if (trackIndex !== undefined) {
      this.currentTrackIndex = trackIndex % this.tracks.length;
    }

    if (this.isPlayingMusic) {
      this.stopMusic();
    }

    this.isPlayingMusic = true;
    this.current16thNote = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    this.scheduleMusic();
    this.notifyTrackChange();
  }

  stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicSchedulerTimer) {
      clearTimeout(this.musicSchedulerTimer);
      this.musicSchedulerTimer = null;
    }
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % this.tracks.length;
    this.startMusic(nextIdx);
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.startMusic(prevIdx);
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  notifyTrackChange() {
    if (this.onTrackChange) {
      this.onTrackChange(this.getCurrentTrack());
    }
  }

  scheduleMusic() {
    if (!this.isPlayingMusic || !this.ctx) return;

    const track = this.tracks[this.currentTrackIndex];
    const secondsPerBeat = 60.0 / track.bpm;
    const secondsPer16th = secondsPerBeat / 4.0;
    const scheduleAheadTime = 0.2; // 200ms lookahead

    while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
      this.playPatternStep(this.nextNoteTime, this.current16thNote, track);
      this.nextNoteTime += secondsPer16th;
      this.current16thNote = (this.current16thNote + 1) % 64; // 4-bar pattern (16 * 4)
    }

    this.musicSchedulerTimer = setTimeout(() => this.scheduleMusic(), 50);
  }

  playPatternStep(time, step, track) {
    const bar = Math.floor(step / 16);
    const stepInBar = step % 16;
    const chord = track.chords[bar % track.chords.length];

    // 1. KICK DRUM: Punchy 4-on-the-floor on steps 0, 4, 8, 12 + occasional syncopation
    if (stepInBar % 4 === 0 || (stepInBar === 14 && bar % 2 === 1)) {
      this.synthKick(time, stepInBar === 0 ? 0.95 : 0.8);
    }

    // 2. SNARE / CLAP: On beats 2 and 4 (steps 4 and 12) + roll at end of 4th bar
    if (stepInBar === 4 || stepInBar === 12) {
      this.synthSnare(time, 0.7);
    } else if (bar === 3 && stepInBar >= 12) {
      this.synthSnare(time, 0.5 + (stepInBar - 12) * 0.1);
    }

    // 3. HI-HATS: 16th-note groovy offbeat pattern
    if (stepInBar % 2 === 1) {
      this.synthHiHat(time, stepInBar % 4 === 2 ? 0.45 : 0.3, stepInBar === 10);
    }

    // 4. BASSLINE: Syncopated synth bass following current chord root
    const bassNote = chord[0];
    const playBassSteps = [0, 3, 6, 8, 10, 12, 14];
    if (playBassSteps.includes(stepInBar)) {
      const isOctave = (stepInBar === 6 || stepInBar === 14);
      const noteFreq = this.mtof(bassNote + (isOctave ? 12 : 0));
      this.synthBass(time, noteFreq, 0.16);
    }

    // 5. CHORD PAD / STABS: Melodic rhythmic stabs on offbeats
    if (stepInBar === 2 || stepInBar === 8 || stepInBar === 11) {
      this.synthChordStab(time, chord, 0.22);
    }

    // 6. LEAD ARPEGGIO / HOOK: Catchy upbeat melodic motif
    if (step % 2 === 0) {
      const melodyIdx = (step * 3 + bar) % track.scale.length;
      const note = track.scale[melodyIdx] + 12; // Octave up
      this.synthLeadArp(time, this.mtof(note), 0.14);
    }
  }

  synthKick(time, velocity = 0.9) {
    if (!this.musicGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.08);

      gain.gain.setValueAtTime(velocity * 0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + 0.2);
    } catch (e) {}
  }

  synthSnare(time, velocity = 0.7) {
    if (!this.musicGain || !this.ctx) return;
    try {
      // Noise burst for snap
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(velocity * 0.6, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      // Body tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.08);
      oscGain.gain.setValueAtTime(velocity * 0.4, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc.connect(oscGain);
      oscGain.connect(this.musicGain);

      noise.start(time);
      osc.start(time);
      osc.stop(time + 0.09);
    } catch (e) {}
  }

  synthHiHat(time, velocity = 0.35, open = false) {
    if (!this.musicGain || !this.ctx) return;
    try {
      const dur = open ? 0.12 : 0.04;
      const bufferSize = Math.floor(this.ctx.sampleRate * dur);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * (open ? 0.06 : 0.015)));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(7500, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(velocity * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      noise.start(time);
    } catch (e) {}
  }

  synthBass(time, freq, dur = 0.16) {
    if (!this.musicGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);
      filter.frequency.exponentialRampToValueAtTime(140, time + dur);
      filter.Q.setValueAtTime(4, time);

      gain.gain.setValueAtTime(0.42, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + dur);
    } catch (e) {}
  }

  synthChordStab(time, chordNotes, dur = 0.22) {
    if (!this.musicGain || !this.ctx) return;
    try {
      chordNotes.forEach((midi, idx) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(this.mtof(midi), time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1800, time);
        filter.frequency.exponentialRampToValueAtTime(600, time + dur);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.musicGain);

        osc.start(time);
        osc.stop(time + dur);
      });
    } catch (e) {}
  }

  synthLeadArp(time, freq, dur = 0.12) {
    if (!this.musicGain || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + dur);
    } catch (e) {}
  }

  // =========================================================================
  // --- STADIUM ATMOSPHERE & LIVING CROWD SOUNDS ---
  // =========================================================================
  startStadiumCrowd() {
    this.init();
    if (!this.ctx || this.isCrowdPlaying) return;

    try {
      // 1. Continuous Living Stadium Presence (Pink noise filtered)
      const bufferSize = this.ctx.sampleRate * 4; // 4 second looping noise buffer
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      this.crowdSource = this.ctx.createBufferSource();
      this.crowdSource.buffer = noiseBuffer;
      this.crowdSource.loop = true;

      // Resonant filters to create the authentic arena hum
      this.crowdFilter = this.ctx.createBiquadFilter();
      this.crowdFilter.type = 'bandpass';
      this.crowdFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.crowdFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      // Low LFO to create slow stadium crowd breathing/waves
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 5-second cycle
      lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);
      lfo.connect(this.crowdFilter.frequency);
      lfo.start();
      this.crowdLFO = lfo;

      this.crowdSource.connect(this.crowdFilter);
      this.crowdFilter.connect(this.crowdGain);

      this.crowdSource.start();
      this.isCrowdPlaying = true;

      // Start periodic crowd chants & claps
      this.scheduleCrowdChants();
    } catch (e) {
      console.warn("Could not start crowd atmosphere:", e);
    }
  }

  stopStadiumCrowd() {
    if (this.crowdSource) {
      try {
        this.crowdSource.stop();
        this.crowdSource.disconnect();
      } catch (e) {}
      this.crowdSource = null;
    }
    if (this.crowdLFO) {
      try {
        this.crowdLFO.stop();
        this.crowdLFO.disconnect();
      } catch (e) {}
      this.crowdLFO = null;
    }
    if (this.chantTimer) {
      clearTimeout(this.chantTimer);
      this.chantTimer = null;
    }
    this.isCrowdPlaying = false;
  }

  scheduleCrowdChants() {
    if (!this.isCrowdPlaying) return;
    const nextChantDelay = 12000 + Math.random() * 10000; // Every 12-22 seconds
    this.chantTimer = setTimeout(() => {
      if (this.isCrowdPlaying) {
        this.playCrowdClapPattern();
        this.scheduleCrowdChants();
      }
    }, nextChantDelay);
  }

  playCrowdClapPattern() {
    if (!this.crowdGain || !this.ctx) return;
    // Rhythmic stadium clap: CLAP ... CLAP ... CLAP-CLAP-CLAP
    const now = this.ctx.currentTime;
    const clapTimes = [0, 0.8, 1.6, 2.4, 2.8, 3.2, 4.0, 4.4, 4.8];
    clapTimes.forEach(t => {
      this.playStadiumClap(now + t);
    });
  }

  playStadiumClap(time) {
    if (!this.crowdGain || !this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.025));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, time);
      filter.Q.setValueAtTime(2.0, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.crowdGain);

      noise.start(time);
    } catch (e) {}
  }

  // Crowd reaction when a shot hits post or is narrowly saved ("Ooooooh!")
  playCrowdGasp() {
    this.init();
    if (!this.crowdGain || !this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.8);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(580, this.ctx.currentTime + 0.35);
      filter.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 1.6);
      filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.75, this.ctx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.crowdGain);

      noise.start();
    } catch (e) {}
  }

  // Goal celebration: Massive crowd eruption + Dual Stadium Goal Horn!
  playGoalCelebration() {
    this.init();
    if (!this.ctx) return;

    // 1. Dual Stadium Foghorn / Goal Horn
    try {
      const hornFreqs = [110, 165]; // Harmonic fifth for brassy stadium horn
      hornFreqs.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(freq + 4, this.ctx.currentTime + 1.8);

        gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.4, this.ctx.currentTime + 1.4);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.0);
      });
    } catch (e) {}

    // 2. Crowd Roar Eruption
    try {
      const bufferSize = this.ctx.sampleRate * 3.0;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.5);
      filter.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 3.0);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.95, this.ctx.currentTime + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 3.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.crowdGain);

      noise.start();
    } catch (e) {}
  }

  // Alias for backward compatibility
  playGoalRoar() {
    this.playGoalCelebration();
  }

  // =========================================================================
  // --- AUTHENTIC FOOTBALL MATCH SFX ---
  // =========================================================================

  // Dynamic Ball Kick / Pass / Strike
  playKick(power = 0.5, type = 'normal') {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Transient click for boot leather contact
      const clickBuf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.02), this.ctx.sampleRate);
      const cData = clickBuf.getChannelData(0);
      for (let i = 0; i < cData.length; i++) cData[i] = (Math.random() * 2 - 1) * Math.exp(-i / 150);
      const clickSrc = this.ctx.createBufferSource();
      clickSrc.buffer = clickBuf;
      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.4 * power, now);
      clickSrc.connect(clickGain);
      clickGain.connect(this.sfxGain);
      clickSrc.start(now);

      // Deep thump body
      osc.type = (type === 'finesse' || type === 'pass') ? 'triangle' : 'sine';
      const startFreq = type === 'power' ? 170 : (type === 'pass' ? 110 : 135);
      const endFreq = type === 'power' ? 32 : 45;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.14);

      const kickVol = Math.max(0.2, Math.min(1.0, 0.4 + power * 0.6));
      gain.gain.setValueAtTime(kickVol, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {}
  }

  // Referee Pea Whistle (Real dual-tone frequency modulation with vibrato)
  playWhistle(type = 'short') {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const duration = type === 'triple' ? 1.2 : (type === 'long' ? 0.65 : 0.28);
      const now = this.ctx.currentTime;

      // Authentic pea whistle frequencies: 2600Hz and 2850Hz modulated by a 24Hz pea wobble
      const f1 = 2600;
      const f2 = 2850;

      [f1, f2].forEach(freq => {
        const osc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Pea vibration LFO
        lfo.frequency.setValueAtTime(24, now);
        lfoGain.gain.setValueAtTime(60, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + duration);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.setValueAtTime(0.35, now + duration - 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {}
  }

  // Ball hitting crossbar or post: Resonant metallic CLANG!
  playCrossbar() {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High Q metallic ringing frequencies
      const freqs = [520, 1040, 1850];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx === 0 ? 'sine' : 'square';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.96, now + 0.6);

        const vol = idx === 0 ? 0.75 : 0.25;
        gain.gain.setValueAtTime(vol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.6);
      });

      // Crowd gasps immediately when ball hits the woodwork!
      this.playCrowdGasp();
    } catch (e) {}
  }

  // Ball hitting net: Soft ripple and mesh rustle
  playNet() {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
    } catch (e) {}
  }

  // Slide Tackle: Turf friction swish + body contact thump
  playTackle() {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Grass turf swoosh
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.2);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.06));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      // Low impact thump
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.12);
      oscGain.gain.setValueAtTime(0.6, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);

      noise.start(now);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  // UI Button Hover Tick
  playUIHover() {
    if (!this.isUnlocked || !this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  // UI Button Click Blip
  playUIClick() {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  // Cinematic Studio Intro Boom with Deep Sub-bass & Crystal Shimmer
  playIntroBoom() {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Sub bass impact
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.8);
      subGain.gain.setValueAtTime(0.8, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      subOsc.connect(subGain);
      subGain.connect(this.sfxGain);
      subOsc.start(now);
      subOsc.stop(now + 1.2);

      // Shimmer sweep
      const shimmer = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(440, now);
      shimmer.frequency.exponentialRampToValueAtTime(1760, now + 0.6);
      sGain.gain.setValueAtTime(0.2, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      shimmer.connect(sGain);
      sGain.connect(this.sfxGain);
      shimmer.start(now);
      shimmer.stop(now + 0.7);
    } catch (e) {}
  }

  // 4th Official Electronic Substitution Board Chime & Crowd Applause
  playSubChime() {
    this.init();
    if (!this.sfxGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Dual stadium chime: C6 -> G6
      [1046.5, 1567.98].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        gain.gain.setValueAtTime(0.3, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + i * 0.12);
        osc.stop(now + i * 0.12 + 0.4);
      });
      // Short whistle
      this.playWhistle('short');
    } catch (e) {}
  }

  // Referee Booking Card Whistle (Sharp double blast + crowd reaction)
  playCardWhistle(isRed = false) {
    this.init();
    this.playWhistle('short');
    setTimeout(() => {
      this.playWhistle(isRed ? 'long' : 'short');
    }, 180);
    this.playCrowdGasp();
  }
}

// Attach globally
window.FIFAAudioEngine = FIFAAudioEngine;
