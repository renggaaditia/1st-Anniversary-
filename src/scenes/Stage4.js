// Stage 4 — The Breakup. Chapter 2: pemain = Yulia.
// S4Mall (sepi: pesan lama + photobooth) > S4Taman (hujan: Rengga menjauh)
// > S4Hidden (luka Rengga yang tidak Yulia ketahui) > S4Taman ending (Yulia sendiri) > ringkasan
import { W, H, FONT, COLOR, GROUND } from '../config.js';
import { Save } from '../save.js';
import { Sfx, rainStart, rainStop } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S4 } from '../data/stage4.js';
import { fadeIn, goTo, titleCard, caption, wait, walkTo, tweenP, faceToward, face, makeRain, pressAny, panel } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { stageSummary } from '../ui/summary.js';

const SLOW = 0.75;        // GDD: animasi karakter lebih lambat
const SLOW_WALK = 220;

function sparkle(scene, x, y) {
  const sp = scene.add.text(x, y, '✦', { fontFamily: FONT, fontSize: '34px', color: '#dfe6ff', stroke: '#2b1d2a', strokeThickness: 4 }).setOrigin(0.5).setDepth(91);
  scene.tweens.add({ targets: sp, alpha: 0.15, yoyo: true, repeat: -1, duration: 600 });
  return sp;
}

// ---------------------------------------------------------------- mall sepi
export class S4Mall extends StageBase {
  constructor() { super('S4Mall'); }

  create() {
    this.setupStage({ bg: 'bg_s4_mall_sepi', ground: GROUND.mall, player: 'yulia', minX: 120, maxX: 1560 });
    this.walkSpeed = SLOW_WALK;
    this.player = this.addChar('yulia', 1350);
    this.player.anims.timeScale = SLOW;
    this.done = 0;
    Save.checkpoint('S4Mall');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1200);
    await titleCard(this, 'STAGE 4', 'The Breakup');
    await this.dlg.play(S4.intro, { id: 's4_intro' });
    // HP di pinggir pot bunga
    const phone = this.add.image(250, GROUND.mall - 140, 's4_unanswered_message').setScale(0.55).setDepth(90);
    const sp1 = sparkle(this, 290, GROUND.mall - 190);
    this.addInteract({ x: 250, r: 150, label: 'Lihat HP', onUse: async () => { phone.destroy(); sp1.destroy(); await this.oldMessage(); this.next(); } });
    const sp2 = sparkle(this, 1060, GROUND.mall - 300);
    this.addInteract({ x: 1060, r: 140, label: 'Photobooth', onUse: async () => { sp2.destroy(); await this.booth(); this.next(); } });
    this.unlock();
  }

  async next() {
    this.done++;
    if (this.done < 2) { this.unlock(); return; }
    for (const l of S4.toPark) await caption(this, l, 1800);
    Save.checkpoint('S4Taman');
    await goTo(this, 'S4Taman');
  }

  // Layar HP dengan pesan lama Rengga.
  async oldMessage() {
    const c = this.add.container(0, 0).setDepth(2600);
    c.add(this.add.rectangle(0, 0, W, H, 0x0a0c1a, 0.7).setOrigin(0));
    const px = W / 2 - 230, py = 90;
    const g = this.add.graphics();
    g.fillStyle(0x1a1a24).fillRoundedRect(px - 16, py - 16, 492, 772, 36);
    g.fillStyle(0xeef0f6).fillRect(px, py + 40, 460, 660);
    g.fillStyle(0x2f6f73).fillRect(px, py + 40, 460, 70);
    c.add(g);
    c.add(this.add.text(px + 24, py + 75, 'Rengga', { fontFamily: FONT, fontSize: '30px', color: '#fbf3e0', fontStyle: '700' }).setOrigin(0, 0.5));
    let y = py + 140;
    for (const m of S4.message) {
      const t = this.add.text(px + 40, y + 16, m.text, { fontFamily: FONT, fontSize: '26px', color: '#2b1d2a', wordWrap: { width: 330 } });
      const b = this.add.graphics();
      b.fillStyle(0xffffff).fillRoundedRect(px + 24, y, t.width + 32, t.height + 32, 14);
      b.lineStyle(3, 0xc8cad6).strokeRoundedRect(px + 24, y, t.width + 32, t.height + 32, 14);
      c.add([b, t]);
      b.setAlpha(0); t.setAlpha(0);
      Sfx.blip();
      await tweenP(this, { targets: [b, t], alpha: 1, duration: 350 });
      y += t.height + 52;
      await wait(this, 700);
    }
    c.add(this.add.text(px + 436, y - 18, 'Belum dibalas', { fontFamily: FONT, fontSize: '20px', color: '#9a8f98' }).setOrigin(1, 0.5));
    const hint = this.add.text(W / 2, H - 50, 'Tekan untuk lanjut', { fontFamily: FONT, fontSize: '28px', color: '#fbf3e0' }).setOrigin(0.5);
    c.add(hint);
    await pressAny(this);
    await tweenP(this, { targets: c, alpha: 0, duration: 400 });
    c.destroy();
    // kenangan percakapan malam itu
    const dim = this.add.rectangle(0, 0, W, H, 0x000000, 0.45).setOrigin(0).setDepth(1800);
    await this.dlg.play(S4.flashback, { id: 's4_flashback' });
    dim.destroy();
    await memoryFound(this, 's4_unanswered_message');
  }

  async booth() {
    await walkTo(this, this.player, 1060, SLOW_WALK);
    this.player.play('yulia_sad');
    if (this.textures.exists('strip_snap')) {
      const s = this.add.image(W / 2, H / 2 - 40, 'strip_snap').setDepth(1700).setAlpha(0).setAngle(-4);
      s.preFX && s.preFX.addColorMatrix().grayscale(0.7);
      await tweenP(this, { targets: s, alpha: 0.9, duration: 700 });
      await this.dlg.play(S4.booth, { id: 's4_booth' });
      await tweenP(this, { targets: s, alpha: 0, duration: 600 });
      s.destroy();
    } else {
      await this.dlg.play(S4.booth, { id: 's4_booth' });
    }
    await memoryFound(this, 's4_broken_heart');
    this.player.play('yulia_idle');
  }
}

