// Stage 1 bagian 1: Tanjung + mini-game foto.
import { W, H, FONT, COLOR, GROUND } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S1 } from '../data/stage1.js';
import { fadeIn, goTo, titleCard, wait, walkTo, tweenP, panel } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';

// Tekan tombol aksi sekali (keyboard / sentuh). Dipakai mini-game.
export function pressOnce(scene) {
  return new Promise((resolve) => {
    const kb = scene.input.keyboard;
    const done = () => { kb.off('keydown', onKey); scene.input.off('pointerdown', onPtr); resolve(); };
    const onKey = (ev) => { if (['Space', 'Enter', 'KeyE'].includes(ev.code)) done(); };
    const onPtr = () => done();
    scene.time.delayedCall(80, () => { kb.on('keydown', onKey); scene.input.on('pointerdown', onPtr); });
  });
}

export class S1Tanjung extends StageBase {
  constructor() { super('S1Tanjung'); }

  create() {
    this.setupStage({ bg: 'bg_pantai', ground: GROUND.pantai, minX: 120, maxX: 1520 });
    this.player = this.addChar('rengga', 470);
    this.yulia = this.addChar('yulia', 1200);
    Save.checkpoint('S1Tanjung');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 700);
    await titleCard(this, 'STAGE 1', 'The Beginning  ·  Juli');
    await this.dlg.play(S1.intro, { id: 's1_intro' });
    this.addInteract({ x: this.yulia.x, r: 220, label: 'Bicara', onUse: () => this.meetYulia() });
    this.unlock();
  }

  async meetYulia() {
    const tx = this.player.x < this.yulia.x ? this.yulia.x - 150 : this.yulia.x + 150;
    await walkTo(this, this.player, tx);
    await this.dlg.play(S1.askPhoto, { id: 's1_askPhoto' });
    // berdiri berdampingan untuk foto
    await Promise.all([walkTo(this, this.player, 770), walkTo(this, this.yulia, 900)]);
    await this.photoGame();
    await this.dlg.play(S1.afterPhoto, { id: 's1_afterPhoto' });
    Save.checkpoint('S1Kapal', { phase: 'day' });
    await Promise.all([walkTo(this, this.yulia, W + 120, 320), wait(this, 250).then(() => walkTo(this, this.player, W + 80, 320))]);
    await goTo(this, 'S1Kapal', { phase: 'day' });
  }

  // Mini-game foto: tekan saat penanda di area hijau.
  async photoGame() {
    await this.dlg.play(S1.photoHelp, { id: 's1_photoHelp' });
    const VF = { x: 560, y: 560, w: 560, h: 360 };
    const ui = this.add.container(0, 0).setDepth(1800);
    const dim = 0x0d1030, a = 0.6;
    ui.add([
      this.add.rectangle(0, 0, W, VF.y, dim, a).setOrigin(0),
      this.add.rectangle(0, VF.y + VF.h, W, H - VF.y - VF.h, dim, a).setOrigin(0),
      this.add.rectangle(0, VF.y, VF.x, VF.h, dim, a).setOrigin(0),
      this.add.rectangle(VF.x + VF.w, VF.y, W - VF.x - VF.w, VF.h, dim, a).setOrigin(0),
    ]);
    const br = this.add.graphics();
    br.lineStyle(8, 0xffffff, 1);
    const L = 46;
    [[VF.x, VF.y, 1, 1], [VF.x + VF.w, VF.y, -1, 1], [VF.x, VF.y + VF.h, 1, -1], [VF.x + VF.w, VF.y + VF.h, -1, -1]].forEach(([x, y, sx, sy]) => {
      br.lineBetween(x, y, x + L * sx, y); br.lineBetween(x, y, x, y + L * sy);
    });
    const rec = this.add.text(VF.x + 18, VF.y + 14, '● FOTO', { fontFamily: FONT, fontSize: '28px', color: '#ff6a6a' });
    this.tweens.add({ targets: rec, alpha: 0.2, yoyo: true, repeat: -1, duration: 500 });
    ui.add([br, rec]);

    // bar fokus
    const BX = W / 2 - 360, BW = 720, BY = 210;
    ui.add(panel(this, BX - 20, BY - 70, BW + 40, 150));
    const label = this.add.text(W / 2, BY - 36, 'Tekan saat penanda di area hijau!', { fontFamily: FONT, fontSize: '32px', color: COLOR.inkCss }).setOrigin(0.5);
    const bar = this.add.rectangle(BX, BY + 20, BW, 34, 0xd8cfc0).setOrigin(0, 0.5).setStrokeStyle(4, COLOR.ink);
    const zone = this.add.rectangle(0, BY + 20, 120, 34, 0x6fc46a).setOrigin(0, 0.5);
    const marker = this.add.rectangle(BX, BY + 20, 12, 58, COLOR.rose).setStrokeStyle(4, COLOR.ink);
    ui.add([label, bar, zone, marker]);

    let misses = 0, ok = false;
    while (!ok) {
      const zw = misses >= 3 ? BW : 120 + misses * 40;
      zone.width = zw;
      zone.x = BX + (misses >= 3 ? 0 : Phaser.Math.Between(80, BW - zw - 20));
      marker.x = BX;
      const tw = this.tweens.add({ targets: marker, x: BX + BW, duration: 1100 - misses * 120, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
      // Yulia sesekali berkedip/bergerak supaya terasa hidup
      await pressOnce(this);
      tw.stop();
      const mx = marker.x;
      ok = mx >= zone.x && mx <= zone.x + zone.width;
      if (!ok) {
        misses++;
        Sfx.miss();
        label.setText(misses >= 3 ? 'Santai saja... sekarang pasti bisa!' : 'Yah, blur! Coba lagi.');
        this.cameras.main.shake(180, 0.004);
        await wait(this, 500);
        label.setText('Tekan saat penanda di area hijau!');
      }
    }

    // pose foto
    this.player.anims.stop(); this.player.setFrame(20);
    this.yulia.anims.stop(); this.yulia.setFrame(20);
    ui.setVisible(false);
    await wait(this, 60);
    const snap = await this.snapshot(VF);
    Sfx.shutter();
    const flash = this.add.rectangle(0, 0, W, H, 0xffffff, 1).setOrigin(0).setDepth(3500);
    await tweenP(this, { targets: flash, alpha: 0, duration: 500 });
    flash.destroy();
    ui.destroy();

    // polaroid
    const pc = this.add.container(W / 2, H / 2 - 60).setDepth(3200).setScale(0.6).setAngle(-12).setAlpha(0);
    const pg = this.add.graphics();
    pg.fillStyle(COLOR.ink).fillRect(-246, -216, 492, 432);
    pg.fillStyle(0xfffdf6).fillRect(-240, -210, 480, 420);
    pc.add(pg);
    if (snap) {
      const im = this.add.image(0, -40, 'photo_snap');
      im.setScale(Math.min(440 / im.width, 290 / im.height));
      pc.add(im);
    }
    pc.add(this.add.text(0, 160, 'Tanjung, Juli', { fontFamily: FONT, fontSize: '34px', color: COLOR.inkCss }).setOrigin(0.5));
    await tweenP(this, { targets: pc, alpha: 1, scale: 1, angle: -3, duration: 600, ease: 'Back.Out' });
    await memoryFound(this, 's1_foto_pertama');
    const hint = this.add.text(W / 2, H - 60, 'Tekan untuk lanjut', { fontFamily: FONT, fontSize: '30px', color: '#fff4d0', stroke: '#2b1d2a', strokeThickness: 6 }).setOrigin(0.5).setDepth(3300);
    await pressOnce(this);
    hint.destroy();
    await tweenP(this, { targets: pc, alpha: 0, y: pc.y - 60, duration: 400 });
    pc.destroy();
    this.player.play('rengga_idle'); this.yulia.play('yulia_idle');
  }

  // Ambil area viewfinder jadi texture 'photo_snap' + simpan versi kecil.
  snapshot(VF) {
    return new Promise((resolve) => {
      try {
        this.game.renderer.snapshotArea(VF.x, VF.y, VF.w, VF.h, (img) => {
          const cv = document.createElement('canvas');
          const s = 0.6;
          cv.width = Math.round(VF.w * s); cv.height = Math.round(VF.h * s);
          const cx = cv.getContext('2d');
          cx.imageSmoothingEnabled = false;
          cx.drawImage(img, 0, 0, cv.width, cv.height);
          const url = cv.toDataURL('image/png');
          Save.data.photo = url;
          Save.persist();
          if (this.textures.exists('photo_snap')) this.textures.remove('photo_snap');
          const im2 = new Image();
          im2.onload = () => { this.textures.addImage('photo_snap', im2); resolve(true); };
          im2.onerror = () => resolve(false);
          im2.src = url;
        });
      } catch (e) {
        console.warn('snapshot gagal', e);
        resolve(false);
      }
    });
  }
}
