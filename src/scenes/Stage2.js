// Stage 2 — Our First Date?
// Alur: S2Kampus (siang, ajak jalan) > S2Bunga (sore, surat izin + bouquet) > S2Mall (malam, kasih bunga) > S2Booth (photobooth canggung, malam)
//       > S2Taman (Rengga duduk sendiri) > S2Jalan (berjalan menjauh + ringkasan)
import { W, H, FONT, COLOR, GROUND } from '../config.js';
import { Save } from '../save.js';
import { Sfx, rainStart, rainStop } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S2 } from '../data/stage2.js';
import { fadeIn, goTo, titleCard, caption, wait, walkTo, tweenP, faceToward, panel, heartText, makeRain } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { stageSummary } from '../ui/summary.js';
import { pressOnce } from './S1Tanjung.js';

// Benda berkilau di lantai yang bisa diambil.
function sparkleItem(scene, x, y, key, scale = 0.6) {
  const t = scene.add.image(x, y, key).setScale(scale).setDepth(90).setAngle(-12);
  scene.tweens.add({ targets: t, y: y - 10, yoyo: true, repeat: -1, duration: 700, ease: 'Sine.InOut' });
  const sp = scene.add.text(x + 30, y - 60, '✦', { fontFamily: FONT, fontSize: '34px', color: '#fff4d0', stroke: '#2b1d2a', strokeThickness: 4 }).setDepth(91);
  scene.tweens.add({ targets: sp, alpha: 0.1, yoyo: true, repeat: -1, duration: 450 });
  return { destroy() { t.destroy(); sp.destroy(); } };
}

// ---------------------------------------------------------------- kampus (siang)
export class S2Kampus extends StageBase {
  constructor() { super('S2Kampus'); }

  create() {
    this.setupStage({ bg: 'bg_s2_kampus', ground: GROUND.kampus, minX: 120, maxX: 1560 });
    this.player = this.addChar('rengga', 260);
    this.yulia = this.addChar('yulia', 1260);
    Save.checkpoint('S2Kampus');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 700);
    await titleCard(this, 'STAGE 2', 'Our First Date?');
    await this.dlg.play(S2.kampus, { id: 's2_kampus' });
    this.addInteract({ x: this.yulia.x, r: 220, label: 'Sapa Yulia', onUse: () => this.meet() });
    this.unlock();
  }

  async meet() {
    const r = this.player, y = this.yulia;
    await walkTo(this, r, y.x - 150);
    await this.dlg.play(S2.kampusMeet, { id: 's2_kampusMeet' });
    await walkTo(this, y, W + 120, 240);
    r.play('rengga_happy');
    await wait(this, 900);
    Save.checkpoint('S2Bunga');
    await goTo(this, 'S2Bunga');
  }
}

// ---------------------------------------------------------------- toko bunga
export class S2Bunga extends StageBase {
  constructor() { super('S2Bunga'); }

  create() {
    this.setupStage({ bg: 'bg_s2_toko_bunga', ground: GROUND.bunga, minX: 120, maxX: 1560 });
    this.player = this.addChar('rengga', 470);
    Save.checkpoint('S2Bunga');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 700);
    await this.dlg.play(S2.intro, { id: 's2_intro' });

    if (!Save.has('s2_permission_letter')) {
      const item = sparkleItem(this, 1330, GROUND.bunga - 20, 's2_permission_letter');
      this.addInteract({
        x: 1330, r: 110, label: 'Ambil', onUse: async () => {
          item.destroy();
          await this.dlg.play(S2.letter);
          await memoryFound(this, 's2_permission_letter');
          this.unlock();
        },
      });
    }
    // pintu toko (x ~945 di background)
    this.addInteract({ x: 945, r: 120, label: 'Masuk', once: false, onUse: () => this.enterShop() });
    this.unlock();
  }

  async enterShop() {
    if (!Save.has('s2_permission_letter')) {
      await this.dlg.play(S2.needLetter);
      this.unlock();
      return;
    }
    this.interactables.forEach((it) => (it.enabled = false));
    await walkTo(this, this.player, 945);
    await tweenP(this, { targets: this.player, alpha: 0, duration: 300 });
    const dim = this.add.rectangle(0, 0, W, H, 0x2b1d2a, 0).setOrigin(0).setDepth(1900);
    await tweenP(this, { targets: dim, fillAlpha: 0.55, duration: 500 });
    await this.dlg.play(S2.shop, { id: 's2_shop' });
    await memoryFound(this, 's2_bouquet');
    for (const line of S2.toMall) await caption(this, line, 1700);
    Save.checkpoint('S2Mall');
    await goTo(this, 'S2Mall');
  }
}

