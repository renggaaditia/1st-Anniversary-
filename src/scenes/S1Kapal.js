// Stage 1 bagian 2: kapal siang -> malam, duduk & lihat bintang, tertidur.
import { W, H, FONT, COLOR, GROUND } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S1 } from '../data/stage1.js';
import { fadeIn, goTo, titleCard, caption, wait, walkTo, tweenP, faceToward } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { pressOnce } from './S1Tanjung.js';

const BENCH_X = 425;      // bangku kiri di background kapal
const SIT_Y = 770;     // pinggul di dudukan bangku

export class S1Kapal extends StageBase {
  constructor() { super('S1Kapal'); }

  init(data) { this.phase = data.phase || 'day'; }

  create() {
    const night = this.phase === 'night';
    this.setupStage({ bg: night ? 'bg_kapal_malam' : 'bg_kapal_siang', ground: GROUND.kapal, minX: 120, maxX: 1540 });
    this.nightBg = this.add.image(0, 0, 'bg_kapal_malam').setOrigin(0).setDepth(1).setAlpha(night ? 1 : 0);
    this.player = this.addChar('rengga', night ? 700 : 470);
    this.yulia = this.addChar('yulia', 1300);
    Save.checkpoint('S1Kapal', { phase: this.phase });
    this.lock();
    (night ? this.runNight(true) : this.runDay()).catch((e) => console.error(e));
  }

  async runDay() {
    await fadeIn(this, 700);
    await caption(this, 'Kapal menuju Kofiau', 1400, 300);
    await this.dlg.play(S1.shipIntro, { id: 's1_shipIntro' });

    // tiket kapal di lantai dek
    if (!Save.has('s1_tiket_kapal')) {
      const t = this.add.image(760, GROUND.kapal - 20, 's1_tiket_kapal').setScale(0.6).setDepth(90).setAngle(-15);
      this.tweens.add({ targets: t, y: t.y - 10, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.InOut' });
      const sp = this.add.text(790, GROUND.kapal - 80, '✦', { fontFamily: FONT, fontSize: '34px', color: '#fff4d0' }).setDepth(91);
      this.tweens.add({ targets: sp, alpha: 0.1, yoyo: true, repeat: -1, duration: 450 });
      this.addInteract({
        x: 760, r: 110, label: 'Ambil', onUse: async () => {
          t.destroy(); sp.destroy();
          await this.dlg.play(S1.ticket);
          await memoryFound(this, 's1_tiket_kapal');
          this.unlock();
        },
      });
    }
    this.addInteract({ x: this.yulia.x, r: 220, label: 'Bicara', onUse: () => this.talkDay() });
    this.unlock();
  }

  async talkDay() {
    await walkTo(this, this.player, this.yulia.x - 150);
    await this.dlg.play(S1.shipTalk, { id: 's1_shipTalk' });
    await caption(this, 'Beberapa jam kemudian...', 1200, 300);
    await tweenP(this, { targets: this.nightBg, alpha: 1, duration: 2600 });
    this.phase = 'night';
    Save.checkpoint('S1Kapal', { phase: 'night' });
    await this.runNight(false);
  }

  async runNight(fresh) {
    if (fresh) await fadeIn(this, 700);
    this.interactables = [];
    await this.dlg.play(S1.nightIntro, { id: 's1_nightIntro' });
    this.addInteract({ x: BENCH_X, r: 170, label: 'Duduk', onUse: () => this.sitAndStars() });
    this.unlock();
  }

  async sitAndStars() {
    const r = this.player, y = this.yulia;
    // duduk berdampingan di bangku
    await walkTo(this, r, BENCH_X - 50);
    r.play('rengga_sit');
    await tweenP(this, { targets: r, y: SIT_Y, duration: 260 });
    r.setDepth(100);
    await walkTo(this, y, BENCH_X + 55, 300);
    y.play('yulia_sit');
    faceToward(r, y.x); faceToward(y, r.x);   // duduk saling berhadapan
    await tweenP(this, { targets: y, y: SIT_Y, duration: 260 });
    y.setDepth(100);
    await this.dlg.play(S1.nightTalk, { id: 's1_nightTalk' });

    // bintang paling terang
    await this.dlg.play(S1.starHelp, { id: 's1_starHelp' });
    const star = this.add.graphics().setDepth(5);
    const sx = 760, sy = 130, P = 8;
    star.fillStyle(0xffffff).fillRect(sx - P / 2, sy - P * 2.5, P, P * 5).fillRect(sx - P * 2.5, sy - P / 2, P * 5, P);
    star.fillStyle(0xfff4d0).fillRect(sx - P * 1.5, sy - P * 1.5, P * 3, P * 3);
    this.tweens.add({ targets: star, alpha: 0.35, yoyo: true, repeat: -1, duration: 380 });
    const hint = this.add.text(sx, sy + 70, `[${this.ctrl.actLabel}] Tunjuk bintang`, {
      fontFamily: FONT, fontSize: '30px', color: '#fbf3e0', backgroundColor: '#2b1d2add', padding: { x: 14, y: 8 },
    }).setOrigin(0.5).setDepth(6);
    await pressOnce(this);
    hint.destroy();
    Sfx.twinkle();
    // bintang jatuh
    const trail = this.add.rectangle(sx, sy, 60, 6, 0xfff4d0).setDepth(6).setAngle(-28);
    await tweenP(this, { targets: trail, x: 260, y: 400, alpha: 0, duration: 1100, ease: 'Quad.In' });
    trail.destroy();
    await memoryFound(this, 's1_bintang_malam');
    await this.dlg.play(S1.afterStar, { id: 's1_afterStar' });
    await this.sleepCutscene();
  }

  async sleepCutscene() {
    const r = this.player, y = this.yulia;
    const dark = this.add.rectangle(0, 0, W, H, 0x05071a, 0).setOrigin(0).setDepth(150);
    await tweenP(this, { targets: dark, fillAlpha: 0.55, duration: 1800 });
    // mata terpejam: frame kedip dari animasi duduk
    // mata terpejam: frame kedip dari animasi duduk (index 30)
    r.anims.stop(); r.setFrame(30);
    y.anims.stop(); y.setFrame(30);
    r.setDepth(160); y.setDepth(160);
    const zs = [];
    this.time.addEvent({
      delay: 700, repeat: 12, callback: () => {
        const z = this.add.text(BENCH_X + Phaser.Math.Between(-60, 80), SIT_Y - 200, 'z', { fontFamily: FONT, fontSize: '34px', color: '#c9d6ff' }).setDepth(170);
        zs.push(z);
        this.tweens.add({ targets: z, y: z.y - 90, x: z.x + 30, alpha: 0, duration: 1800, onComplete: () => z.destroy() });
      },
    });
    for (const line of S1.sleep) await caption(this, line, 2200, 260);
    Save.checkpoint('S1Poem');
    await goTo(this, 'S1Poem');
  }
}
