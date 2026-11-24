// Popup "Memory Found!" + simpan collectible.
import { W, FONT, COLOR } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { byId } from '../data/collectibles.js';
import { tweenP, wait } from './helpers.js';

export async function memoryFound(scene, id) {
  const info = byId(id);
  const isNew = Save.collect(id);
  Sfx.chime();
  const c = scene.add.container(W / 2, -140).setDepth(4000).setScrollFactor(0);
  const g = scene.add.graphics();
  g.fillStyle(COLOR.ink, 1).fillRect(-306, -66, 612, 132);
  g.fillStyle(COLOR.paper, 1).fillRect(-300, -60, 600, 120);
  g.fillStyle(COLOR.paperDark, 1).fillRect(-300, -60, 600, 6);
  const icon = scene.add.image(-230, 0, info.icon || 's1_foto_pertama').setScale(1);
  const t1 = scene.add.text(-160, -22, 'Memory Found!', { fontFamily: FONT, fontSize: '40px', color: COLOR.roseCss, fontStyle: '700' }).setOrigin(0, 0.5);
  const t2 = scene.add.text(-160, 26, info.name + (isNew ? '' : '  (sudah ada)'), { fontFamily: FONT, fontSize: '30px', color: COLOR.inkCss }).setOrigin(0, 0.5);
  c.add([g, icon, t1, t2]);
  // kilau
  for (let i = 0; i < 10; i++) {
    const s = scene.add.rectangle(-230 + Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50), 8, 8, 0xf2c14e);
    c.add(s);
    scene.tweens.add({ targets: s, alpha: 0, scale: 0.2, y: s.y - 40, duration: 900, delay: 200 + i * 60 });
  }
  scene.tweens.add({ targets: icon, angle: { from: -8, to: 8 }, yoyo: true, repeat: 3, duration: 220 });
  await tweenP(scene, { targets: c, y: 120, duration: 450, ease: 'Back.Out' });
  await wait(scene, 2200);
  await tweenP(scene, { targets: c, y: -160, duration: 400, ease: 'Back.In' });
  c.destroy();
}
