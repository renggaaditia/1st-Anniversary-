// Simpan progres otomatis di localStorage.
const KEY = 'ourstory_save_v1';

const DEFAULT = () => ({
  unlocked: [1],
  completed: [],
  collectibles: {},          // id -> { found: ISO date }
  choices: {},               // choiceId -> index
  seenDialogs: {},           // dialogId -> true
  checkpoint: null,          // { scene, data }
  photo: null,               // dataURL foto pertama (mini-game Stage 1)
  strip: null,               // dataURL photobooth strip (Stage 2)
  letter: '',                // surat Yulia (Stage 6)
  stage7Answer: null,
  settings: { music: 0.6, sfx: 0.8, textSpeed: 'normal', typing: true },
});

let storageOk = true;

export const Save = {
  data: DEFAULT(),

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        const base = DEFAULT();
        this.data = { ...base, ...d, settings: { ...base.settings, ...(d.settings || {}) } };
      }
    } catch (e) {
      storageOk = false;
    }
    return this.data;
  },

  persist() {
    if (!storageOk) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch (e) {
      // Kuota penuh: buang foto lalu coba lagi.
      try {
        const copy = { ...this.data, photo: null };
        localStorage.setItem(KEY, JSON.stringify(copy));
      } catch (e2) { storageOk = false; }
    }
  },

  has(id) { return !!this.data.collectibles[id]; },

  collect(id) {
    if (this.has(id)) return false;
    this.data.collectibles[id] = { found: new Date().toISOString() };
    this.persist();
    return true;
  },

  setChoice(id, idx) { this.data.choices[id] = idx; this.persist(); },
  seen(id) { return !!this.data.seenDialogs[id]; },
  markSeen(id) { if (id) { this.data.seenDialogs[id] = true; this.persist(); } },

  checkpoint(scene, data = {}) { this.data.checkpoint = { scene, data }; this.persist(); },

  completeStage(n) {
    if (!this.data.completed.includes(n)) this.data.completed.push(n);
    if (n < 8 && !this.data.unlocked.includes(n + 1)) this.data.unlocked.push(n + 1);
    this.data.checkpoint = null;
    this.persist();
  },

  hasProgress() {
    return !!this.data.checkpoint || this.data.completed.length > 0 || Object.keys(this.data.collectibles).length > 0;
  },

  reset() { this.data = DEFAULT(); this.persist(); },
};