// ---------------------------------------------------------------- mall
export class S2Mall extends StageBase {
  constructor() { super('S2Mall'); }

  create() {
    this.setupStage({ bg: 'bg_s2_mall', ground: GROUND.mall, minX: 120, maxX: 1560 });
    this.add.rectangle(0, 0, W, H, 0x1a2050, 0.22).setOrigin(0).setDepth(1);   // malam hari
    this.player = this.addChar('rengga', 470);
    this.yulia = this.addChar('yulia', 1180);
    Save.checkpoint('S2Mall');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 700);
    await caption(this, 'Malam hari, di mall', 1400, 300);
    this.addInteract({ x: this.yulia.x, r: 220, label: 'Sapa Yulia', onUse: () => this.meet() });
    this.unlock();
  }

  async meet() {
    const r = this.player, y = this.yulia;
    await walkTo(this, r, y.x - 150);
    faceToward(r, y.x); faceToward(y, r.x);
    // bouquet berpindah tangan
    const b = this.add.image(r.x + 20, r.y - 90, 's2_bouquet').setScale(0.7).setDepth(300).setAlpha(0);
    r.play('rengga_interact');
    await tweenP(this, { targets: b, alpha: 1, duration: 250 });
    await this.dlg.play(S2.meet, { id: 's2_meet' });
    await tweenP(this, { targets: b, x: y.x - 10, y: y.y - 80, duration: 500, ease: 'Sine.InOut' });
    await tweenP(this, { targets: b, alpha: 0, duration: 400 });
    b.destroy();
    await Promise.all([walkTo(this, y, W + 120, 260), wait(this, 300).then(() => walkTo(this, r, W + 60, 260))]);
    Save.checkpoint('S2Booth');
    await goTo(this, 'S2Booth');
  }
}

// ---------------------------------------------------------------- photobooth
export class S2Booth extends StageBase {
  constructor() { super('S2Booth'); }

