import { Music } from '../music.js';
import { W, H, FONT, COLOR, STAGES } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { fadeIn, goTo, toast } from '../ui/helpers.js';

export class StageSelect extends Phaser.Scene {
  constructor() { super('StageSelect'); }

  create() {
    Music.stop(this);
    this.add.image(0, 0, 'bg_pantai').setOrigin(0);
    this.add.rectangle(0, 0, W, H, 0x0d1030, 0.55).setOrigin(0);
    this.add.text(W / 2, 90, 'Pilih Stage', { fontFamily: FONT, fontSize: '72px', color: '#fff4d0', fontStyle: '700', stroke: '#2b1d2a', strokeThickness: 10 }).setOrigin(0.5);
    this.add.text(W / 2, 160, 'Chapter 1 — His Side  ·  Chapter 2 — Her Side', { fontFamily: FONT, fontSize: '30px', color: '#f2c14e' }).setOrigin(0.5);

    this.idx = 0;
    this.cards = STAGES.map((st, i) => {
      const col = i % 4, row = Math.floor(i / 4);
      const x = 260 + col * 384, y = 340 + row * 300;
      const unlocked = Save.data.unlocked.includes(st.n);
      const done = Save.data.completed.includes(st.n);
      const card = this.add.rectangle(x, y, 340, 250, unlocked ? COLOR.paper : 0x5a5266).setStrokeStyle(6, COLOR.ink).setInteractive({ useHandCursor: true });
      const chapter = st.n <= 3 ? 0x2f6f73 : 0xc84a6a;
      this.add.rectangle(x, y - 105, 340, 40, chapter).setStrokeStyle(6, COLOR.ink);
      this.add.text(x, y - 105, `STAGE ${st.n}`, { fontFamily: FONT, fontSize: '28px', color: '#fbf3e0', fontStyle: '700' }).setOrigin(0.5);
      this.add.text(x, y + 10, unlocked ? st.title : '???', {
        fontFamily: FONT, fontSize: '32px', color: unlocked ? COLOR.inkCss : '#cfc6d8', align: 'center', wordWrap: { width: 300 },
      }).setOrigin(0.5);
      if (!unlocked) this.drawLock(x, y + 80);
      else if (done) this.add.text(x, y + 88, '✓ Selesai', { fontFamily: FONT, fontSize: '28px', color: '#2f6f73', fontStyle: '700' }).setOrigin(0.5);
      else if (!st.scene) this.add.text(x, y + 88, 'Segera hadir', { fontFamily: FONT, fontSize: '26px', color: '#9a8f88' }).setOrigin(0.5);
      card.on('pointerover', () => { this.idx = i; this.refresh(); });
      card.on('pointerdown', () => { this.idx = i; this.refresh(); this.choose(); });
      return { card, st, unlocked };
    });

    const back = this.add.text(70, 70, '◀ Kembali', { fontFamily: FONT, fontSize: '34px', color: '#fbf3e0', backgroundColor: '#2b1d2acc', padding: { x: 14, y: 8 } })
      .setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => goTo(this, 'Title'));

    this.input.keyboard.on('keydown', (ev) => {
      const c = ev.code;
      if (c === 'ArrowRight' || c === 'KeyD') this.move(1);
      else if (c === 'ArrowLeft' || c === 'KeyA') this.move(-1);
      else if (c === 'ArrowDown' || c === 'KeyS') this.move(4);
      else if (c === 'ArrowUp' || c === 'KeyW') this.move(-4);
      else if (c === 'Enter' || c === 'Space' || c === 'KeyE') this.choose();
      else if (c === 'Escape') goTo(this, 'Title');
    });
    this.refresh();
    fadeIn(this, 400);
  }

  drawLock(x, y) {
    const g = this.add.graphics();
    g.lineStyle(8, 0xcfc6d8).strokeRect(x - 16, y - 34, 32, 30);
    g.fillStyle(0xcfc6d8).fillRect(x - 26, y - 10, 52, 40);
    g.fillStyle(0x5a5266).fillRect(x - 4, y + 2, 8, 14);
  }

  move(d) {
    this.idx = Phaser.Math.Clamp(this.idx + d, 0, this.cards.length - 1);
    Sfx.move();
    this.refresh();
  }

  refresh() {
    this.cards.forEach((c, i) => c.card.setStrokeStyle(i === this.idx ? 10 : 6, i === this.idx ? COLOR.gold : COLOR.ink));
  }

  choose() {
    const { st, unlocked } = this.cards[this.idx];
    if (!unlocked) { Sfx.miss(); toast(this, 'Stage ini masih terkunci'); return; }
    if (!st.scene) { Sfx.miss(); toast(this, `Stage ${st.n} segera hadir`); return; }
    Sfx.select();
    goTo(this, st.scene);
  }
}
