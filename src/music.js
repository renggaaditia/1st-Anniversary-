// Musik latar (file audio). Satu lagu aktif di seluruh game; volume ikut Pengaturan.
import { Save } from './save.js';

const vol = () => Save.data.settings.music * 0.8;

export const Music = {
  cur: null,
  key: null,

  play(scene, key, fade = 2500) {
    if (this.key === key && this.cur && this.cur.isPlaying) return;
    this.stop(scene, 400);
    const s = scene.sound.add(key, { loop: true, volume: 0 });
    s.play();
    this.cur = s; this.key = key;
    scene.tweens.add({ targets: s, volume: vol(), duration: fade });
  },

  stop(scene, fade = 1200) {
    const s = this.cur;
    if (!s) return;
    this.cur = null; this.key = null;
    if (!scene || fade <= 0) { s.stop(); s.destroy(); return; }
    scene.tweens.add({ targets: s, volume: 0, duration: fade, onComplete: () => { s.stop(); s.destroy(); } });
  },

  refresh() { if (this.cur) this.cur.setVolume(vol()); },
};
