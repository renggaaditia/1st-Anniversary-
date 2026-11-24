// Langit malam pixel prosedural (dipakai scene puisi & ending).
import { W, H } from '../config.js';

const PX = 8; // ukuran blok pixel, mendekati kepadatan background

export function nightSky(scene, { seaY = null, seed = 7 } = {}) {
  const rnd = new Phaser.Math.RandomDataGenerator([String(seed)]);
  const g = scene.add.graphics().setDepth(0);
  const bands = [0x070a22, 0x0b1030, 0x10173e, 0x16204c, 0x1d2a5a, 0x253468];
  const skyH = seaY ?? H;
  // gradien bertingkat + dither di batas
  for (let y = 0; y < skyH; y += PX) {
    const t = y / skyH * (bands.length - 1);
    const i = Math.floor(t), f = t - i;
    for (let x = 0; x < W; x += PX) {
      const pick = (((x / PX) + (y / PX) * 2) % 4) / 4 < f ? bands[Math.min(i + 1, bands.length - 1)] : bands[i];
      g.fillStyle(pick).fillRect(x, y, PX, PX);
    }
  }
  // bintang
  const twinkles = [];
  for (let i = 0; i < 170; i++) {
    const x = rnd.between(0, W / PX) * PX, y = rnd.between(0, (skyH - 60) / PX) * PX;
    const big = rnd.frac() < 0.12;
    const c = rnd.pick([0xffffff, 0xfff3c4, 0xc9d6ff]);
    if (big) {
      const s = scene.add.graphics().setDepth(1);
      s.fillStyle(c).fillRect(x, y, PX, PX).fillRect(x - PX, y, PX, PX).fillRect(x + PX, y, PX, PX).fillRect(x, y - PX, PX, PX).fillRect(x, y + PX, PX, PX);
      twinkles.push(s);
    } else {
      g.fillStyle(c, rnd.realInRange(0.5, 1)).fillRect(x, y, PX / 2, PX / 2);
    }
  }
  twinkles.forEach((s, i) => scene.tweens.add({ targets: s, alpha: 0.25, yoyo: true, repeat: -1, duration: 700 + (i % 5) * 260, delay: i * 90 }));
  // bulan
  const mx = 1380, my = 160, r = 9;
  for (let yy = -r; yy <= r; yy++) for (let xx = -r; xx <= r; xx++) {
    if (xx * xx + yy * yy <= r * r) g.fillStyle((xx + yy) > 6 ? 0xe8dcb0 : 0xfff4d0).fillRect(mx + xx * PX, my + yy * PX, PX, PX);
  }
  g.fillStyle(0xd8cca0).fillRect(mx - 3 * PX, my - 2 * PX, 2 * PX, 2 * PX).fillRect(mx + 2 * PX, my + 3 * PX, PX * 2, PX);

  if (seaY != null) {
    const sea = [0x1a2550, 0x141c44, 0x0e1436, 0x0a1030];
    for (let y = seaY; y < H; y += PX) {
      const i = Math.min(sea.length - 1, Math.floor((y - seaY) / (H - seaY) * sea.length));
      g.fillStyle(sea[i]).fillRect(0, y, W, PX);
    }
    // pantulan bulan
    for (let k = 0, y = seaY + PX; y < H; y += PX * 2, k++) {
      const w = 3 + k;
      g.fillStyle(k % 2 ? 0x8a8fc0 : 0xd8d6b8).fillRect(mx - w * PX / 2 + (k % 3) * PX, y, w * PX, PX);
    }
    // kilau ombak
    for (let i = 0; i < 160; i++) {
      const y = rnd.between(seaY / PX + 1, H / PX) * PX, x = rnd.between(0, W / PX) * PX;
      g.fillStyle(0x3e4f8a).fillRect(x, y, PX * rnd.between(2, 6), PX / 2);
    }
    // siluet pulau
    g.fillStyle(0x0c1230);
    const island = (cx, w, h) => {
      for (let x = -w; x <= w; x += PX) {
        const hh = Math.round((h * (1 - (x / w) ** 2)) / PX) * PX;
        g.fillRect(cx + x, seaY - hh, PX, hh);
      }
    };
    island(330, 260, 70); island(560, 140, 40); island(1520, 220, 60);
  }
  return g;
}

// Kapal pixel kecil untuk ending.
export function makeShipTexture(scene) {
  if (scene.textures.exists('ship')) return;
  const P = 6, g = scene.make.graphics({ x: 0, y: 0, add: false });
  const map = [
    '..........RR........',
    '..........RR........',
    '.......WWWWWWW......',
    '.......WYWYWYW......',
    '....WWWWWWWWWWWWW...',
    '....WYWYWYWYWYWYW...',
    'KKKKKKKKKKKKKKKKKKKK',
    '.KBBBBBBBBBBBBBBBBK.',
    '..KBBBBBBBBBBBBBBK..',
    '...KKKKKKKKKKKKKK...',
  ];
  const col = { R: 0xd8533f, W: 0xe8e0d0, Y: 0xf7d98a, K: 0x0a0c1c, B: 0x2a3a6a };
  map.forEach((row, y) => [...row].forEach((ch, x) => { if (col[ch]) g.fillStyle(col[ch]).fillRect(x * P, y * P, P, P); }));
  g.generateTexture('ship', map[0].length * P, map.length * P);
  g.destroy();
}
