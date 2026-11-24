// Stage 3 — The Third Time's the Charm (3 Desember 2025).
// Jalan menuju Yulia (2 flashback hitam-putih) > pilih mengungkapkan > jeda > diterima > berdiri bersama
// > hati Rengga > 3 DECEMBER 2025 > Rengga menghilang > Chapter 2.
import { W, H, FONT, COLOR, GROUND } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S3 } from '../data/stage3.js';
import { fadeIn, titleCard, wait, walkTo, tweenP, faceToward, heartText, pressAny } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { stageSummary } from '../ui/summary.js';

const FB_TRIGGERS = [620, 980];   // posisi x yang memicu flashback
const FB_GROUND = { bg_pantai: GROUND.pantai, bg_s2_jalan_malam: GROUND.jalan };

function grayscale(obj) {
  if (obj.preFX) { const cm = obj.preFX.addColorMatrix(); cm.grayscale(1); }
  else obj.setTint(0xaaaaaa);
}

export class S3Taman extends StageBase {
  constructor() { super('S3Taman'); }

  create() {
    this.setupStage({ bg: 'bg_s2_taman_sore', ground: GROUND.taman, minX: 120, maxX: 1560 });
    // cahaya keemasan (GDD: sunset, golden light)
    this.add.rectangle(0, 0, W, H, 0xffb347, 0.14).setOrigin(0).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
    this.player = this.addChar('rengga', 300);
    this.yulia = this.addChar('yulia', 1260);
    this.fbDone = 0;
    this.cameras.main.setBounds(0, 0, W, H);   // zoom tidak memperlihatkan tepi luar latar
    Save.checkpoint('S3Taman');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 900);
    await titleCard(this, 'STAGE 3', "The Third Time's the Charm");
    await this.dlg.play(S3.intro, { id: 's3_intro' });
    this.addInteract({ x: this.yulia.x, r: 220, label: 'Bicara', onUse: () => this.confession() });
    this.unlock();
  }

  update(t, d) {
    super.update(t, d);
    if (this.busy || this.fbDone >= FB_TRIGGERS.length) return;
    if (this.player.x >= FB_TRIGGERS[this.fbDone]) {
      const i = this.fbDone++;
      this.lock();
      this.flashback(S3.flashbacks[i]).then(async () => {
        if (this.fbDone === FB_TRIGGERS.length) {
          await this.dlg.play(S3.afterFlashback);
          await memoryFound(this, 's3_third_attempt');
        }
        this.unlock();
      }).catch((e) => console.error(e));
    }
  }

  // Kenangan percobaan sebelumnya, hitam-putih.
  async flashback(fb) {
    const flash = this.add.rectangle(0, 0, W, H, 0xffffff, 0).setOrigin(0).setDepth(1900);
    await tweenP(this, { targets: flash, fillAlpha: 1, duration: 350 });
    const c = this.add.container(0, 0).setDepth(1500);
    const bg = this.add.image(0, 0, fb.bg).setOrigin(0);
    grayscale(bg);
    const g = FB_GROUND[fb.bg] || GROUND.taman;
    const r = this.add.sprite(720, g, 'rengga', 0).setOrigin(0.5, 1); r.charName = 'rengga'; r.play('rengga_idle');
    const y = this.add.sprite(900, g, 'yulia', 0).setOrigin(0.5, 1); y.charName = 'yulia'; y.play('yulia_idle');
    grayscale(r); grayscale(y);
    const vig = this.add.rectangle(0, 0, W, H, 0x000000, 0.25).setOrigin(0);
    const lbl = this.add.text(W / 2, H - 46, fb.label, { fontFamily: FONT, fontSize: '32px', color: '#e8e0d8', fontStyle: '700', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
    c.add([bg, r, y, vig, lbl]);
    await tweenP(this, { targets: flash, fillAlpha: 0, duration: 500 });
    const saved = this.dlg.actors;
    this.dlg.actors = { rengga: r, yulia: y };
    await this.dlg.play(fb.lines);
    this.dlg.actors = saved;
    await tweenP(this, { targets: flash, fillAlpha: 1, duration: 350 });
    c.destroy();
    await tweenP(this, { targets: flash, fillAlpha: 0, duration: 500 });
    flash.destroy();
  }

  async confession() {
    const r = this.player, y = this.yulia;
    this.fbDone = FB_TRIGGERS.length;      // flashback yang terlewat tidak muncul lagi di tengah adegan
    await walkTo(this, r, y.x - 160);
    await this.dlg.play(S3.talk, { id: 's3_talk' });
    // pilih mengungkapkan; "diam" kembali ke pilihan
    for (;;) {
      const c = await this.dlg.play(S3.choose);
      if (c === 0) break;
      await this.dlg.play(S3.hesitate);
    }
    if (!Save.has('s3_third_attempt')) await memoryFound(this, 's3_third_attempt');
    await this.dlg.play(S3.confess, { id: 's3_confess' });

    // jeda: hening, detak jantung, kamera mendekat
    const cam = this.cameras.main;
    cam.pan((r.x + y.x) / 2, GROUND.taman - 140, 1600, 'Sine.easeInOut');
    cam.zoomTo(1.25, 1600, 'Sine.easeInOut');
    for (let i = 0; i < 4; i++) { Sfx.heartbeat(); await wait(this, 750); }
    cam.pan(W / 2, H / 2, 900, 'Sine.easeInOut');
    cam.zoomTo(1, 900, 'Sine.easeInOut');
    await wait(this, 950);
    await this.dlg.play(S3.accept, { id: 's3_accept' });
    await memoryFound(this, 's3_accepted_heart');
    await this.dlg.play(S3.promise, { id: 's3_promise' });
    await memoryFound(this, 's3_promise');
    await this.together();
    await this.ending();
  }

  // Berdiri bersama, hati melayang.
  async together() {
    const r = this.player, y = this.yulia;
    await walkTo(this, y, r.x + 110, 160);
    faceToward(r, y.x); faceToward(y, r.x);
    r.play('rengga_happy'); y.play('yulia_happy');
    const ev = this.time.addEvent({
      delay: 260, repeat: 14, callback: () => {
        const h = this.add.image((r.x + y.x) / 2 + Phaser.Math.Between(-90, 90), r.y - 200, 'emotes', 3).setDepth(400).setScale(1.2);
        this.tweens.add({ targets: h, y: h.y - Phaser.Math.Between(120, 220), alpha: 0, duration: 1800, onComplete: () => h.destroy() });
      },
    });
    await wait(this, 4200);
    ev.remove();
    r.play('rengga_idle'); y.play('yulia_idle');
  }

  async ending() {
    const r = this.player;
    await heartText(this, S3.heartEnd);
    // layar perlahan gelap
    const black = this.add.rectangle(0, 0, W, H, 0x000000, 0).setOrigin(0).setDepth(2100);
    await tweenP(this, { targets: black, fillAlpha: 1, duration: 2200 });
    const d1 = this.add.text(W / 2, H / 2 - 50, S3.dateLine, { fontFamily: FONT, fontSize: '84px', color: '#fff4d0', fontStyle: '700' }).setOrigin(0.5).setDepth(2101).setAlpha(0);
    const d2 = this.add.text(W / 2, H / 2 + 40, S3.dateSub, { fontFamily: FONT, fontSize: '40px', color: '#f2c14e' }).setOrigin(0.5).setDepth(2101).setAlpha(0);
    await tweenP(this, { targets: d1, alpha: 1, duration: 1200 });
    await tweenP(this, { targets: d2, alpha: 1, duration: 1000 });
    await wait(this, 2200);
    await tweenP(this, { targets: [d1, d2], alpha: 0, duration: 900 });
    // Rengga perlahan menghilang
    const ghost = this.add.sprite(W / 2, H / 2 + 120, 'rengga', 0).setOrigin(0.5, 1).setDepth(2101).setAlpha(0).setScale(1.3);
    ghost.play('rengga_idle');
    await tweenP(this, { targets: ghost, alpha: 1, duration: 900 });
    await wait(this, 800);
    await tweenP(this, { targets: ghost, alpha: 0, y: ghost.y - 30, duration: 2600 });
    const cl = this.add.text(W / 2, H / 2, S3.closing, { fontFamily: FONT, fontSize: '40px', color: '#fff4d0', align: 'center', wordWrap: { width: 1300 } }).setOrigin(0.5).setDepth(2101).setAlpha(0);
    await tweenP(this, { targets: cl, alpha: 1, duration: 1400 });
    await wait(this, 3000);
    await tweenP(this, { targets: cl, alpha: 0, duration: 900 });
    const ch = this.add.text(W / 2, H / 2, S3.chapter, { fontFamily: FONT, fontSize: '58px', color: '#ffd6e2', fontStyle: '700', align: 'center', wordWrap: { width: 1400 } }).setOrigin(0.5).setDepth(2101).setAlpha(0);
    await tweenP(this, { targets: ch, alpha: 1, duration: 1400 });
    await wait(this, 2600);
    const hint = this.add.text(W / 2, H - 70, 'Tekan untuk lanjut', { fontFamily: FONT, fontSize: '28px', color: '#9a8f98' }).setOrigin(0.5).setDepth(2101);
    await pressAny(this);
    hint.destroy();
    await tweenP(this, { targets: ch, alpha: 0, duration: 700 });
    Save.completeStage(3);
    // ringkasan di atas latar taman yang diredupkan
    black.setDepth(900);
    await tweenP(this, { targets: black, fillAlpha: 0.55, duration: 900 });
    stageSummary(this, 3);
  }
}
