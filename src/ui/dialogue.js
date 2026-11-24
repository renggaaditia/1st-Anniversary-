// Dialogue box: nama, potret, teks mengetik, lanjut, pilihan, skip untuk dialog yang sudah dibaca.
import { W, H, FONT, COLOR, TEXT_SPEED } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { faceToward } from './helpers.js';

const BOX = { x: 40, y: 34, w: W - 80, h: 196 };
const NAMES = { rengga: 'Rengga', yulia: 'Yulia', heart: 'Hati Rengga', heart_yulia: 'Hati Yulia', narrator: '' };
const PORTRAIT = { rengga: 'p_rengga', yulia: 'p_yulia' };
const isSitting = (spr) => !!(spr.anims && spr.anims.currentAnim && /_sit$/.test(spr.anims.currentAnim.key));

export class Dialogue {
  constructor(scene) {
    this.s = scene;
    this.actors = {};
    this.active = false;
    const c = (this.c = scene.add.container(0, 0).setDepth(2000).setVisible(false).setScrollFactor(0));

    this.box = scene.add.graphics();
    this.portraitBg = scene.add.rectangle(BOX.x + 30 + 75, BOX.y + BOX.h / 2, 150, 176, COLOR.paperDark).setStrokeStyle(4, COLOR.ink);
    this.portrait = scene.add.image(BOX.x + 30 + 75, BOX.y + BOX.h / 2 + 4, 'p_rengga').setOrigin(0.5);
    this.nameBg = scene.add.rectangle(0, BOX.y + BOX.h + 6, 10, 50, COLOR.teal).setOrigin(0, 0).setStrokeStyle(6, COLOR.ink);
    this.name = scene.add.text(0, BOX.y + BOX.h + 31, '', { fontFamily: FONT, fontSize: '34px', color: '#fbf3e0', fontStyle: '700' }).setOrigin(0, 0.5);
    this.text = scene.add.text(0, BOX.y + 28, '', {
      fontFamily: FONT, fontSize: '36px', color: COLOR.inkCss, lineSpacing: 10, wordWrap: { width: 1250 },
    });
    this.next = scene.add.text(BOX.x + BOX.w - 44, BOX.y + BOX.h - 36, '▼', { fontFamily: FONT, fontSize: '30px', color: COLOR.roseCss }).setOrigin(0.5);
    scene.tweens.add({ targets: this.next, y: '+=8', yoyo: true, repeat: -1, duration: 400 });
    this.skip = scene.add.text(BOX.x + BOX.w - 20, BOX.y + BOX.h + 34, '[X] Lewati', {
      fontFamily: FONT, fontSize: '26px', color: '#fff4d0', backgroundColor: '#2b1d2acc', padding: { x: 10, y: 4 },
    }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });
    this.skip.on('pointerdown', (p, lx, ly, ev) => { ev && ev.stopPropagation && ev.stopPropagation(); this._skipNow = true; this._advance && this._advance(); });
    this.choiceC = scene.add.container(0, 0);
    c.add([this.box, this.portraitBg, this.portrait, this.nameBg, this.name, this.text, this.next, this.skip, this.choiceC]);
  }

  drawBox(style) {
    const g = this.box;
    g.clear();
    const fill = style === 'heart' ? COLOR.heart : COLOR.paper;
    g.fillStyle(COLOR.ink, 1).fillRect(BOX.x - 6, BOX.y - 6, BOX.w + 12, BOX.h + 12);
    g.fillStyle(fill, 1).fillRect(BOX.x, BOX.y, BOX.w, BOX.h);
    g.fillStyle(COLOR.paperDark, 1).fillRect(BOX.x, BOX.y, BOX.w, 6);
    g.fillStyle(0x000000, 0.07).fillRect(BOX.x, BOX.y + BOX.h - 8, BOX.w, 8);
  }

  setLine(line) {
    const who = line.who || 'narrator';
    const isHeart = who.startsWith('heart');
    const hasPortrait = !!PORTRAIT[who];
    this.drawBox(isHeart ? 'heart' : 'paper');
    this.portraitBg.setVisible(hasPortrait);
    this.portrait.setVisible(hasPortrait);
    if (hasPortrait) {
      this.portrait.setTexture(PORTRAIT[who]);
      const s = Math.min(140 / this.portrait.width, 168 / this.portrait.height);
      this.portrait.setScale(s);
    }
    const left = hasPortrait ? BOX.x + 220 : BOX.x + 50;
    this.text.setX(left);
    this.text.setWordWrapWidth(BOX.x + BOX.w - left - 70);
    this.text.setColor(isHeart ? COLOR.heartCss : COLOR.inkCss);
    this.text.setFontStyle(isHeart ? 'italic' : '');
    const nm = NAMES[who] ?? who;
    this.name.setText(nm);
    this.nameBg.setVisible(!!nm);
    this.name.setVisible(!!nm);
    this.nameBg.setFillStyle(isHeart ? COLOR.rose : COLOR.teal);
    this.nameBg.setPosition(left - 12, BOX.y + BOX.h + 6);
    this.nameBg.setSize(this.name.width + 36, 50);
    this.name.setPosition(left + 6, BOX.y + BOX.h + 31);
    // animasi karakter mengikuti baris
    if (line.anim) {
      for (const [n, a] of Object.entries(line.anim)) {
        const spr = this.actors[n];
        if (!spr) continue;
        if (isSitting(spr)) continue;          // tetap duduk
        if (this.s.anims.exists(`${n}_${a}`)) spr.play(`${n}_${a}`, true);
      }
    }
  }

  // Menunggu tombol lanjut (keyboard / sentuh). Mengembalikan 'skip' bila tombol lewati.
  waitInput() {
    return new Promise((resolve) => {
      const kb = this.s.input.keyboard;
      const done = (v) => {
        kb.off('keydown', onKey);
        this.s.input.off('pointerdown', onPtr);
        this._advance = null;
        resolve(v);
      };
      const onKey = (ev) => {
        if (['Space', 'Enter', 'KeyE', 'NumpadEnter'].includes(ev.code)) done('next');
        else if (ev.code === 'KeyX' && this.skip.visible) { this._skipNow = true; done('skip'); }
      };
      const onPtr = (p, over) => {
        if (over && over.includes(this.skip)) return;
        done('next');
      };
      this._advance = () => done(this._skipNow ? 'skip' : 'next');
      // tunda satu frame agar tekanan yang memicu dialog tidak langsung melompati baris pertama
      this.s.time.delayedCall(60, () => { kb.on('keydown', onKey); this.s.input.on('pointerdown', onPtr); });
    });
  }

  typeText(str) {
    const speed = TEXT_SPEED[Save.data.settings.textSpeed] || 28;
    return new Promise((resolve) => {
      let i = 0;
      this.text.setText('');
      this.next.setVisible(false);
      const ev = this.s.time.addEvent({
        delay: speed, loop: true, callback: () => {
          i++;
          this.text.setText(str.slice(0, i));
          const ch = str[i - 1];
          if (ch && ch !== ' ' && i % 2 === 0) Sfx.blip();
          if (i >= str.length) finish();
        },
      });
      const finish = () => {
        ev.remove();
        this.text.setText(str);
        this.next.setVisible(true);
        this._typing = null;
        resolve();
      };
      this._typing = finish;
      // tekan saat mengetik = tampilkan semua
      this.waitInput().then((v) => { if (this._typing) { if (v === 'skip') this._skipNow = true; finish(); } });
    });
  }

  async showChoices(choices) {
    this.choiceC.removeAll(true);
    let idx = 0;
    const x = W / 2, y0 = BOX.y + BOX.h + 90;
    const items = choices.map((label, i) => {
      const y = y0 + i * 78;
      const r = this.s.add.rectangle(x, y, 900, 64, COLOR.paper).setOrigin(0.5, 0).setStrokeStyle(6, COLOR.ink).setInteractive({ useHandCursor: true });
      const t = this.s.add.text(x, y + 32, label, { fontFamily: FONT, fontSize: '32px', color: COLOR.inkCss }).setOrigin(0.5);
      this.choiceC.add([r, t]);
      return { r, t };
    });
    const refresh = () => items.forEach((o, i) => o.r.setFillStyle(i === idx ? 0xf2c14e : COLOR.paper));
    refresh();
    return new Promise((resolve) => {
      const kb = this.s.input.keyboard;
      const pick = (i) => {
        kb.off('keydown', onKey);
        Sfx.select();
        this.choiceC.removeAll(true);
        resolve(i);
      };
      const onKey = (ev) => {
        if (ev.code === 'ArrowDown' || ev.code === 'KeyS') { idx = (idx + 1) % items.length; Sfx.move(); refresh(); }
        else if (ev.code === 'ArrowUp' || ev.code === 'KeyW') { idx = (idx - 1 + items.length) % items.length; Sfx.move(); refresh(); }
        else if (['Space', 'Enter', 'KeyE'].includes(ev.code)) pick(idx);
      };
      items.forEach((o, i) => {
        o.r.on('pointerover', () => { idx = i; refresh(); });
        o.r.on('pointerdown', () => pick(i));
      });
      this.s.time.delayedCall(150, () => kb.on('keydown', onKey));
    });
  }

  // lines: [{ who, text, anim?, choices?: [..], choiceId?, replies?: [[lines],[lines]] }]
  async play(lines, { id = null } = {}) {
    this.active = true;
    this._skipNow = false;
    // saat bicara, karakter saling berhadapan
    const { rengga: r, yulia: y } = this.actors;
    if (r && y && r.active && y.active) { faceToward(r, y.x); faceToward(y, r.x); }
    this.c.setVisible(true);
    this.skip.setVisible(!!id && Save.seen(id));
    let lastChoice = null;
    const run = async (arr) => {
      for (const line of arr) {
        if (this._skipNow) {
          if (line.choices) lastChoice = Save.data.choices[line.choiceId] ?? 0;
          continue;
        }
        this.setLine(line);
        await this.typeText(line.text);
        if (this._skipNow) continue;
        if (line.choices) {
          this.next.setVisible(false);
          const i = await this.showChoices(line.choices);
          lastChoice = i;
          if (line.choiceId) Save.setChoice(line.choiceId, i);
          if (line.replies && line.replies[i]) await run(line.replies[i]);
        } else {
          const v = await this.waitInput();
          if (v === 'skip') this._skipNow = true;
          else Sfx.move();
        }
      }
    };
    await run(lines);
    Save.markSeen(id);
    this.c.setVisible(false);
    this.active = false;
    for (const [n, spr] of Object.entries(this.actors)) {
      if (!spr || !spr.active || !spr.anims || !spr.anims.currentAnim) continue;
      if (!isSitting(spr)) spr.play(`${n}_idle`, true);
    }
    return lastChoice;
  }
}