  create() {
    this.setupStage({ bg: 'bg_s2_photobooth', ground: GROUND.booth, minX: 120, maxX: 1560 });
    this.add.rectangle(0, 0, W, H, 0x1a2050, 0.18).setOrigin(0).setDepth(1);   // malam hari
    this.player = this.addChar('rengga', 560);
    this.yulia = this.addChar('yulia', 760);
    Save.checkpoint('S2Booth');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 700);
    await this.dlg.play(S2.booth, { id: 's2_booth' });
    await this.dlg.play(S2.boothHelp, { id: 's2_boothHelp' });
    await this.boothGame();
    await this.dlg.play(S2.afterStrip, { id: 's2_afterStrip' });
    await walkTo(this, this.yulia, -140, 240);
    this.yulia.setVisible(false);
    faceToward(this.player, 0);
    this.player.play('rengga_sad');
    await wait(this, 900);
    await memoryFound(this, 's2_uncertain_heart');
    Save.checkpoint('S2Taman');
    await goTo(this, 'S2Taman');
  }

  // Mini-game photobooth: 4 jepret, hitung mundur, tekan saat "1" agar Rengga tersenyum.
  async boothGame() {
    const F = { x: W / 2 - 240, y: 250, w: 480, h: 300 };
    const ui = this.add.container(0, 0).setDepth(2600);
    ui.add(this.add.rectangle(0, 0, W, H, 0x1a1020, 0.82).setOrigin(0));
    // bingkai kamera
    ui.add(panel(this, F.x - 24, F.y - 24, F.w + 48, F.h + 120, 0xf4e6ee));
    // latar booth (pink dengan hati)
    const bg = this.add.graphics();
    bg.fillStyle(0xf6c9d6).fillRect(F.x, F.y, F.w, F.h);
    bg.fillStyle(0xf9dbe4);
    for (let yy = F.y; yy < F.y + F.h; yy += 48) for (let xx = F.x + ((yy / 48) % 2) * 24; xx < F.x + F.w; xx += 48) bg.fillRect(xx, yy, 24, 24);
    bg.fillStyle(0xe8a2b6);
    [[F.x + 60, F.y + 50], [F.x + F.w - 80, F.y + 70], [F.x + F.w / 2, F.y + 36]].forEach(([hx, hy]) => {
      bg.fillRect(hx, hy, 8, 8).fillRect(hx + 16, hy, 8, 8).fillRect(hx - 4, hy + 6, 32, 10).fillRect(hx + 2, hy + 16, 20, 6).fillRect(hx + 8, hy + 22, 8, 6);
    });
    ui.add(bg);
    const rr = this.add.sprite(F.x + 160, F.y + F.h, 'rengga', 0).setOrigin(0.5, 1).setFlipX(true);
    const yy = this.add.sprite(F.x + 330, F.y + F.h, 'yulia', 0).setOrigin(0.5, 1).setFlipX(true);
    ui.add([rr, yy]);
    const count = this.add.text(W / 2, F.y + F.h + 50, '', { fontFamily: FONT, fontSize: '48px', color: COLOR.roseCss, fontStyle: '700' }).setOrigin(0.5);
    const shotLbl = this.add.text(W / 2, F.y - 70, '', { fontFamily: FONT, fontSize: '32px', color: '#fbf3e0' }).setOrigin(0.5);
    const hint = this.add.text(W / 2, F.y + F.h + 150, `Tekan [${this.ctrl.actLabel}] saat hitungan "1"`, { fontFamily: FONT, fontSize: '28px', color: '#fbf3e0' }).setOrigin(0.5);
    ui.add([count, shotLbl, hint]);

    // Pose Yulia per jepretan: kaku, membuang muka, murung, senyum tipis.
    const yuliaPose = [
      () => { yy.setFrame(0); yy.setFlipX(true); },
      () => { yy.setFrame(0); yy.setFlipX(false); },
      () => { yy.setFrame(24); yy.setFlipX(true); },
      () => { yy.setFrame(2); yy.setFlipX(true); },
    ];
    const shots = [];
    const kb = this.input.keyboard;
    for (let i = 0; i < 4; i++) {
      shotLbl.setText(`Jepret ${i + 1}/4`);
      rr.setFrame(0); yuliaPose[i]();
      let pressedAt = -1, windowOpen = false, smiled = false;
      const onPress = () => { if (pressedAt < 0) { pressedAt = this.time.now; smiled = windowOpen; if (smiled) rr.setFrame(20); } };
      const onKey = (ev) => { if (['Space', 'Enter', 'KeyE'].includes(ev.code)) onPress(); };
      kb.on('keydown', onKey); this.input.on('pointerdown', onPress);
      for (const n of ['3', '2', '1']) {
        count.setText(n).setScale(1.4);
        this.tweens.add({ targets: count, scale: 1, duration: 300 });
        Sfx.move();
        windowOpen = n === '1';
        await wait(this, n === '1' ? 750 : 600);
      }
      windowOpen = false;
      kb.off('keydown', onKey); this.input.off('pointerdown', onPress);
      if (!smiled) rr.setFrame(i % 2 ? 16 : 0);       // senyum terlambat: pose kaku
      count.setText('');
      // jepret: sembunyikan teks agar tidak ikut terfoto
      await wait(this, 40);
      shots.push(await this.snap(F));
      Sfx.shutter();
      const fl = this.add.rectangle(0, 0, W, H, 0xffffff, 1).setOrigin(0).setDepth(2700);
      await tweenP(this, { targets: fl, alpha: 0, duration: 380 });
      fl.destroy();
      count.setText(smiled ? 'Senyum!' : '...').setScale(0.8);
      await wait(this, 650);
    }
    count.setText('');
    hint.setText('Mencetak foto...');
    await wait(this, 700);
    ui.destroy();
    await this.showStrip(shots);
  }

  snap(F) {
    return new Promise((resolve) => {
      try {
        this.game.renderer.snapshotArea(F.x, F.y, F.w, F.h, (img) => resolve(img));
      } catch (e) { resolve(null); }
    });
  }

  // Gabungkan 4 jepretan jadi photobooth strip, simpan, tampilkan.
  async showStrip(shots) {
    const fw = 192, fh = 120, pad = 12;
    const cv = document.createElement('canvas');
    cv.width = fw + pad * 2; cv.height = pad + 4 * (fh + pad) + 30;
    const cx = cv.getContext('2d');
    cx.imageSmoothingEnabled = false;
    cx.fillStyle = '#fffdf6'; cx.fillRect(0, 0, cv.width, cv.height);
    shots.forEach((img, i) => { if (img) cx.drawImage(img, pad, pad + i * (fh + pad), fw, fh); });
    cx.fillStyle = '#c84a6a'; cx.font = '16px monospace'; cx.textAlign = 'center';
    cx.fillText('first date', cv.width / 2, cv.height - 12);
    const url = cv.toDataURL('image/png');
    Save.data.strip = url;
    Save.persist();
    await new Promise((r) => {
      if (this.textures.exists('strip_snap')) this.textures.remove('strip_snap');
      const im = new Image();
      im.onload = () => { this.textures.addImage('strip_snap', im); r(); };
      im.onerror = r;
      im.src = url;
    });
    const s = this.add.image(W / 2, H / 2 - 20, 'strip_snap').setDepth(3200).setScale(1.2).setAngle(8).setAlpha(0);
    await tweenP(this, { targets: s, alpha: 1, angle: 3, duration: 600, ease: 'Back.Out' });
    await memoryFound(this, 's2_photobooth_strip');
    const hint = this.add.text(W / 2, H - 50, 'Tekan untuk lanjut', { fontFamily: FONT, fontSize: '30px', color: '#fff4d0', stroke: '#2b1d2a', strokeThickness: 6 }).setOrigin(0.5).setDepth(3300);
    await pressOnce(this);
    hint.destroy();
    await tweenP(this, { targets: s, alpha: 0, duration: 400 });
    s.destroy();
    this.player.play('rengga_idle'); this.yulia.play('yulia_idle');
  }
}

