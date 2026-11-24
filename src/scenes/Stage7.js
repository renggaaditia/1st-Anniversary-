// Stage 7 — Our Happy Moments (Yulia). 7 mini-scene:
// 1 nonton film > 2 naik motor malam > 3 makan sate > 4 playground > 5 jalan bareng
// > 6 lari bareng > 7 taman bunga + "Did you regret the path you chose?"
import { W, H, FONT, COLOR, GROUND, WALK_SPEED } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S7, MOMENTS } from '../data/stage7.js';
import { fadeIn, fadeOut, goTo, titleCard, wait, walkTo, tweenP, face, faceToward, heartText, pressAny } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { stageSummary } from '../ui/summary.js';

const ORDER = ['S7Bioskop', 'S7Motor', 'S7Sate', 'S7Playground', 'S7Jalan', 'S7Lari', 'S7Taman'];

// Kartu judul momen kecil.
function momentCard(scene, i) {
  return titleCard(scene, `${i + 1} / 7`, MOMENTS[i], 1300);
}

// Petunjuk berkedip di bawah layar.
function hint(scene, str) {
  const t = scene.add.text(W / 2, H - 70, str, {
    fontFamily: FONT, fontSize: '34px', color: '#fff4d0', backgroundColor: '#2b1d2add', padding: { x: 18, y: 10 },
  }).setOrigin(0.5).setDepth(2600);
  scene.tweens.add({ targets: t, alpha: 0.55, yoyo: true, repeat: -1, duration: 520 });
  return t;
}

function hearts(scene, x, y, n = 6) {
  for (let i = 0; i < n; i++) {
    const h = scene.add.image(x + Phaser.Math.Between(-50, 50), y, 'emotes', 3).setDepth(1400);
    scene.tweens.add({ targets: h, y: h.y - 120, alpha: 0, duration: 1500, delay: i * 200, onComplete: () => h.destroy() });
  }
}

function sparkle(scene, x, y) {
  const sp = scene.add.text(x, y, '✦', { fontFamily: FONT, fontSize: '34px', color: '#fff4d0', stroke: '#2b1d2a', strokeThickness: 4 }).setOrigin(0.5).setDepth(1300);
  scene.tweens.add({ targets: sp, alpha: 0.15, yoyo: true, repeat: -1, duration: 500 });
  return sp;
}

// Tekan aksi n kali (keyboard / sentuh). onPress(i) tiap tekan.
function mash(scene, n, onPress) {
  return new Promise((resolve) => {
    let k = 0;
    const kb = scene.input.keyboard;
    const hit = () => {
      k++;
      onPress && onPress(k);
      if (k >= n) { kb.off('keydown', onKey); scene.input.off('pointerdown', hit); resolve(); }
    };
    const onKey = (ev) => { if (['Space', 'Enter', 'KeyE'].includes(ev.code)) hit(); };
    scene.time.delayedCall(120, () => { kb.on('keydown', onKey); scene.input.on('pointerdown', hit); });
  });
}

class S7Base extends StageBase {

  async next(i) {
    const key = ORDER[i + 1];
    if (key) { Save.checkpoint(key); await goTo(this, key); }
  }
}

// ---------------------------------------------------------------- 1. nonton film
export class S7Bioskop extends S7Base {
  constructor() { super('S7Bioskop'); }