// ---------------------------------------------------------------- taman hujan
export class S4Taman extends StageBase {
  constructor() { super('S4Taman'); }

  init(data) { this.after = !!data.after; }

  create() {
    this.setupStage({ bg: 'bg_s4_taman_mendung', ground: GROUND.taman, player: 'yulia', minX: 120, maxX: 1560 });
    this.walkSpeed = SLOW_WALK;
    makeRain(this, GROUND.taman, { dark: 0.2 });
    this.events.once('shutdown', rainStop);
    this.player = this.addChar('yulia', this.after ? 1100 : 300);
    this.player.anims.timeScale = SLOW;
    if (!this.after) this.rengga = this.addChar('rengga', 1430);
    Save.checkpoint('S4Taman', { after: this.after });
    this.lock();
    (this.after ? this.ending() : this.run()).catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1200);
    rainStart();
    await this.dlg.play(S4.parkIntro, { id: 's4_parkIntro' });
    this.addInteract({ x: this.rengga.x, r: 330, label: 'Panggil Rengga', onUse: () => this.approach() });
    this.unlock();
  }

  async approach() {
    const y = this.player, r = this.rengga;
    await walkTo(this, y, r.x - 260, SLOW_WALK);
    await this.dlg.play(S4.approach, { id: 's4_approach' });
    // Rengga berbalik dan pergi tanpa menjawab
    face(r, 'right');
    await wait(this, 700);
    await walkTo(this, r, W + 120, 150);
    r.destroy();
    delete this.dlg.actors.rengga;
    y.play('yulia_sad');
    await this.dlg.play(S4.afterLeave, { id: 's4_afterLeave' });
    Save.checkpoint('S4Hidden');
    await goTo(this, 'S4Hidden');
  }

  async ending() {
    await fadeIn(this, 1200);
    rainStart();
    const y = this.player;
    y.play('yulia_sad');
    await caption(this, S4.ending, 3000, 300);
    const dark = this.add.rectangle(0, 0, W, H, 0x000000, 0).setOrigin(0).setDepth(800);
    await tweenP(this, { targets: dark, fillAlpha: 0.5, duration: 1500 });
    Save.completeStage(4);
    stageSummary(this, 4);
  }
}

// ---------------------------------------------------------------- yang tidak Yulia ketahui
export class S4Hidden extends StageBase {
  constructor() { super('S4Hidden'); }

  create() {
    this.setupStage({ bg: 'bg_s4_jalan_hujan', ground: GROUND.jalan, player: 'rengga', minX: 120, maxX: 1560 });
    makeRain(this, GROUND.jalan, { dark: 0.3 });
    this.events.once('shutdown', rainStop);
    this.r = this.addChar('rengga', W / 2);
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1400);
    rainStart();
    this.r.play('rengga_heartbroken');
    for (const l of S4.hidden) await caption(this, l, 2300, 260);
    await memoryFound(this, 's4_hidden_pain');
    Save.checkpoint('S4Taman', { after: true });
    await goTo(this, 'S4Taman', { after: true });
  }
}
