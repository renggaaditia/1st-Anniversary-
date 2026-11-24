// Stage 8 — One Year (Yulia).
// Ruang anniversary > dinding foto (galeri foto asli) > Memory Album (scrapbook + surat Yulia)
// > "Let's continue our journey..." > "Yes, always." > teks ending GDD > langit malam + judul akhir.
import { W, H, FONT, COLOR } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S8 } from '../data/stage8.js';
import { fadeIn, goTo, titleCard, caption, wait, tweenP, menuList, pressAny, face, toast } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { nightSky } from '../ui/sky.js';
import { Music } from '../music.js';

const FLOOR = 880;
const ALBUM_X = 1290, ALBUM_Y = 556;

function sparkle(scene, x, y) {
  const sp = scene.add.text(x, y, '✦', { fontFamily: FONT, fontSize: '34px', color: '#fff4d0', stroke: '#2b1d2a', strokeThickness: 4 }).setOrigin(0.5).setDepth(1300);
  scene.tweens.add({ targets: sp, alpha: 0.15, yoyo: true, repeat: -1, duration: 500 });
  return sp;
}

export class S8Room extends StageBase {
  constructor() { super('S8Room'); }

  // lagu Stage 8 dimuat saat stage dibuka (tidak memperlambat awal game)
  preload() {
    if (!this.cache.audio.exists('bgm_s8')) this.load.audio('bgm_s8', 'assets/music/stage8.mp3');
  }

