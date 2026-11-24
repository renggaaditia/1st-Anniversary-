// Utilitas bersama: tunggu, fade, kartu judul, tombol, jalan otomatis.
import { W, H, FONT, COLOR, NATIVE_FACING } from '../config.js';
import { Sfx } from '../audio.js';


export const wait = (scene, ms) => new Promise((r) => scene.time.delayedCall(ms, r));

export const tweenP = (scene, cfg) => new Promise((r) => scene.tweens.add({ ...cfg, onComplete: r }));

export function fadeIn(scene, ms = 600) {
  return new Promise((r) => {
    scene.cameras.main.fadeIn(ms, 0, 0, 0);
    scene.cameras.main.once('camerafadeincomplete', r);
  });
}

export function fadeOut(scene, ms = 600) {
  return new Promise((r) => {
    scene.cameras.main.fadeOut(ms, 0, 0, 0);
    scene.cameras.main.once('camerafadeoutcomplete', r);
  });
}

export async function goTo(scene, key, data = {}) {
  await fadeOut(scene, 500);
  scene.scene.start(key, data);
}

// Kartu judul besar di tengah layar (mis. "STAGE 1").
export async function titleCard(scene, big, small = '', hold = 1800) {
  const c = scene.add.container(0, 0).setDepth(3000).setAlpha(0);
  const bg = scene.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.72);
  const t1 = scene.add.text(W / 2, H / 2 - 30, big, { fontFamily: FONT, fontSize: '72px', color: '#fff4d0', fontStyle: '700', align: 'center' }).setOrigin(0.5);
  const t2 = scene.add.text(W / 2, H / 2 + 50, small, { fontFamily: FONT, fontSize: '34px', color: '#f2c14e', align: 'center' }).setOrigin(0.5);
  c.add([bg, t1, t2]);
  await tweenP(scene, { targets: c, alpha: 1, duration: 500 });
  await wait(scene, hold);
  await tweenP(scene, { targets: c, alpha: 0, duration: 500 });
  c.destroy();
}

// Teks narasi melayang tanpa kotak (untuk transisi).
export async function caption(scene, text, hold = 2200, y = H / 2) {
  const t = scene.add.text(W / 2, y, text, {
    fontFamily: FONT, fontSize: '40px', color: '#fff4d0', align: 'center',
    stroke: '#0d1030', strokeThickness: 8, wordWrap: { width: 1300 },
  }).setOrigin(0.5).setDepth(3000).setAlpha(0);
  await tweenP(scene, { targets: t, alpha: 1, duration: 600 });
  await wait(scene, hold);
  await tweenP(scene, { targets: t, alpha: 0, duration: 600 });
  t.destroy();
}

// Panel kotak pixel: kertas krem + bingkai gelap.
export function panel(scene, x, y, w, h, fill = COLOR.paper, border = COLOR.ink) {
  const g = scene.add.graphics();
  g.fillStyle(border, 1).fillRect(x - 6, y - 6, w + 12, h + 12);
  g.fillStyle(fill, 1).fillRect(x, y, w, h);
  g.fillStyle(0x000000, 0.08).fillRect(x, y + h - 8, w, 8);
  g.fillStyle(0xffffff, 0.35).fillRect(x, y, w, 6);
  return g;
}

// Tombol menu yang bisa diklik/disentuh dan dipilih dengan keyboard.
export function menuList(scene, items, { x = W / 2, y = 420, gap = 84, size = 44, width = 560, depth = 0 } = {}) {
  let idx = 0;
  const objs = items.map((it, i) => {
    const cy = y + i * gap;
    const box = scene.add.rectangle(x, cy, width, 66, COLOR.paper, 1).setStrokeStyle(6, COLOR.ink);
    const label = scene.add.text(x, cy, it.label, { fontFamily: FONT, fontSize: `${size}px`, color: it.disabled ? '#9a8f88' : COLOR.inkCss }).setOrigin(0.5);
    box.setDepth(depth); label.setDepth(depth + 1);
    box.setInteractive({ useHandCursor: true });
    box.on('pointerover', () => { idx = i; refresh(); });
    box.on('pointerdown', () => { idx = i; refresh(); fire(); });
    return { box, label, it };
  });
  function refresh() {
    objs.forEach((o, i) => {
      const on = i === idx;
      o.box.setFillStyle(on ? 0xf2c14e : COLOR.paper, 1);
      o.box.setScale(on ? 1.04 : 1);
      o.label.setScale(on ? 1.04 : 1);
    });
  }
  function fire() {
    const it = objs[idx].it;
    Sfx.select();
    it.onSelect && it.onSelect();
  }
  const kb = scene.input.keyboard;
  const onKey = (ev) => {
    if (!scene.scene.isActive()) return;
    const k = ev.key;
    if (k === 'ArrowDown' || k === 's' || k === 'S') { idx = (idx + 1) % objs.length; Sfx.move(); refresh(); }
    else if (k === 'ArrowUp' || k === 'w' || k === 'W') { idx = (idx - 1 + objs.length) % objs.length; Sfx.move(); refresh(); }
    else if (k === 'Enter' || k === ' ' || k === 'e' || k === 'E') { fire(); }
  };
  kb.on('keydown', onKey);
  scene.events.once('shutdown', () => kb.off('keydown', onKey));
  refresh();
  return {
    destroy() { kb.off('keydown', onKey); objs.forEach((o) => { o.box.destroy(); o.label.destroy(); }); },
    objs,
  };
}

