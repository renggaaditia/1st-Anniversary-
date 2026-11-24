import { W, H, FONT, COLOR } from '../config.js';
import { menuList, panel } from '../ui/helpers.js';

export class Pause extends Phaser.Scene {
  constructor() { super('Pause'); }

  init(data) { this.from = data.from; }

  create() {
    this.scene.bringToTop();
    this.add.rectangle(0, 0, W, H, 0x000000, 0.6).setOrigin(0);
    panel(this, W / 2 - 340, 150, 680, 640);
    this.add.text(W / 2, 205, 'Jeda', { fontFamily: FONT, fontSize: '56px', color: COLOR.inkCss, fontStyle: '700' }).setOrigin(0.5);
    menuList(this, [
      { label: 'Lanjut', onSelect: () => this.resume() },
      { label: 'Memory Album', onSelect: () => this.overlay('Album') },
      { label: 'Pengaturan', onSelect: () => this.overlay('Settings') },
      { label: 'Ulangi Stage', onSelect: () => this.restart() },
      { label: 'Menu Utama', onSelect: () => this.toMenu() },
    ], { y: 310, gap: 92, width: 520 });
    this.input.keyboard.on('keydown-ESC', () => this.resume());
  }

  overlay(key) {
    this.scene.launch(key, { caller: 'Pause' });
    this.scene.pause();
  }

  resume() {
    this.scene.resume(this.from);
    this.scene.stop();
  }

  restart() {
    this.scene.stop(this.from);
    const first = { S1: 'S1Tanjung', S2: 'S2Kampus', S3: 'S3Taman', S4: 'S4Mall', S5: 'S5Phone', S6: 'S6Pantai', S7: 'S7Bioskop', S8: 'S8Room' }[this.from.slice(0, 2)] || 'S1Tanjung';
    this.scene.start(first);
  }

  toMenu() {
    this.scene.stop(this.from);
    this.scene.start('Title');
  }
}