  create() {
    Music.play(this, 'bgm_s8');
    this.setupStage({ bg: 'bg_s8_room', ground: FLOOR, player: 'yulia', minX: 140, maxX: 1540 });
    this.photoWall();
    // album di meja
    const g = this.add.graphics().setDepth(40);
    g.fillStyle(0x2b1d2a).fillRect(ALBUM_X - 46, ALBUM_Y - 16, 92, 22);
    g.fillStyle(0x6e3a32).fillRect(ALBUM_X - 42, ALBUM_Y - 13, 84, 16);
    g.fillStyle(0xfbf3e0).fillRect(ALBUM_X - 40, ALBUM_Y + 2, 80, 3);
    g.fillStyle(0xf2c14e).fillRect(ALBUM_X - 10, ALBUM_Y - 10, 20, 10);
    this.player = this.addChar('yulia', 220);
    this.photosSeen = Save.has('s8_foto_kita');
    Save.checkpoint('S8Room');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  // 12 polaroid foto asli di dua tali
  photoWall() {
    const meta = this.cache.json.get('photos_meta');
    const rows = [288, 420];
    let k = 0;
    rows.forEach((ry, r) => {
      for (let i = 0; i < 6; i++, k++) {
        const m = meta[k % meta.length];
        const x = 600 + i * 92 + (r ? 20 : 0);
        const y = ry + 6 + Math.round(10 * Math.sin(((x - 552) / 570) * Math.PI) * 0.2);
        const c = this.add.container(x, y).setDepth(30).setAngle([-6, 4, -3, 5, -5, 3][(i + r) % 6]);
        const fr = this.add.graphics();
        fr.fillStyle(0x2b1d2a).fillRect(-41, 0, 82, 96);
        fr.fillStyle(0xfbf3e0).fillRect(-38, 3, 76, 90);
        const im = this.add.image(0, 38, m.thumb).setScale(0.58);
        const pin = this.add.rectangle(0, 0, 10, 16, [0xc84a6a, 0xf2c14e, 0x7ac0e8][(i + r) % 3]).setStrokeStyle(3, 0x2b1d2a);
        c.add([fr, im, pin]);
        this.tweens.add({ targets: c, angle: c.angle + 1.5, yoyo: true, repeat: -1, duration: 1800 + i * 170, ease: 'Sine.InOut' });
      }
    });
  }

  async run() {
    await fadeIn(this, 1200);
    await titleCard(this, 'STAGE 8', 'One Year');
    await this.dlg.play(S8.intro, { id: 's8_intro' });
    this.wallSp = sparkle(this, 860, 250);
    this.addInteract({ x: 860, r: 260, label: 'Lihat foto', once: false, onUse: () => this.viewPhotos() });
    this.albumSp = sparkle(this, ALBUM_X, ALBUM_Y - 60);
    this.addInteract({ x: ALBUM_X, r: 170, label: 'Buka Memory Album', onUse: () => this.openAlbum() });
    this.unlock();
  }

  async viewPhotos() {
    face(this.player, 'right');
    if (!this.photosSeen) await this.dlg.play(S8.photos);
    const closed = new Promise((r) => this.events.once('galleryClosed', r));
    this.scene.launch('Gallery', { caller: 'S8Room' });
    this.scene.pause();
    await closed;
    if (!this.photosSeen) {
      this.photosSeen = true;
      if (this.wallSp) { this.wallSp.destroy(); this.wallSp = null; }
      await this.dlg.play(S8.photosAfter);
      await memoryFound(this, 's8_foto_kita');
    }
    this.unlock();
  }

  async openAlbum() {
    this.albumSp.destroy();
    this.player.play('yulia_interact');
    await wait(this, 500);
    await this.dlg.play(S8.album, { id: 's8_album' });
    const done = new Promise((r) => this.events.once('albumDone', r));
    this.scene.launch('Album', { caller: 'S8Room', story: true, page: 1 });
    this.scene.pause();
    await done;
    await memoryFound(this, 's8_one_year');
    await this.question();
  }

  async question() {
    const dark = this.add.rectangle(0, 0, W, H, 0x1a0f1e, 0).setOrigin(0).setDepth(2000);
    await tweenP(this, { targets: dark, fillAlpha: 0.93, duration: 900 });
    const q = this.add.text(W / 2, H / 2 - 110, '', { fontFamily: FONT, fontSize: '54px', color: '#ffd6e2', fontStyle: 'italic', stroke: '#2b1d2a', strokeThickness: 6 }).setOrigin(0.5).setDepth(2001);
    for (let i = 1; i <= S8.question.length; i++) {
      q.setText(S8.question.slice(0, i));
      if (i % 2 === 0) Sfx.blip();
      await wait(this, 60);
    }
    await wait(this, 500);
    await new Promise((resolve) => {
      const m = menuList(this, [{ label: S8.yes, onSelect: () => { m.destroy(); resolve(); } }], { y: H / 2 + 60, width: 480, size: 40, depth: 2002 });
    });
    Sfx.chime();
    await tweenP(this, { targets: q, alpha: 0, duration: 600 });
    await this.endingText();
    Save.checkpoint('S8End');
    await goTo(this, 'S8End');
  }

  // Final Ending Text (GDD), baris demi baris
  async endingText() {
    const lines = S8.ending;
    const gap = 70, y0 = H / 2 - ((lines.length - 1) * gap) / 2 - 20;
    const objs = [];
    for (let i = 0; i < lines.length; i++) {
      const last = i === lines.length - 1;
      const t = this.add.text(W / 2, y0 + i * gap + (i >= 4 ? 24 : 0), lines[i], {
        fontFamily: FONT, fontSize: last ? '50px' : '36px', color: last ? '#ff9ab4' : '#fff4d0',
        fontStyle: i >= 4 ? '700' : '400', align: 'center', wordWrap: { width: 1440 }, stroke: '#2b1d2a', strokeThickness: 5,
      }).setOrigin(0.5).setDepth(2003).setAlpha(0);
      objs.push(t);
      await tweenP(this, { targets: t, alpha: 1, y: t.y - 8, duration: 900 });
      await wait(this, i >= 4 ? 900 : 1400);
    }
    const hint = this.add.text(W / 2, H - 50, '▼', { fontFamily: FONT, fontSize: '32px', color: '#f2c14e' }).setOrigin(0.5).setDepth(2003);
    await pressAny(this);
    await tweenP(this, { targets: [...objs, hint], alpha: 0, duration: 900 });
  }
}

// ---------------------------------------------------------------- akhir: langit malam
export class S8End extends Phaser.Scene {
  constructor() { super('S8End'); }