  create() {
    this.setupStage({ bg: 'bg_s7_bioskop', ground: GROUND.mall, player: 'yulia', minX: 120, maxX: 1540 });
    this.player = this.addChar('yulia', 220);
    this.rengga = this.addChar('rengga', 1060);
    Save.checkpoint('S7Bioskop');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1000);
    await titleCard(this, 'STAGE 7', 'Our Happy Moments');
    await momentCard(this, 0);
    await this.dlg.play(S7.bioskopIntro, { id: 's7_bioskopIntro' });
    const sp = sparkle(this, 470, 520);
    this.addInteract({
      x: 470, r: 150, label: 'Beli tiket', onUse: async () => {
        sp.destroy();
        this.player.play('yulia_interact');
        await wait(this, 600);
        await this.dlg.play(S7.ticket);
        await memoryFound(this, 's7_tiket_bioskop');
        this.addInteract({ x: this.rengga.x, r: 200, label: 'Masuk studio', onUse: () => this.watch() });
        this.unlock();
      },
    });
    this.unlock();
  }

  async watch() {
    const y = this.player, r = this.rengga;
    await walkTo(this, y, r.x - 150, 240);
    await this.dlg.play(S7.enter, { id: 's7_enter' });
    walkTo(this, r, 900, 200);
    await walkTo(this, y, 840, 200);
    await fadeOut(this, 600);
    // di dalam studio: penonton menghadap kamera, layar = posisi kita
    this.bg.setTexture('bg_s7_bioskop_dalam');
    // kursi depan (latar) di x 666 & 840; karakter diperbesar supaya pas dengan kursi
    y.setPosition(666, 912).setDepth(200).setScale(1.45);
    r.setPosition(840, 912).setDepth(200).setScale(1.45);
    y.play('yulia_sit'); r.play('rengga_sit');
    faceToward(y, r.x); faceToward(r, y.x);
    // popcorn di antara mereka
    const pc = this.add.graphics().setDepth(210);
    const px = 753, py = 860;
    pc.fillStyle(0x2b1d2a).fillRect(px - 30, py - 70, 60, 76);
    pc.fillStyle(0xe8433f).fillRect(px - 25, py - 56, 50, 58);
    pc.fillStyle(0xfbf3e0).fillRect(px - 16, py - 56, 9, 58).fillRect(px + 6, py - 56, 9, 58);
    pc.fillStyle(0x2b1d2a).fillRect(px - 32, py - 92, 64, 26);
    pc.fillStyle(0xfff2c0).fillRect(px - 28, py - 88, 56, 20);
    pc.fillStyle(0xf6d06a).fillRect(px - 20, py - 92, 10, 8).fillRect(px + 4, py - 95, 10, 8).fillRect(px - 6, py - 98, 10, 8);
    // cahaya layar berkedip
    const glow = this.add.rectangle(0, 0, W, H, 0x6a8aff, 0.1).setOrigin(0).setDepth(300).setBlendMode(Phaser.BlendModes.ADD);
    const cols = [0x6a8aff, 0xffc080, 0xff80a0, 0x80ffd0, 0xffffff];
    this.time.addEvent({
      delay: 650, loop: true, callback: () => {
        glow.setFillStyle(Phaser.Utils.Array.GetRandom(cols), Phaser.Math.FloatBetween(0.06, 0.16));
      },
    });
    const shade = this.add.rectangle(0, 0, W, H, 0x000010, 0.25).setOrigin(0).setDepth(250);
    await fadeIn(this, 800);
    await this.dlg.play(S7.movie, { id: 's7_movie' });
    // Yulia menyandar
    await tweenP(this, { targets: y, x: 700, angle: 7, duration: 700, ease: 'Sine.InOut' });
    hearts(this, 753, 600, 5);
    await wait(this, 1800);
    shade.destroy();
    await this.next(0);
  }
}

// ---------------------------------------------------------------- 2. motor malam
export class S7Motor extends S7Base {
  constructor() { super('S7Motor'); }

  create() {
    this.setupStage({ bg: 'bg_s2_jalan_malam', ground: 905, player: 'yulia' });
    // latar bergulir tanpa sambungan: normal + cermin bergantian
    this.bg.setVisible(false);
    this.tiles = [0, 1].map((i) => this.add.image(i * W, 0, 'bg_s2_jalan_malam').setOrigin(0).setFlipX(i === 1).setDepth(0));
    this.scrollSpeed = 0;
    const mx = 820, my = 925;
    this.bike = this.add.container(mx, my).setDepth(150);
    const back = this.add.image(0, 0, 's7_motor').setOrigin(0.5, 1);
    const front = this.add.image(0, 0, 's7_motor_front').setOrigin(0.5, 1);
    // penumpang: Yulia di belakang, Rengga di depan (keduanya menghadap kanan)
    this.yul = this.add.sprite(-62, -50, 'yulia', 0).setOrigin(0.5, 1); this.yul.charName = 'yulia';
    this.ren = this.add.sprite(-4, -54, 'rengga', 0).setOrigin(0.5, 1); this.ren.charName = 'rengga';
    this.yul.play('yulia_sit'); this.ren.play('rengga_sit');
    face(this.yul, 'right'); face(this.ren, 'right');
    this.bike.add([back, this.yul, this.ren, front]);
    this.tweens.add({ targets: this.bike, y: my - 4, yoyo: true, repeat: -1, duration: 180 });
    // garis angin
    if (!this.textures.exists('windline')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xffffff, 0.8).fillRect(0, 0, 60, 3);
      g.generateTexture('windline', 60, 3); g.destroy();
    }
    this.add.particles(W + 40, 0, 'windline', {
      y: { min: 300, max: 900 }, speedX: { min: -1400, max: -1000 }, lifespan: 1600, quantity: 1, frequency: 140, alpha: { start: 0.5, end: 0 },
    }).setDepth(160);
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  update(t, d) {
    super.update(t, d);
    if (!this.tiles) return;
    for (const im of this.tiles) im.x -= this.scrollSpeed * (d / 1000);
    for (const im of this.tiles) {
      if (im.x <= -W) {
        const other = this.tiles.find((o) => o !== im);
        im.x = other.x + W;
      }
    }
  }

