// Stage 1 bagian 4: kapal menjauh, stage selesai.
import { W, H, FONT, COLOR } from '../config.js';
import { Save } from '../save.js';
import { nightSky, makeShipTexture } from '../ui/sky.js';
import { fadeIn, caption, tweenP, wait } from '../ui/helpers.js';
import { stageSummary } from '../ui/summary.js';

export class S1End extends Phaser.Scene {
  constructor() { super('S1End'); }

  create() {
    const seaY = 600;
    nightSky(this, { seaY, seed: 11 });
    makeShipTexture(this);
    this.ship = this.add.image(560, seaY + 30, 'ship').setOrigin(0.5, 1).setScale(1.6).setDepth(5);
    // jejak ombak
    this.wake = this.add.rectangle(this.ship.x - 90, seaY + 26, 120, 6, 0xc9d6ff, 0.6).setDepth(4);
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1200);
    const seaY = 600;
    this.tweens.add({ targets: this.ship, y: seaY + 34, yoyo: true, repeat: -1, duration: 900, ease: 'Sine.InOut' });
    this.tweens.add({ targets: this.ship, x: 1280, scale: 0.45, duration: 9000, ease: 'Sine.InOut' });
    this.tweens.add({ targets: this.wake, x: 1230, scaleX: 0.3, alpha: 0, duration: 9000 });
    await caption(this, 'Kapal terus berlayar menuju Kofiau...', 2600, 300);
    await caption(this, 'Dan dari malam itu, ceritanya dimulai.', 2600, 300);
    await wait(this, 800);
    Save.completeStage(1);
    this.summary();
  }

  summary() {
    stageSummary(this, 1);
  }
}
