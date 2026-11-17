/**
 * Sound Utility for UI Button Click Feedback
 * Uses Web Audio API with HTML5 Audio pool fallback for low-latency playback
 */

let audioContext = null;
let audioBuffer = null;
let soundEnabled = true;

const POOL_SIZE = 6;
const audioPool = [];
let poolIndex = 0;

// Initialize HTML5 Audio pool for instant fallback
if (typeof window !== 'undefined') {
  try {
    for (let i = 0; i < POOL_SIZE; i++) {
      const audio = new Audio('/assets/dew.wav');
      audio.preload = 'auto';
      audio.volume = 0.65;
      audioPool.push(audio);
    }
  } catch (_) {}

  // Initialize Web Audio API on first user interaction for high precision
  const initWebAudio = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContext) {
        audioContext = new AudioCtx();
      }

      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      if (!audioBuffer) {
        const response = await fetch('/assets/dew.wav');
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      }
    } catch (_) {}
  };

  const unlockAudio = () => {
    initWebAudio();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };

  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
  if (enabled && typeof window !== 'undefined') {
    playClickSound();
  }
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    playClickSound();
  }
  return soundEnabled;
}

export function playClickSound() {
  if (!soundEnabled || typeof window === 'undefined') return;

  // 1. Try Web Audio API (zero latency, pitch preservation, no clipping)
  if (audioContext && audioBuffer) {
    try {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();

      source.buffer = audioBuffer;
      gainNode.gain.value = 0.7; // Comfortable volume
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.start(0);
      return;
    } catch (_) {}
  }

  // 2. Fallback to round-robin HTML5 Audio pool
  if (audioPool.length > 0) {
    try {
      const audio = audioPool[poolIndex];
      poolIndex = (poolIndex + 1) % POOL_SIZE;
      audio.currentTime = 0;
      audio.volume = 0.65;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (_) {}
  }
}
