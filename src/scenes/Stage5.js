// Stage 5 — The Regret (Yulia).
// S5Phone: L1 The Signals (Story, Catatan, Status) + L2 The First Message (chat)
// S5Buku : L3 The Book + L4 A Little Closer + L5 The Second Chance + ringkasan
// UI media sosial dibuat generik, tanpa logo atau tampilan resmi aplikasi mana pun.
import { W, H, FONT, COLOR, GROUND } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S5 } from '../data/stage5.js';
import { fadeIn, goTo, titleCard, caption, wait, walkTo, tweenP, toast } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { stageSummary } from '../ui/summary.js';

const P = { x: 900, y: 34, w: 520, h: 872 };
const S = { x: P.x + 20, y: P.y + 64, w: P.w - 40, h: P.h - 110 };

// Ponsel di layar: header, kartu pratinjau, gelembung chat, tombol pilihan.
class Phone {
  constructor(scene) {
    this.s = scene;
    const g = scene.add.graphics().setDepth(1000);
    g.fillStyle(0x15141c).fillRoundedRect(P.x, P.y, P.w, P.h, 44);
    g.fillStyle(0x2a2834).fillRoundedRect(P.x + 6, P.y + 6, P.w - 12, P.h - 12, 40);
    g.fillStyle(0xf4f2f8).fillRect(S.x, S.y, S.w, S.h);
    g.fillStyle(0x15141c).fillRoundedRect(P.x + P.w / 2 - 60, P.y + 22, 120, 20, 10);
    this.c = scene.add.container(0, 0).setDepth(1001);
    this.y = 0;
    this.bubbles = [];
  }

  screen(title, color) {
    this.c.removeAll(true);
    this.bubbles = [];
    const hd = this.s.add.rectangle(S.x, S.y, S.w, 76, color).setOrigin(0);
    const t = this.s.add.text(S.x + 24, S.y + 38, title, { fontFamily: FONT, fontSize: '32px', color: '#ffffff', fontStyle: '700' }).setOrigin(0, 0.5);
    this.c.add([hd, t]);
    this.y = S.y + 100;
  }

  label(text, color = '#6a6478', size = 24) {
    const t = this.s.add.text(S.x + 24, this.y, text, { fontFamily: FONT, fontSize: `${size}px`, color, wordWrap: { width: S.w - 48 } });
    this.c.add(t);
    this.y += t.height + 14;
    return t;
  }

  card(color, text) {
    const h = 380;
    const r = this.s.add.rectangle(S.x + 24, this.y, S.w - 48, h, color).setOrigin(0).setStrokeStyle(4, 0x2b1d2a);
    const t = this.s.add.text(S.x + S.w / 2, this.y + h / 2, text, {
      fontFamily: FONT, fontSize: '30px', color: '#ffffff', align: 'center', wordWrap: { width: S.w - 100 }, stroke: '#2b1d2a', strokeThickness: 4,
    }).setOrigin(0.5);
    this.c.add([r, t]);
    this.y += h + 18;
  }

  async bubble(text, side) {
    const mine = side === 'yulia';
    const t = this.s.add.text(0, 0, text, { fontFamily: FONT, fontSize: '26px', color: mine ? '#ffffff' : '#2b1d2a', wordWrap: { width: 320 } });
    const bw = t.width + 32, bh = t.height + 24;
    const bx = mine ? S.x + S.w - 20 - bw : S.x + 20;
    const b = this.s.add.graphics();
    b.fillStyle(mine ? 0x2f6f73 : 0xffffff).fillRoundedRect(bx, this.y, bw, bh, 14);
    if (!mine) b.lineStyle(3, 0xd0ccd8).strokeRoundedRect(bx, this.y, bw, bh, 14);
    t.setPosition(bx + 16, this.y + 12);
    this.c.add([b, t]);
    b.setAlpha(0); t.setAlpha(0);
    Sfx.blip();
    // layar penuh: buang gelembung paling lama, geser sisanya ke atas
    const limit = S.y + S.h - 40;
    while (this.y + bh > limit && this.bubbles.length) {
      const old = this.bubbles.shift();
      old.b.destroy(); old.t.destroy();
      const dy = old.h + 12;
      this.bubbles.forEach((o) => { o.b.y -= dy; o.t.y -= dy; });
      b.y -= dy; t.y -= dy;
      this.y -= dy;
    }
    this.bubbles.push({ b, t, h: bh });
    await tweenP(this.s, { targets: [b, t], alpha: 1, duration: 260 });
    this.y += bh + 12;
  }

