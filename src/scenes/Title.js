import { Music } from '../music.js';
import { W, H, FONT, COLOR } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { menuList, fadeIn, goTo } from '../ui/helpers.js';

export class Title extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    Music.stop(this);
    this.add.image(0, 0, 'bg_kapal_malam').setOrigin(0);
    this.add.rectangle(0, 0, W, H, 0x0d1030, 0.45).setOrigin(0);
    const r = this.add.sprite(W / 2 - 330, 900, 'rengga').setOrigin(0.5, 1).play('rengga_idle');
    const y = this.add.sprite(W / 2 + 330, 900, 'yulia').setOrigin(0.5, 1).play('yulia_idle');
    r.setScale(1.3); y.setScale(1.3);

    const t = this.add.text(W / 2, 170, 'Our Story', {
      fontFamily: FONT, fontSize: '128px', color: '#fff4d0', fontStyle: '700', stroke: '#2b1d2a', strokeThickness: 14,
    }).setOrigin(0.5);
    this.tweens.add({ targets: t, y: 182, yoyo: true, repeat: -1, duration: 1600, ease: 'Sine.InOut' });
    this.add.text(W / 2, 270, 'Rengga & Yulia', { fontFamily: FONT, fontSize: '40px', color: '#f2c14e', stroke: '#2b1d2a', strokeThickness: 8 }).setOrigin(0.5);

    const cp = Save.data.checkpoint;
    const items = [];
    if (Save.hasProgress()) {
      items.push({ label: 'Lanjutkan', onSelect: () => this.continueGame() });
      items.push({ label: 'Mulai dari Awal', onSelect: () => this.newGame() });
    } else {
      items.push({ label: 'Mulai', onSelect: () => this.newGame() });
    }
    items.push({ label: 'Pilih Stage', onSelect: () => goTo(this, 'StageSelect') });
    items.push({ label: 'Memory Album', onSelect: () => this.overlay('Album') });
    items.push({ label: 'Pengaturan', onSelect: () => this.overlay('Settings') });
    this.menu = menuList(this, items, { y: 420, gap: 86 });

    this.input.once('pointerdown', () => Sfx.unlock());
    this.input.keyboard.once('keydown', () => Sfx.unlock());
    fadeIn(this, 500);
  }

  overlay(key) {
    this.scene.launch(key, { caller: 'Title' });
    this.scene.pause();
  }

  newGame() {
    // Koleksi dan pengaturan tetap; hanya checkpoint Stage 1 dimulai ulang.
    Save.data.checkpoint = null;
    Save.persist();
    goTo(this, 'S1Tanjung');
  }

  continueGame() {
    const cp = Save.data.checkpoint;
    if (cp && cp.scene) goTo(this, cp.scene, cp.data || {});
    else goTo(this, 'StageSelect');
  }
}
