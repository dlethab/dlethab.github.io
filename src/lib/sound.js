// Tiny Web Audio synth for UI sounds. Off by default; preference persists.
import { useSyncExternalStore } from "react";

const KEY = "dh-sound";
let enabled = typeof localStorage !== "undefined" && localStorage.getItem(KEY) === "on";
let ctx;
const listeners = new Set();

function audio() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, dur, { type = "sine", gain = 0.12, delay = 0, slide } = {}) {
  const ac = audio();
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (slide) osc.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur);
}

function noise(dur, { gain = 0.2, delay = 0, freq = 1200 } = {}) {
  const ac = audio();
  const t = ac.currentTime + delay;
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const g = ac.createGain();
  src.buffer = buf;
  filter.type = "bandpass";
  filter.frequency.value = freq;
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter).connect(g).connect(ac.destination);
  src.start(t);
}

const SOUNDS = {
  select: () => tone(880, 0.08, { type: "triangle", gain: 0.08 }),
  whistle: () => {
    tone(2600, 0.18, { type: "square", gain: 0.03 });
    tone(2600, 0.45, { type: "square", gain: 0.03, delay: 0.24 });
  },
  kick: () => {
    tone(160, 0.15, { gain: 0.35, slide: 50 });
    noise(0.06, { gain: 0.15, freq: 900 });
  },
  goal: () => {
    noise(1.2, { gain: 0.12, freq: 700 });
    [523, 659, 784].forEach((f, i) => tone(f, 0.25, { type: "triangle", gain: 0.08, delay: i * 0.09 }));
  },
  save: () => tone(300, 0.3, { type: "sawtooth", gain: 0.05, slide: 120 }),
  miss: () => tone(220, 0.35, { type: "triangle", gain: 0.08, slide: 110 }),
};

export function play(name) {
  if (!enabled) return;
  try {
    SOUNDS[name]?.();
  } catch {
    /* audio unavailable */
  }
}

export function setSound(on) {
  enabled = on;
  localStorage.setItem(KEY, on ? "on" : "off");
  listeners.forEach((l) => l());
  if (on) play("select");
}

export function useSound() {
  const on = useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => enabled
  );
  return [on, setSound];
}