  // Tombol pilihan di bawah layar ponsel. Hasil: index.
  choose(options) {
    const s = this.s;
    let idx = 0;
    const objs = [];
    let y = S.y + S.h - 24;
    for (let i = options.length - 1; i >= 0; i--) {
      const t = s.add.text(S.x + S.w / 2, 0, options[i], { fontFamily: FONT, fontSize: '24px', color: COLOR.inkCss, align: 'center', wordWrap: { width: S.w - 80 } }).setOrigin(0.5).setDepth(1003);
      const h = Math.max(62, t.height + 24);
      y -= h + 10;
      const r = s.add.rectangle(S.x + S.w / 2, y + h / 2, S.w - 40, h, COLOR.paper).setStrokeStyle(4, COLOR.ink).setDepth(1002).setInteractive({ useHandCursor: true });
      t.setY(y + h / 2);
      objs[i] = { r, t };
    }
    const refresh = () => objs.forEach((o, i) => o.r.setFillStyle(i === idx ? 0xf2c14e : COLOR.paper));
    refresh();
    return new Promise((resolve) => {
      const kb = s.input.keyboard;
      const pick = (i) => {
        kb.off('keydown', onKey);
        Sfx.select();
        objs.forEach((o) => { o.r.destroy(); o.t.destroy(); });
        resolve(i);
      };
      const onKey = (ev) => {
        if (ev.code === 'ArrowDown' || ev.code === 'KeyS') { idx = (idx + 1) % objs.length; Sfx.move(); refresh(); }
        else if (ev.code === 'ArrowUp' || ev.code === 'KeyW') { idx = (idx - 1 + objs.length) % objs.length; Sfx.move(); refresh(); }
        else if (['Space', 'Enter', 'KeyE'].includes(ev.code)) pick(idx);
      };
      objs.forEach((o, i) => { o.r.on('pointerover', () => { idx = i; refresh(); }); o.r.on('pointerdown', () => pick(i)); });
      s.time.delayedCall(200, () => kb.on('keydown', onKey));
    });
  }
}

// ---------------------------------------------------------------- HP Yulia
export class S5Phone extends StageBase {
  constructor() { super('S5Phone'); }

  create() {
    this.setupStage({ bg: 'bg_s5_malam_bokeh', ground: 860, player: 'yulia' });
    this.yulia = this.addChar('yulia', 450);
    this.yulia.setScale(1.5);
    Save.checkpoint('S5Phone');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1000);
    await titleCard(this, 'STAGE 5', 'The Regret');
    await this.dlg.play(S5.intro, { id: 's5_intro' });
    this.yulia.play('yulia_interact');
    const ph = new Phone(this);

    // Level 1 — The Signals
    for (const post of S5.posts) {
      ph.screen(post.title, post.color);
      ph.label('Pilih isi unggahan:');
      const i = await ph.choose(post.options);
      Save.setChoice(`s5_${post.app}`, i);
      ph.screen(post.app, post.color);
      ph.card(post.color, post.options[i]);
      await ph.choose(['Bagikan']);
      toast(this, `${post.app} dibagikan`);
      await wait(this, 500);
    }
    ph.screen('Aktivitas', 0x4a4458);
    await caption(this, 'Beberapa jam kemudian...', 1400, 120);
    for (const post of S5.posts) {
      ph.label(`${post.app}`, '#2b1d2a', 28);
      ph.label('Dilihat oleh: Rengga  ·  tidak ada balasan');
      await wait(this, 500);
    }
    await this.dlg.play(S5.afterPosts, { id: 's5_afterPosts' });
    await this.dlg.play(S5.renggaSide, { id: 's5_renggaSide' });

    // Level 2 — The First Message
    ph.screen('Rengga', 0x2f6f73);
    ph.label('Mulai percakapan:');
    const o = await ph.choose(S5.openers);
    Save.setChoice('s5_opener', o);
    ph.screen('Rengga', 0x2f6f73);
    await ph.bubble(S5.openers[o], 'yulia');
    await wait(this, 900);
    for (const r of S5.openerReplies[o]) { await ph.bubble(r, 'rengga'); await wait(this, 600); }
    for (const m of S5.ask) { await wait(this, 700); await ph.bubble(m.text, m.from); }
    await wait(this, 600);
    await memoryFound(this, 's5_first_message');
    Save.checkpoint('S5Buku');
    await goTo(this, 'S5Buku');
  }
}

// ---------------------------------------------------------------- pinjam buku
export class S5Buku extends StageBase {
  constructor() { super('S5Buku'); }

  create() {
    this.setupStage({ bg: 'bg_s5_toko_bunga_teduh', ground: GROUND.bunga, player: 'yulia', minX: 120, maxX: 1560 });
    this.player = this.addChar('yulia', 300);
    this.rengga = this.addChar('rengga', 1250);
    Save.checkpoint('S5Buku');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 900);
    await this.dlg.play(S5.bookIntro, { id: 's5_bookIntro' });
    this.addInteract({ x: this.rengga.x, r: 240, label: 'Sapa Rengga', onUse: () => this.meet() });
    this.unlock();
  }

  async meet() {
    const y = this.player, r = this.rengga;
    await walkTo(this, y, r.x - 170);
    await this.dlg.play(S5.book, { id: 's5_book' });
    const b = this.add.image(r.x - 20, r.y - 100, 's5_buku_pulang').setScale(0.7).setDepth(300);
    await tweenP(this, { targets: b, x: y.x + 20, y: y.y - 95, duration: 700, ease: 'Sine.InOut' });
    await tweenP(this, { targets: b, alpha: 0, duration: 300 });
    b.destroy();
    await memoryFound(this, 's5_buku_pulang');
    await this.dlg.play(S5.closer, { id: 's5_closer' });
    await this.dlg.play(S5.warm, { id: 's5_warm' });
    await memoryFound(this, 's5_second_chance');
    const dark = this.add.rectangle(0, 0, W, H, 0x000000, 0).setOrigin(0).setDepth(800);
    await tweenP(this, { targets: dark, fillAlpha: 0.45, duration: 1200 });
    Save.completeStage(5);
    stageSummary(this, 5);
  }
}