  async run() {
    await fadeIn(this, 800);
    await momentCard(this, 1);
    this.tweens.addCounter({ from: 0, to: 520, duration: 1500, onUpdate: (tw) => { this.scrollSpeed = tw.getValue(); } });
    await wait(this, 1200);
    await this.dlg.play(S7.motorIntro, { id: 's7_motorIntro' });
    const h = hint(this, S7.motorHint);
    await pressAny(this);
    h.destroy();
    Sfx.select();
    // Yulia merapat & berpegangan
    await tweenP(this, { targets: this.yul, x: -48, duration: 400 });
    this.yul.play('yulia_happy');
    hearts(this, this.bike.x - 30, this.bike.y - 230, 6);
    await wait(this, 900);
    await memoryFound(this, 's7_helm');
    await this.dlg.play(S7.motorAfter, { id: 's7_motorAfter' });
    await wait(this, 1200);
    await this.next(1);
  }
}

// ---------------------------------------------------------------- 3. makan sate
const GRILL_X = 456, TABLE_X = 642;
export class S7Sate extends S7Base {
  constructor() { super('S7Sate'); }

  create() {
    this.setupStage({ bg: 'bg_s7_warung_sate', ground: GROUND.jalan, player: 'yulia', minX: 120, maxX: 1540 });
    this.player = this.addChar('yulia', 1380);
    this.rengga = this.addChar('rengga', 1240);
    if (!this.textures.exists('smoke')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xe8e0f0, 0.7).fillRect(0, 0, 12, 12);
      g.generateTexture('smoke', 12, 12); g.destroy();
    }
    this.smoke = this.add.particles(GRILL_X, 640, 'smoke', {
      x: { min: -36, max: 36 }, speedY: { min: -70, max: -40 }, speedX: { min: -12, max: 20 },
      lifespan: 1800, quantity: 1, frequency: 260, scale: { start: 0.8, end: 2.2 }, alpha: { start: 0.45, end: 0 },
    }).setDepth(90);
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 800);
    await momentCard(this, 2);
    await this.dlg.play(S7.sateIntro, { id: 's7_sateIntro' });
    const sp = sparkle(this, GRILL_X, 560);
    this.addInteract({ x: GRILL_X + 40, r: 150, label: 'Pesan sate', onUse: () => this.fan(sp) });
    this.unlock();
  }

  async fan(sp) {
    sp.destroy();
    const y = this.player;
    await walkTo(this, y, GRILL_X + 90, 240);
    face(y, 'left');
    const h = hint(this, S7.fanHint);
    // bar kematangan
    const barBg = this.add.rectangle(y.x, y.y - 240, 220, 26, 0x2b1d2a).setDepth(1300);
    const bar = this.add.rectangle(y.x - 106, y.y - 240, 0, 16, 0xf2c14e).setOrigin(0, 0.5).setDepth(1301);
    const ember = this.add.rectangle(GRILL_X, 660, 84, 14, 0xff8a3a, 0).setDepth(95).setBlendMode(Phaser.BlendModes.ADD);
    await mash(this, 8, (k) => {
      Sfx.blip();
      y.play('yulia_interact', true);
      bar.width = 212 * (k / 8);
      ember.setFillStyle(0xff8a3a, 0.15 + k * 0.06);
      this.smoke.setFrequency(Math.max(50, 260 - k * 28));
    });
    h.destroy();
    await wait(this, 400);
    [barBg, bar].forEach((o) => o.destroy());
    this.tweens.add({ targets: ember, fillAlpha: 0.12, duration: 800 });
    this.smoke.setFrequency(220);
    await this.dlg.play(S7.sateReady);
    await memoryFound(this, 's7_sate');
    // makan berdiri di meja kecil, saling berhadapan
    await Promise.all([walkTo(this, this.rengga, TABLE_X + 120, 240), walkTo(this, y, TABLE_X - 115, 240)]);
    faceToward(y, this.rengga.x); faceToward(this.rengga, y.x);
    // piring sate di meja
    const plate = this.add.graphics().setDepth(97);
    plate.fillStyle(0x2b1d2a).fillRect(TABLE_X - 40, 680, 80, 14);
    plate.fillStyle(0xfbf3e0).fillRect(TABLE_X - 36, 682, 72, 10);
    for (let i = 0; i < 3; i++) plate.fillStyle(0xa8582a).fillRect(TABLE_X - 28 + i * 6, 672 - i * 2, 40, 6);
    await this.dlg.play(S7.sateEat, { id: 's7_sateEat' });
    hearts(this, (y.x + this.rengga.x) / 2, y.y - 200, 5);
    await wait(this, 1600);
    await this.next(2);
  }
}

