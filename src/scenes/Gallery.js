// Galeri "Foto Kita": foto asli (pixel ringan), satu per satu. Dimuat saat dibuka.
import { W, H, FONT, COLOR } from '../config.js';
import { Sfx } from '../audio.js';

export class Gallery extends Phaser.Scene {
  constructor() { super('Gallery'); }

  init(data) { this.caller = data.caller; this.idx = data.start || 0; }

  preload() {
    const meta = this.cache.json.get('photos_meta');
    for (const m of meta) if (!this.textures.exists(m.key)) this.load.image(m.key, `assets/photos/${m.key}.jpg`);
    const t = this.add.text(W / 2, H / 2, 'Membuka foto...', { fontFamily: FONT, fontSize: '32px', color: '#fbf3e0' }).setOrigin(0.5);
    this.load.once('complete', () => t.destroy());
  }

  create() {
    this.scene.bringToTop();
    this.meta = this.cache.json.get('photos_meta');
    this.add.rectangle(0, 0, W, H, 0x1a0f1e, 0.9).setOrigin(0);
    this.add.text(W / 2, 46, 'FOTO KITA', { fontFamily: FONT, fontSize: '44px', color: '#fff4d0', fontStyle: '700', backgroundColor: '#6e3a32', padding: { x: 20, y: 6 } }).setOrigin(0.5, 0);
    this.card = this.add.container(W / 2, H / 2 + 10);
    this.info = this.add.text(W / 2, H - 70, '', { fontFamily: FONT, fontSize: '30px', color: '#fbf3e0' }).setOrigin(0.5);
    const mk = (x, label, fn) => {
      const b = this.add.text(x, H / 2, label, { fontFamily: FONT, fontSize: '48px', color: '#fbf3e0', backgroundColor: '#6e3a32', padding: { x: 18, y: 8 } })
        .setOrigin(0.5).setInteractive({ useHandCursor: true });
      b.on('pointerdown', fn);
    };
    mk(110, '◀', () => this.flip(-1));
    mk(W - 110, '▶', () => this.flip(1));
    const close = this.add.text(W - 80, 70, '✕', { fontFamily: FONT, fontSize: '44px', color: '#fbf3e0', backgroundColor: '#c84a6a', padding: { x: 14, y: 2 } })
      .setOrigin(0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.close());
    this.input.keyboard.on('keydown', (ev) => {
      if (ev.code === 'ArrowRight' || ev.code === 'KeyD') this.flip(1);
      else if (ev.code === 'ArrowLeft' || ev.code === 'KeyA') this.flip(-1);
      else if (ev.code === 'Escape' || ev.code === 'KeyX') this.close();
    });
    this.seen = new Set();
    this.render();
  }

  flip(d) {
    const n = Phaser.Math.Clamp(this.idx + d, 0, this.meta.length - 1);
    if (n === this.idx) return;
    this.idx = n;
    Sfx.move();
    this.tweens.add({
      targets: this.card, x: W / 2 - d * 60, alpha: 0, duration: 140,
      onComplete: () => { this.render(); this.card.x = W / 2 + d * 60; this.tweens.add({ targets: this.card, x: W / 2, alpha: 1, duration: 180 }); },
    });
  }

  render() {
    const m = this.meta[this.idx];
    this.seen.add(this.idx);
    this.card.removeAll(true);
    const img = this.add.image(0, -20, m.key);
    const s = Math.min(1, 640 / img.height, 1100 / img.width);
    img.setScale(s);
    const w = img.width * s, h = img.height * s;
    const g = this.add.graphics();
    g.fillStyle(0x2b1d2a).fillRect(-w / 2 - 26, -20 - h / 2 - 26, w + 52, h + 96);
    g.fillStyle(0xfbf3e0).fillRect(-w / 2 - 20, -20 - h / 2 - 20, w + 40, h + 84);
    g.fillStyle(0xf2d89a, 0.9).fillRect(-60, -20 - h / 2 - 36, 120, 30);
    this.card.add([g, img]);
    if (m.date) this.card.add(this.add.text(0, -20 + h / 2 + 32, m.date, { fontFamily: FONT, fontSize: '28px', color: COLOR.roseCss }).setOrigin(0.5));
    this.card.setAngle([-1.5, 1, -0.5, 1.5][this.idx % 4]);
    this.info.setText(`${this.idx + 1} / ${this.meta.length}`);
  }

  close() {
    Sfx.select();
    const c = this.scene.get(this.caller);
    this.scene.resume(this.caller);
    c.events.emit('galleryClosed', this.seen.size);
    this.scene.stop();
  }
}
