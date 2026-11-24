// Memory Album: satu halaman per stage, kartu kenangan ala scrapbook.
import { W, H, FONT, COLOR, STAGES } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { COLLECTIBLES } from '../data/collectibles.js';
import { S8 } from '../data/stage8.js';

export class Album extends Phaser.Scene {
  constructor() { super('Album'); }

  // story: mode Stage 8 (halaman 1-7 + halaman surat, lalu selesai)
  init(data) { this.caller = data.caller; this.page = data.page || 1; this.story = !!data.story; }

  create() {
    this.scene.bringToTop();
    this.add.rectangle(0, 0, W, H, 0x000000, 0.7).setOrigin(0);
    // buku
    const g = this.add.graphics();
    g.fillStyle(0x6e3a32).fillRect(60, 50, W - 120, H - 100);
    g.fillStyle(0xf4ead2).fillRect(84, 74, W - 168, H - 148);
    g.fillStyle(0xe2d4b4).fillRect(W / 2 - 6, 74, 12, H - 148);
    this.add.text(W / 2, 40, 'MEMORY ALBUM', { fontFamily: FONT, fontSize: '44px', color: '#fff4d0', fontStyle: '700', backgroundColor: '#6e3a32', padding: { x: 20, y: 6 } }).setOrigin(0.5, 0);
    this.layer = this.add.container(0, 0);
    this.pageText = this.add.text(W / 2, H - 112, '', { fontFamily: FONT, fontSize: '28px', color: '#6e3a32' }).setOrigin(0.5);

    const mk = (x, label, fn) => {
      const t = this.add.text(x, H - 112, label, { fontFamily: FONT, fontSize: '40px', color: '#fbf3e0', backgroundColor: '#6e3a32', padding: { x: 16, y: 6 } })
        .setOrigin(0.5).setInteractive({ useHandCursor: true });
      t.on('pointerdown', fn);
      return t;
    };
    mk(200, '◀', () => this.flip(-1));
    mk(W - 200, '▶', () => this.flip(1));
    const close = this.add.text(W - 90, 96, '✕', { fontFamily: FONT, fontSize: '44px', color: '#fbf3e0', backgroundColor: '#c84a6a', padding: { x: 14, y: 2 } })
      .setOrigin(0.5).setInteractive({ useHandCursor: true });
    close.on('pointerdown', () => this.close());
    if (this.story) close.setVisible(false);
    this.nextBtn = this.children.list.find((o) => o.text === '▶');
    // tombol galeri foto (halaman 8, mode biasa)
    this.galBtn = this.add.text(W / 2, H - 170, 'Lihat Foto Kita', { fontFamily: FONT, fontSize: '30px', color: '#fbf3e0', backgroundColor: '#c84a6a', padding: { x: 16, y: 8 } })
      .setOrigin(0.5).setInteractive({ useHandCursor: true }).setVisible(false).setDepth(5);
    this.galBtn.on('pointerdown', () => { this.scene.launch('Gallery', { caller: 'Album' }); this.scene.pause(); });

    this.input.keyboard.on('keydown', (ev) => {
      if (ev.code === 'ArrowRight' || ev.code === 'KeyD') this.flip(1);
      else if (ev.code === 'ArrowLeft' || ev.code === 'KeyA') this.flip(-1);
      else if (ev.code === 'Escape' || ev.code === 'KeyX') this.close();
    });
    this.render();
  }

  flip(d) {
    if (this.story && d > 0 && this.page === 8) { this.finishStory(); return; }
    const n = Phaser.Math.Clamp(this.page + d, 1, 8);
    if (n === this.page) return;
    this.page = n;
    Sfx.move();
    // animasi halaman: geser + pudar
    this.tweens.add({
      targets: this.layer, alpha: 0, x: -d * 50, duration: 150,
      onComplete: () => { this.render(); this.layer.x = d * 50; this.tweens.add({ targets: this.layer, alpha: 1, x: 0, duration: 220, ease: 'Sine.Out' }); },
    });
  }

  finishStory() {
    Sfx.select();
    const c = this.scene.get(this.caller);
    this.scene.resume(this.caller);
    c.events.emit('albumDone');
    this.scene.stop();
  }

  renderLetter() {
    const L = this.layer;
    L.add(this.add.text(W / 2, 150, S8.letterTitle, { fontFamily: FONT, fontSize: '40px', color: '#6e3a32', fontStyle: '700' }).setOrigin(0.5));
    const letter = Save.data.letter || S8.letterEmpty;
    const g = this.add.graphics();
    g.fillStyle(0x2b1d2a).fillRect(W / 2 - 524, 196, 1048, 520);
    g.fillStyle(0xfffdf6).fillRect(W / 2 - 520, 200, 1040, 512);
    g.fillStyle(0xf0c8d0, 0.5);
    for (let y = 250; y < 700; y += 40) g.fillRect(W / 2 - 490, y, 980, 2);
    L.add(g);
    const size = letter.length > 700 ? 20 : letter.length > 380 ? 24 : 30;
    L.add(this.add.text(W / 2 - 490, 222, letter, { fontFamily: FONT, fontSize: `${size}px`, color: '#2b1d2a', wordWrap: { width: 980 }, lineSpacing: size * 0.5 }).setOrigin(0, 0));
    const ans = Save.data.stage7Answer;
    if (ans) L.add(this.add.text(W / 2, 748, `${S8.answerLabel}: "${ans}"`, { fontFamily: FONT, fontSize: '26px', color: COLOR.roseCss }).setOrigin(0.5));
  }