// Jalan otomatis ke x tertentu (cutscene).
// Hadapkan karakter ke 'left' / 'right' (mirror bila beda dari arah asli sprite).
export function face(sprite, dir) {
  const native = NATIVE_FACING[sprite.charName] || 'right';
  sprite.setFlipX(dir !== native);
}

export function faceToward(sprite, x) {
  if (Math.abs(x - sprite.x) > 4) face(sprite, x > sprite.x ? 'right' : 'left');
}

// Jalan sesuai arah gerak. Arah terakhir dipertahankan.
export function walkTo(scene, sprite, x, speed = 260) {
  const name = sprite.charName || sprite.texture.key;
  const dist = Math.abs(sprite.x - x);
  const end = () => sprite.play(`${name}_idle`, true);
  if (dist < 2) { end(); return Promise.resolve(); }
  face(sprite, x > sprite.x ? 'right' : 'left');
  sprite.play(`${name}_walk`, true);
  return new Promise((r) => scene.tweens.add({
    targets: sprite, x, duration: (dist / speed) * 1000,
    onComplete: () => { end(); r(); },
  }));
}

// Toast kecil di atas layar.
export function toast(scene, text) {
  const t = scene.add.text(W / 2, 60, text, {
    fontFamily: FONT, fontSize: '32px', color: '#fff4d0', backgroundColor: '#2b1d2acc', padding: { x: 18, y: 10 },
  }).setOrigin(0.5).setDepth(5000).setScrollFactor(0);
  scene.tweens.add({ targets: t, alpha: 0, delay: 1600, duration: 500, onComplete: () => t.destroy() });
}

// Tekan tombol aksi sekali (keyboard / sentuh).
export function pressAny(scene) {
  return new Promise((resolve) => {
    const kb = scene.input.keyboard;
    const done = () => { kb.off('keydown', onKey); scene.input.off('pointerdown', done); resolve(); };
    const onKey = (ev) => { if (['Space', 'Enter', 'KeyE'].includes(ev.code)) done(); };
    scene.time.delayedCall(80, () => { kb.on('keydown', onKey); scene.input.on('pointerdown', done); });
  });
}

// Isi hati besar di tengah layar, diketik pelan.
export async function heartText(scene, str, label = 'Hati Rengga') {
  const dark = scene.add.rectangle(0, 0, W, H, 0x120a1a, 0).setOrigin(0).setDepth(2000);
  await tweenP(scene, { targets: dark, fillAlpha: 0.6, duration: 900 });
  const t = scene.add.text(W / 2, H / 2 - 40, '', {
    fontFamily: FONT, fontSize: '42px', color: '#ffd6e2', align: 'center', lineSpacing: 14, wordWrap: { width: 1200 },
    stroke: '#2b1d2a', strokeThickness: 6,
  }).setOrigin(0.5).setDepth(2001);
  const lb = scene.add.text(W / 2, H / 2 - 170, label, { fontFamily: FONT, fontSize: '30px', color: '#c84a6a', fontStyle: '700' }).setOrigin(0.5).setDepth(2001);
  for (let i = 1; i <= str.length; i++) {
    t.setText(str.slice(0, i));
    if (i % 2 === 0 && str[i - 1] !== ' ') Sfx.blip();
    await wait(scene, 55);
  }
  const hint = scene.add.text(W / 2, H - 60, '▼', { fontFamily: FONT, fontSize: '32px', color: '#f2c14e' }).setOrigin(0.5).setDepth(2001);
  await pressAny(scene);
  await tweenP(scene, { targets: [t, lb, hint, dark], alpha: 0, duration: 700 });
  [t, lb, hint, dark].forEach((o) => o.destroy());
}

// Hujan pixel: lapisan gelap, garis hujan miring, percikan di tanah, kilat samar.
export function makeRain(scene, groundY, { dark = 0.35, lightning = true } = {}) {
  scene.add.rectangle(0, 0, W, H, 0x0a1030, dark).setOrigin(0).setDepth(1);
  if (!scene.textures.exists('raindrop')) {
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xb8d4ff, 0.75).fillRect(0, 0, 3, 24);
    g.generateTexture('raindrop', 3, 24); g.destroy();
    const s = scene.make.graphics({ add: false });
    s.fillStyle(0xc9dcff, 0.9).fillRect(0, 3, 3, 3).fillRect(9, 3, 3, 3).fillRect(3, 0, 6, 3);
    s.generateTexture('splash', 12, 6); s.destroy();
  }
  scene.add.particles(0, -30, 'raindrop', {
    x: { min: -200, max: W + 100 }, quantity: 6, frequency: 16,
    speedY: { min: 1500, max: 1900 }, speedX: { min: 180, max: 240 }, rotate: -7,
    lifespan: 700, alpha: { start: 0.9, end: 0.5 },
  }).setDepth(400);
  scene.add.particles(0, 0, 'splash', {
    x: { min: 0, max: W }, y: { min: groundY - 40, max: H - 10 }, quantity: 3, frequency: 40,
    lifespan: 220, scale: { start: 0.6, end: 1.4 }, alpha: { start: 0.9, end: 0 },
  }).setDepth(401);
  if (lightning) {
    scene.time.addEvent({
      delay: 5200, loop: true, callback: () => {
        const f = scene.add.rectangle(0, 0, W, H, 0xdde8ff, 0.25).setOrigin(0).setDepth(402);
        scene.tweens.add({ targets: f, alpha: 0, duration: 260, onComplete: () => f.destroy() });
      },
    });
  }
}
