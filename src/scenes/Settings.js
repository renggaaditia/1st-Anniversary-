import { W, H, FONT, COLOR } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { panel } from '../ui/helpers.js';
import { Music } from '../music.js';

const SPEEDS = ['lambat', 'normal', 'cepat'];

export class Settings extends Phaser.Scene {
  constructor() { super('Settings'); }

  init(data) { this.caller = data.caller; }

  create() {
    this.scene.bringToTop();
    this.add.rectangle(0, 0, W, H, 0x000000, 0.7).setOrigin(0);
    panel(this, W / 2 - 480, 120, 960, 700);
    this.add.text(W / 2, 175, 'Pengaturan', { fontFamily: FONT, fontSize: '56px', color: COLOR.inkCss, fontStyle: '700' }).setOrigin(0.5);
    const S = Save.data.settings;
    this.rows = [
      { label: 'Volume musik', get: () => `${Math.round(S.music * 100)}%`, change: (d) => { S.music = Phaser.Math.Clamp(Math.round((S.music + d * 0.1) * 10) / 10, 0, 1); Music.refresh(); } },
      { label: 'Volume efek suara', get: () => `${Math.round(S.sfx * 100)}%`, change: (d) => { S.sfx = Phaser.Math.Clamp(Math.round((S.sfx + d * 0.1) * 10) / 10, 0, 1); Sfx.select(); } },
      { label: 'Kecepatan teks', get: () => S.textSpeed, change: (d) => { const i = SPEEDS.indexOf(S.textSpeed); S.textSpeed = SPEEDS[Phaser.Math.Clamp(i + d, 0, 2)]; } },
      { label: 'Suara mengetik', get: () => (S.typing ? 'Aktif' : 'Mati'), change: () => { S.typing = !S.typing; } },
      { label: 'Layar penuh', get: () => (this.scale.isFullscreen ? 'Aktif' : 'Mati'), change: () => { try { this.scale.toggleFullscreen(); } catch (e) { /* tidak didukung */ } } },
      { label: 'Tutup', close: true },
    ];
    this.idx = 0;
    this.objs = this.rows.map((r, i) => {
      const y = 280 + i * 92;
      const bg = this.add.rectangle(W / 2, y, 860, 74, COLOR.paper).setStrokeStyle(4, COLOR.ink).setInteractive({ useHandCursor: true });
      const l = this.add.text(W / 2 - 400, y, r.label, { fontFamily: FONT, fontSize: '36px', color: COLOR.inkCss }).setOrigin(0, 0.5);
      let v = null, a = null, b = null;
      if (!r.close) {
        v = this.add.text(W / 2 + 290, y, '', { fontFamily: FONT, fontSize: '36px', color: COLOR.roseCss, fontStyle: '700' }).setOrigin(0.5);
        a = this.add.text(W / 2 + 150, y, '◀', { fontFamily: FONT, fontSize: '36px', color: COLOR.inkCss }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        b = this.add.text(W / 2 + 420, y, '▶', { fontFamily: FONT, fontSize: '36px', color: COLOR.inkCss }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        a.on('pointerdown', () => this.change(i, -1));
        b.on('pointerdown', () => this.change(i, 1));
      } else {
        l.setX(W / 2).setOrigin(0.5);
        bg.on('pointerdown', () => this.close());
      }
      bg.on('pointerover', () => { this.idx = i; this.refresh(); });
      return { bg, l, v };
    });
    this.input.keyboard.on('keydown', (ev) => {
      const c = ev.code;
      if (c === 'ArrowDown' || c === 'KeyS') { this.idx = (this.idx + 1) % this.rows.length; Sfx.move(); }
      else if (c === 'ArrowUp' || c === 'KeyW') { this.idx = (this.idx - 1 + this.rows.length) % this.rows.length; Sfx.move(); }
      else if (c === 'ArrowLeft' || c === 'KeyA') this.change(this.idx, -1);
      else if (c === 'ArrowRight' || c === 'KeyD') this.change(this.idx, 1);
      else if (c === 'Enter' || c === 'Space' || c === 'KeyE') { if (this.rows[this.idx].close) this.close(); else this.change(this.idx, 1); }
      else if (c === 'Escape') this.close();
      this.refresh();
    });
    this.refresh();
  }

  change(i, d) {
    const r = this.rows[i];
    if (r.close) return;
    r.change(d);
    Save.persist();
    this.refresh();
  }

  refresh() {
    this.objs.forEach((o, i) => {
      o.bg.setFillStyle(i === this.idx ? 0xf2c14e : COLOR.paper);
      if (o.v) o.v.setText(this.rows[i].get());
    });
  }

  close() {
    Sfx.select();
    Save.persist();
    this.scene.resume(this.caller);
    this.scene.stop();
  }
}