// ---------------------------------------------------------------- 4. playground
const SWING_X = 702, SWING_TOP = 498, SWING_LEN = 258;
export class S7Playground extends S7Base {
  constructor() { super('S7Playground'); }

  create() {
    this.setupStage({ bg: 'bg_s7_playground', ground: GROUND.taman, player: 'yulia', minX: 120, maxX: 1560 });
    // ayunan kiri dibuat di engine supaya bisa diayun
    this.swing = this.add.container(SWING_X, SWING_TOP).setDepth(120);
    const g = this.add.graphics();
    g.fillStyle(0x8a8a9a).fillRect(-30, 0, 5, SWING_LEN).fillRect(25, 0, 5, SWING_LEN);
    g.fillStyle(0x2b1d2a).fillRect(-38, SWING_LEN - 3, 76, 18);
    g.fillStyle(0xf2c14e).fillRect(-35, SWING_LEN, 70, 10);
    g.fillStyle(0xc8903a).fillRect(-35, SWING_LEN + 10, 70, 2);
    this.swing.add(g);
    this.swingG = g;
    this.player = this.addChar('yulia', 260);
    this.rengga = this.addChar('rengga', 420);
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 800);
    await momentCard(this, 3);
    await this.dlg.play(S7.playIntro, { id: 's7_playIntro' });
    this.addInteract({ x: SWING_X, r: 140, label: 'Main ayunan', onUse: () => this.play() });
    this.unlock();
  }

  async play() {
    const y = this.player, r = this.rengga;
    walkTo(this, r, SWING_X - 150, 220);
    await walkTo(this, y, SWING_X, 220);
    // duduk di ayunan: pindahkan Yulia ke dalam container ayunan
    y.play('yulia_sit');
    y.setFlipX(false);
    y.setPosition(0, SWING_LEN + 52);
    this.swing.add(y);
    this.swing.bringToTop(this.swingG);   // rantai & dudukan di depan badan
    faceToward(r, SWING_X);
    let amp = 6;
    const swingTw = () => {
      if (this.swTw) this.swTw.stop();
      this.swing.angle = -amp;
      this.swTw = this.tweens.add({ targets: this.swing, angle: amp, duration: 900 + amp * 10, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
    };
    swingTw();
    const h = hint(this, S7.swingHint);
    await mash(this, 4, (k) => {
      Sfx.select();
      r.play('rengga_interact', true);
      amp = 6 + k * 4;
      swingTw();
    });
    h.destroy();
    y.play('yulia_happy');
    hearts(this, SWING_X, 520, 6);
    await wait(this, 2000);
    await memoryFound(this, 's7_ayunan');
    // ayunan pelan berhenti
    if (this.swTw) this.swTw.stop();
    await tweenP(this, { targets: this.swing, angle: 0, duration: 900, ease: 'Sine.Out' });
    this.swing.remove(y);
    y.setPosition(SWING_X, GROUND.taman);
    if (!this.children.exists(y)) this.add.existing(y);
    y.setDepth(100 + GROUND.taman / 10).setAngle(0);
    y.play('yulia_idle');
    await this.dlg.play(S7.playAfter, { id: 's7_playAfter' });
    await this.next(3);
  }
}

// ---------------------------------------------------------------- 5. jalan bareng
export class S7Jalan extends S7Base {
  constructor() { super('S7Jalan'); }

  create() {
    this.setupStage({ bg: 'bg_s2_taman_sore', ground: GROUND.taman, player: 'yulia', minX: 120, maxX: 1600 });
    this.player = this.addChar('yulia', 220);
    this.rengga = this.addChar('rengga', 420);
    this.follow = false;
    this.midDone = false;
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  update(t, d) {
    super.update(t, d);
    if (!this.follow || this.busy) return;
    const p = this.player, r = this.rengga;
    const dir = p.flipX === (p.charName === 'yulia') ? -1 : 1;   // arah hadap pemain
    const target = p.x - 80 * dir;
    const dx = target - r.x;
    if (Math.abs(dx) > 6) {
      r.x += Math.sign(dx) * Math.min(Math.abs(dx), (WALK_SPEED * 1.1) * (d / 1000));
      face(r, dx > 0 ? 'right' : 'left');
      r.play('rengga_walk', true);
    } else {
      faceToward(r, p.x + dir * 200);
      r.play('rengga_idle', true);
    }
    if (!this.midDone && p.x > 820) { this.midDone = true; this.mid(); }
    if (this.midDone && !this.endDone && p.x > 1480) { this.endDone = true; this.end(); }
  }

  async run() {
    await fadeIn(this, 800);
    await momentCard(this, 4);
    await this.dlg.play(S7.walkIntro, { id: 's7_walkIntro' });
    this.addInteract({
      x: this.rengga.x, r: 160, label: 'Gandeng tangan', onUse: async () => {
        await walkTo(this, this.player, this.rengga.x + 80, 200);
        faceToward(this.player, this.rengga.x); faceToward(this.rengga, this.player.x);
        await this.dlg.play(S7.walkHold, { id: 's7_walkHold' });
        hearts(this, (this.player.x + this.rengga.x) / 2, this.player.y - 200, 4);
        face(this.player, 'right');
        this.follow = true;
        this.walkSpeed = 220;
        this.unlock();
      },
    });
    this.unlock();
  }

  async mid() {
    this.lock();
    await this.dlg.play(S7.walkMid, { id: 's7_walkMid' });
    face(this.player, 'right');
    this.unlock();
  }

  async end() {
    this.lock();
    this.follow = false;
    await this.dlg.play(S7.walkEnd);
    await memoryFound(this, 's7_jejak');
    walkTo(this, this.rengga, W + 60, 200);
    await walkTo(this, this.player, W + 140, 200);
    await this.next(4);
  }
}

// ---------------------------------------------------------------- 6. lari bareng
const FINISH_X = 1440;
export class S7Lari extends S7Base {
  constructor() { super('S7Lari'); }

  create() {
    this.setupStage({ bg: 'bg_s7_pantai_pagi', ground: GROUND.pantai, player: 'yulia', minX: 120, maxX: 1560 });
    this.player = this.addChar('yulia', 180);
    this.rengga = this.addChar('rengga', 150);
    this.rengga.y = GROUND.pantai - 56; this.rengga.setDepth(this.player.depth - 1);
    // bendera finish
    const g = this.add.graphics().setDepth(95);
    g.fillStyle(0x2b1d2a).fillRect(FINISH_X - 4, GROUND.pantai - 260, 10, 260);
    g.fillStyle(0xfbf3e0).fillRect(FINISH_X + 6, GROUND.pantai - 256, 90, 56);
    g.fillStyle(0xc84a6a);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2 === 0) g.fillRect(FINISH_X + 6 + i * 15, GROUND.pantai - 256 + j * 14, 15, 14);
    this.racing = false;
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  update(t, d) {
    super.update(t, d);
    if (!this.racing) return;
    const dt = d / 1000;
    const p = this.player, r = this.rengga;
    // pemain: tahan kanan untuk lari (lebih cepat dari jalan biasa)
    if (this.ctrl.right) { p.x += 440 * dt; p.play('yulia_run', true); face(p, 'right'); } else p.play('yulia_idle', true);
    r.x += 330 * dt; r.play('rengga_run', true); face(r, 'right');
    // Rengga "kebetulan" melambat dekat garis finish
    if (r.x > FINISH_X - 160 && p.x < FINISH_X - 40) r.x -= 160 * dt;
    r.x = Math.min(r.x, FINISH_X - 30);
    if (p.x >= FINISH_X) { this.racing = false; this.finish(); }
  }

  async run() {
    await fadeIn(this, 800);
    await momentCard(this, 5);
    await this.dlg.play(S7.runIntro, { id: 's7_runIntro' });
    face(this.player, 'right'); face(this.rengga, 'right');
    for (const n of ['3', '2', '1', 'GO!']) {
      const t = this.add.text(W / 2, H / 2 - 120, n, { fontFamily: FONT, fontSize: '120px', color: '#fff4d0', fontStyle: '700', stroke: '#c84a6a', strokeThickness: 12 }).setOrigin(0.5).setDepth(3000);
      Sfx.blip();
      await tweenP(this, { targets: t, scale: 1.4, alpha: 0, duration: 700 });
      t.destroy();
    }
    this.hintT = hint(this, S7.runHint);
    this.ctrl.setVisible(true);
    this.racing = true;
  }

  async finish() {
    this.hintT.destroy();
    this.ctrl.setVisible(false);
    const p = this.player, r = this.rengga;
    p.play('yulia_happy');
    Sfx.chime();
    hearts(this, p.x, p.y - 200, 4);
    await walkTo(this, r, p.x - 110, 160);
    r.play('rengga_idle');
    await this.dlg.play(S7.runWin, { id: 's7_runWin' });
    await memoryFound(this, 's7_medali');
    await this.next(5);
  }
}

// ---------------------------------------------------------------- 7. taman bunga
const ARCH_X = 834, BENCH_X = 395, SIT_Y = 702;
export class S7Taman extends S7Base {
  constructor() { super('S7Taman'); }

  create() {
    this.setupStage({ bg: 'bg_s7_taman_bunga', ground: GROUND.taman, player: 'yulia', minX: 120, maxX: 1560 });
    this.player = this.addChar('yulia', 1450);
    this.rengga = this.addChar('rengga', BENCH_X + 70);
    // kelopak bunga berjatuhan
    if (!this.textures.exists('petal')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xf6a8c0).fillRect(0, 0, 9, 6).fillStyle(0xffd0dc).fillRect(0, 0, 4, 3);
      g.generateTexture('petal', 9, 6); g.destroy();
    }
    this.add.particles(0, -20, 'petal', {
      x: { min: 0, max: W }, speedY: { min: 40, max: 90 }, speedX: { min: -30, max: 40 }, rotate: { min: 0, max: 360 },
      lifespan: 12000, quantity: 1, frequency: 380, alpha: { start: 0.9, end: 0.6 },
    }).setDepth(900);
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1000);
    await momentCard(this, 6);
    await this.dlg.play(S7.flowerIntro, { id: 's7_flowerIntro' });
    const sp = sparkle(this, 1180, 640);
    this.addInteract({
      x: 1180, r: 150, label: 'Cium bunga', onUse: async () => {
        sp.destroy();
        this.player.play('yulia_interact');
        await wait(this, 700);
        await this.dlg.play(S7.flowerSmell);
        await memoryFound(this, 's7_bunga_taman');
        this.addInteract({ x: BENCH_X + 70, r: 190, label: 'Duduk bersama', onUse: () => this.bench() });
        this.unlock();
      },
    });
    this.unlock();
  }

  async bench() {
    const y = this.player, r = this.rengga;
    await walkTo(this, y, BENCH_X + 160, 220);
    await walkTo(this, r, BENCH_X - 20, 120);
    await walkTo(this, y, BENCH_X + 90, 160);
    r.play('rengga_sit'); y.play('yulia_sit');
    faceToward(r, y.x); faceToward(y, r.x);
    await Promise.all([tweenP(this, { targets: r, y: SIT_Y, duration: 300 }), tweenP(this, { targets: y, y: SIT_Y, duration: 300 })]);
    await wait(this, 600);
    await this.dlg.play(S7.benchTalk, { id: 's7_benchTalk' });
    const lines = [{ who: 'rengga', text: S7.question, choices: S7.answers, choiceId: 's7_regret', replies: S7.replies }];
    const i = await this.dlg.play(lines);
    Save.data.stage7Answer = S7.answers[i ?? 0];
    Save.persist();
    hearts(this, (y.x + r.x) / 2, SIT_Y - 180, 8);
    await wait(this, 1500);
    await heartText(this, S7.heartEnd, 'Hati Yulia');
    await this.ending();
  }

  async ending() {
    const t = this.add.text(W / 2, H / 2, S7.ending, {
      fontFamily: FONT, fontSize: '60px', color: '#fff4d0', fontStyle: '700', stroke: '#c84a6a', strokeThickness: 10, align: 'center',
    }).setOrigin(0.5).setDepth(2200).setAlpha(0);
    Sfx.chime();
    await tweenP(this, { targets: t, alpha: 1, duration: 900 });
    await wait(this, 2000);
    await tweenP(this, { targets: t, alpha: 0, duration: 700 });
    t.destroy();
    const dark = this.add.rectangle(0, 0, W, H, 0x000000, 0).setOrigin(0).setDepth(800);
    await tweenP(this, { targets: dark, fillAlpha: 0.45, duration: 900 });
    Save.completeStage(7);
    stageSummary(this, 7);
  }
}