  render() {
    this.layer.removeAll(true);
    this.galBtn.setVisible(!this.story && this.page === 8 && Save.has('s8_foto_kita'));
    if (this.nextBtn) this.nextBtn.setText(this.story && this.page === 8 ? 'Selesai ▶' : '▶');
    if (this.story && this.page === 8) {
      this.pageText.setText('Halaman 8/8');
      this.renderLetter();
      return;
    }
    const st = STAGES[this.page - 1];
    const L = this.layer;
    L.add(this.add.text(W / 2, 150, `Stage ${st.n} — ${st.title}`, { fontFamily: FONT, fontSize: '40px', color: '#6e3a32', fontStyle: '700' }).setOrigin(0.5));
    const items = COLLECTIBLES.filter((c) => c.stage === st.n);
    const found = items.filter((c) => Save.has(c.id)).length;
    this.pageText.setText(items.length ? `Halaman ${st.n}/8  ·  ${found}/${items.length} kenangan` : `Halaman ${st.n}/8`);
    if (!items.length) {
      L.add(this.add.text(W / 2, H / 2, 'Kenangan stage ini belum dibuat.', { fontFamily: FONT, fontSize: '34px', color: '#9a8f88' }).setOrigin(0.5));
      return;
    }
    const n = items.length;
    // >4 kenangan: kartu kecil dua baris
    const compact = n > 4;
    const perRow = compact ? 4 : n;
    const cw = compact ? 300 : 330, ch = compact ? 290 : 528, gap = compact ? 34 : 30;
    items.forEach((it, i) => {
      const row = Math.floor(i / perRow), col = i % perRow;
      const inRow = Math.min(perRow, n - row * perRow);
      const x0 = W / 2 - ((inRow * cw + (inRow - 1) * gap) / 2) + cw / 2;
      const x = x0 + col * (cw + gap), y = compact ? 345 + row * 310 : 495;
      const has = Save.has(it.id);
      const tilt = [-2, 1.5, -1, 2][i % 4];
      const card = this.add.container(x, y).setAngle(compact ? tilt / 2 : tilt);
      const g = this.add.graphics();
      const hh = ch / 2;
      const ph = compact ? 120 : 250;           // tinggi area foto
      const py = -hh + 24 + ph / 2;             // pusat area foto
      g.fillStyle(0x2b1d2a).fillRect(-cw / 2 - 4, -hh - 4, cw + 8, ch + 8);
      g.fillStyle(has ? 0xfffdf6 : 0xe6dcc6).fillRect(-cw / 2, -hh, cw, ch);
      g.fillStyle(0xf2d89a, 0.9).fillRect(-50, -hh - 16, 100, 30); // selotip
      g.fillStyle(has ? 0xefe4cc : 0xd8cfc0).fillRect(-cw / 2 + 22, -hh + 24, cw - 44, ph);
      card.add(g);
      if (has) {
        let img;
        const snapKey = { s1_foto_pertama: 'photo_snap', s2_photobooth_strip: 'strip_snap' }[it.id];
        if (snapKey && this.textures.exists(snapKey)) {
          img = this.add.image(0, py, snapKey);
          const s = Math.min((cw - 60) / img.width, (ph - 16) / img.height);
          img.setScale(s);
        } else {
          img = this.add.image(0, py, it.icon || 's1_foto_pertama').setScale(compact ? 1.1 : 2);
        }
        card.add(img);
        const ty = py + ph / 2 + (compact ? 10 : 30);
        card.add(this.add.text(0, ty, it.name, { fontFamily: FONT, fontSize: compact ? '26px' : '32px', color: '#2b1d2a', fontStyle: '700', align: 'center', wordWrap: { width: cw - 30 } }).setOrigin(0.5, 0));
        const desc = it.id === 's6_surat_yulia' && Save.data.letter ? `"${Save.data.letter.slice(0, 70)}${Save.data.letter.length > 70 ? '…' : ''}"` : it.desc;
        card.add(this.add.text(0, ty + (compact ? 40 : 60), desc || '', { fontFamily: FONT, fontSize: compact ? '19px' : '24px', color: '#5a4a4a', align: 'center', wordWrap: { width: cw - 36 }, lineSpacing: compact ? 2 : 4 }).setOrigin(0.5, 0));
        if (it.date && !compact) card.add(this.add.text(0, 226, it.date, { fontFamily: FONT, fontSize: '24px', color: COLOR.roseCss }).setOrigin(0.5));
        this.tweens.add({ targets: img, scale: img.scale * 1.06, yoyo: true, repeat: -1, duration: 900 + i * 120, ease: 'Sine.InOut' });
      } else {
        card.add(this.add.text(0, py, '?', { fontFamily: FONT, fontSize: compact ? '80px' : '120px', color: '#b8ac98', fontStyle: '700' }).setOrigin(0.5));
        card.add(this.add.text(0, compact ? 80 : 90, 'Memory not found yet.', { fontFamily: FONT, fontSize: compact ? '22px' : '28px', color: '#8a7f74', align: 'center', wordWrap: { width: cw - 40 } }).setOrigin(0.5));
      }
      L.add(card);
    });
  }

  close() {
    if (this.story) return;
    Sfx.select();
    this.scene.resume(this.caller);
    this.scene.stop();
  }
}