// ---------------------------------------------------------------- taman sore
const BENCH2_X = 395;
const SIT2_Y = 702;

export class S2Taman extends StageBase {
  constructor() { super('S2Taman'); }

  create() {
    this.setupStage({ bg: 'bg_s2_taman_malam', ground: GROUND.taman, minX: 120, maxX: 1560 });
    this.player = this.addChar('rengga', 1300);
    Save.checkpoint('S2Taman');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1000);
    await this.dlg.play(S2.park, { id: 's2_park' });
    this.addInteract({ x: BENCH2_X, r: 170, label: 'Duduk', onUse: () => this.sitAlone() });
    this.unlock();
  }

  async sitAlone() {
    const r = this.player;
    await walkTo(this, r, BENCH2_X, 200);
    r.play('rengga_sit');
    await tweenP(this, { targets: r, y: SIT2_Y, duration: 300 });
    await wait(this, 1200);
    r.play('rengga_sad');
    await heartText(this, S2.heartEnd);
    r.play('rengga_idle');
    await tweenP(this, { targets: r, y: GROUND.taman, duration: 300 });
    Save.checkpoint('S2Jalan');
    await walkTo(this, r, W + 100, 150);
    await goTo(this, 'S2Jalan');
  }
}

// ---------------------------------------------------------------- jalan malam
export class S2Jalan extends StageBase {
  constructor() { super('S2Jalan'); }

  create() {
    this.setupStage({ bg: 'bg_s2_jalan_malam', ground: GROUND.jalan, minX: 120, maxX: 1560 });
    this.player = this.addChar('rengga', 200);
    makeRain(this, GROUND.jalan);
    Save.checkpoint('S2Jalan');
    this.lock();
    this.events.once('shutdown', rainStop);
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1000);
    rainStart();
    this.player.play('rengga_sad');
    await wait(this, 1200);
    const walking = walkTo(this, this.player, W + 120, 90);
    await caption(this, 'Hujan turun.', 1800, 300);
    await caption(this, 'Rengga berjalan pulang sendirian.', 2400, 300);
    await walking;
    rainStop();
    Save.completeStage(2);
    stageSummary(this, 2);
  }
}