  create() {
    if (this.cache.audio.exists('bgm_s8')) Music.play(this, 'bgm_s8');
    nightSky(this, { seed: 12 });
    // bukit rumput
    const g = this.add.graphics().setDepth(5);
    for (let x = 0; x < W; x += 8) {
      const h = 120 + Math.round(26 * Math.sin(x / 260) + 10 * Math.sin(x / 70)) / 8 * 8;
      g.fillStyle(0x16243a).fillRect(x, H - h, 8, h);
      g.fillStyle(0x223452).fillRect(x, H - h, 8, 8);
    }
    const gy = H - 112;
    this.y = this.add.sprite(W / 2 - 46, gy, 'yulia', 0).setOrigin(0.5, 1).setDepth(10); this.y.charName = 'yulia';
    this.r = this.add.sprite(W / 2 + 46, gy, 'rengga', 0).setOrigin(0.5, 1).setDepth(10); this.r.charName = 'rengga';
    this.y.play('yulia_happy'); this.r.play('rengga_happy');
    face(this.y, 'right'); face(this.r, 'left');
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1600);
    // bintang jatuh
    const star = this.add.rectangle(300, 120, 60, 4, 0xfff4d0).setAngle(20).setDepth(3);
    this.tweens.add({ targets: star, x: 900, y: 340, alpha: 0, duration: 1400 });
    await wait(this, 1200);
    for (let i = 0; i < 10; i++) {
      const h = this.add.image(W / 2 + Phaser.Math.Between(-60, 60), H - 330, 'emotes', 3).setDepth(20).setScale(1.4);
      this.tweens.add({ targets: h, y: h.y - 160, alpha: 0, duration: 1900, delay: i * 240, onComplete: () => h.destroy() });
    }
    const mk = (y, s, size, color, stroke) => this.add.text(W / 2, y, s, {
      fontFamily: FONT, fontSize: `${size}px`, color, fontStyle: '700', stroke, strokeThickness: size / 6, align: 'center',
    }).setOrigin(0.5).setDepth(30).setAlpha(0);
    const t1 = mk(190, S8.title1, 74, '#fff4d0', '#c84a6a');
    const t2 = mk(280, S8.title2, 40, '#f2c14e', '#2b1d2a');
    const t3 = mk(350, S8.title3, 34, '#c9d6ff', '#2b1d2a');
    Sfx.chime();
    await tweenP(this, { targets: t1, alpha: 1, scale: { from: 0.8, to: 1 }, duration: 1200, ease: 'Back.Out' });
    await wait(this, 900);
    await tweenP(this, { targets: t2, alpha: 1, duration: 900 });
    await wait(this, 900);
    await tweenP(this, { targets: t3, alpha: 1, duration: 900 });
    Save.completeStage(8);
    await wait(this, 2200);
    this.endMenu();
  }

  endMenu() {
    const items = [
      { label: 'Memory Album', onSelect: () => { this.scene.launch('Album', { caller: 'S8End', page: 8 }); this.scene.pause(); } },
      { label: 'Chapter 2 — Our Future', onSelect: () => toast(this, 'Chapter 2 segera hadir') },
      { label: 'Pilih Stage', onSelect: () => goTo(this, 'StageSelect') },
      { label: 'Menu Utama', onSelect: () => goTo(this, 'Title') },
    ];
    const bg = this.add.rectangle(W - 330, 578, 600, 340, 0x0d1030, 0.55).setDepth(39).setAlpha(0);
    this.tweens.add({ targets: bg, alpha: 1, duration: 600 });
    menuList(this, items, { x: W - 330, y: 470, gap: 72, width: 520, size: 32, depth: 40 });
  }
}
