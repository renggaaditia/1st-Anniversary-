// Stage 1 bagian 3: puisi di bawah langit berbintang.
import { W, H, FONT, COLOR } from '../config.js';
import { Save } from '../save.js';
import { S1 } from '../data/stage1.js';
import { nightSky } from '../ui/sky.js';
import { fadeIn, goTo, wait, tweenP } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { pressOnce } from './S1Tanjung.js';
import { Controls } from '../ui/controls.js';

export class S1Poem extends Phaser.Scene {
  constructor() { super('S1Poem'); }

  create() {
    nightSky(this, { seed: 3 });
    Save.checkpoint('S1Poem');
    this.ctrl = new Controls(this);
    this.ctrl.setVisible(this.ctrl.touch ? false : true);
    this.run().catch((e) => console.error(e));
  }

  update() {
    if (this.ctrl.pausePressed()) { this.scene.launch('Pause', { from: 'S1Poem' }); this.scene.pause(); }
  }

  async run() {
    await fadeIn(this, 1200);
    const title = this.add.text(W / 2, 96, 'The First Poem', {
      fontFamily: FONT, fontSize: '64px', color: '#f2c14e', fontStyle: '700', stroke: '#0d1030', strokeThickness: 10,
    }).setOrigin(0.5).setAlpha(0);
    const by = this.add.text(W / 2, 156, 'dari Rengga', { fontFamily: FONT, fontSize: '30px', color: '#c9d6ff' }).setOrigin(0.5).setAlpha(0);
    await tweenP(this, { targets: [title, by], alpha: 1, duration: 900 });

    let y = 250;
    const next = this.add.text(W / 2, H - 50, '▼', { fontFamily: FONT, fontSize: '32px', color: '#f2c14e' }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: next, y: H - 40, yoyo: true, repeat: -1, duration: 420 });
    for (const line of S1.poem) {
      const t = this.add.text(W / 2, y + 16, line, {
        fontFamily: FONT, fontSize: '34px', color: '#fff4d0', align: 'center', lineSpacing: 8,
        wordWrap: { width: 1580 }, stroke: '#0d1030', strokeThickness: 6,
      }).setOrigin(0.5, 0).setAlpha(0);
      await tweenP(this, { targets: t, alpha: 1, y, duration: 1100 });
      y += t.height + 46;
      next.setAlpha(1);
      await pressOnce(this);
      next.setAlpha(0);
    }
    await wait(this, 500);
    await memoryFound(this, 's1_the_first_poem');
    next.setText('Tekan untuk lanjut').setFontSize(28).setAlpha(1);
    await pressOnce(this);
    Save.checkpoint('S1End');
    await goTo(this, 'S1End');
  }
}
