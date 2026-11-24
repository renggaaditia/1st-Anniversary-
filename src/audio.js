// Efek suara sintetis (WebAudio). Tidak butuh file audio.
import { Save } from './save.js';

let ctx = null;

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type = 'square', vol = 0.05, when = 0, slide = 0) {
  const c = ac();
  if (!c) return;
  const v = vol * Save.data.settings.sfx;
  if (v <= 0) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.linearRampToValueAtTime(freq + slide, t + dur);
  g.gain.setValueAtTime(v, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur, vol = 0.2) {
  const c = ac();
  if (!c) return;
  const v = vol * Save.data.settings.sfx;
  if (v <= 0) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = v;
  s.buffer = buf;
  s.connect(g).connect(c.destination);
  s.start();
}

// Suara hujan: noise yang di-filter, berulang sampai dihentikan.
let rainNode = null;
export function rainStart() {
  const c = ac();
  if (!c || rainNode) return;
  const v = 0.12 * Save.data.settings.sfx;
  if (v <= 0) return;
  const len = c.sampleRate * 2;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf; src.loop = true;
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400;
  const g = c.createGain(); g.gain.setValueAtTime(0, c.currentTime); g.gain.linearRampToValueAtTime(v, c.currentTime + 1.5);
  src.connect(lp).connect(g).connect(c.destination);
  src.start();
  rainNode = { src, g, c };
}
export function rainStop() {
  if (!rainNode) return;
  const { src, g, c } = rainNode;
  g.gain.linearRampToValueAtTime(0, c.currentTime + 1);
  src.stop(c.currentTime + 1.1);
  rainNode = null;
}

export const Sfx = {
  unlock() { ac(); },
  blip() {
    if (!Save.data.settings.typing) return;
    tone(620 + Math.random() * 90, 0.035, 'square', 0.025);
  },
  select() { tone(520, 0.06, 'square', 0.04); tone(780, 0.06, 'square', 0.03, 0.05); },
  move() { tone(440, 0.04, 'square', 0.03); },
  chime() {
    [880, 1175, 1568, 2093].forEach((f, i) => tone(f, 0.35, 'triangle', 0.06, i * 0.09));
  },
  shutter() { noise(0.12, 0.25); tone(1800, 0.05, 'square', 0.03, 0.02); },
  miss() { tone(220, 0.18, 'sawtooth', 0.04, 0, -80); },
  heartbeat() { tone(70, 0.12, 'sine', 0.2); tone(62, 0.14, 'sine', 0.16, 0.18); },
  twinkle() { [1568, 2093, 2637].forEach((f, i) => tone(f, 0.5, 'sine', 0.04, i * 0.12)); },
};
