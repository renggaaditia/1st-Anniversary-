// Panel "STAGE n SELESAI" + kenangan yang ditemukan + menu lanjut.
import { W, H, FONT, COLOR, STAGES } from '../config.js';
import { Save } from '../save.js';
import { COLLECTIBLES } from '../data/collectibles.js';
import { goTo, menuList, panel, toast } from './helpers.js';

export function stageSummary(scene, n) {
  const items = COLLECTIBLES.filter((c) => c.stage === n);
  const got = items.filter((c) => Save.has(c.id));
  const c = scene.add.container(0, 0).setAlpha(0).setDepth(1000);
  c.add(scene.add.rectangle(0, 0, W, H, 0x000000, 0.45).setOrigin(0));
  c.add(panel(scene, W / 2 - 460, 110, 920, 720));
  c.add(scene.add.text(W / 2, 170, `STAGE ${n} SELESAI`, { fontFamily: FONT, fontSize: '60px', color: COLOR.roseCss, fontStyle: '700' }).setOrigin(0.5));
  c.add(scene.add.text(W / 2, 232, `Kenangan ditemukan: ${got.length}/${items.length}`, { fontFamily: FONT, fontSize: '32px', color: COLOR.inkCss }).setOrigin(0.5));
  // >4 kenangan: dua baris, ikon lebih kecil
  const compact = items.length > 4;
  const perRow = compact ? 4 : items.length;
  const step = 200;
  items.forEach((it, i) => {
    const row = Math.floor(i / perRow), col = i % perRow;
    const inRow = Math.min(perRow, items.length - row * perRow);
    const x = W / 2 - ((inRow - 1) * step) / 2 + col * step;
    const y = compact ? 296 + row * 150 : 330;
    const has = Save.has(it.id);
    c.add(scene.add.image(x, y, it.icon).setAlpha(has ? 1 : 0.2).setScale(compact ? 0.75 : 1));
    c.add(scene.add.text(x, y + (compact ? 44 : 66), has ? it.name : '???', { fontFamily: FONT, fontSize: compact ? '20px' : '22px', color: COLOR.inkCss, align: 'center', wordWrap: { width: 180 } }).setOrigin(0.5, 0));
  });
  scene.tweens.add({ targets: c, alpha: 1, duration: 600 });
  const next = STAGES[n];   // stage berikutnya (index n = stage n+1)
  const key = scene.scene.key;
  menuList(scene, [
    {
      label: next ? `Lanjut ke Stage ${next.n}` : 'Selesai',
      onSelect: () => (next && next.scene ? goTo(scene, next.scene) : toast(scene, next ? `Stage ${next.n} segera hadir` : 'Terima kasih sudah bermain')),
    },
    { label: 'Memory Album', onSelect: () => { scene.scene.launch('Album', { caller: key, page: n }); scene.scene.pause(); } },
    { label: 'Pilih Stage', onSelect: () => goTo(scene, 'StageSelect') },
    { label: 'Menu Utama', onSelect: () => goTo(scene, 'Title') },
  ], compact ? { y: 600, gap: 68, width: 520, size: 32, depth: 1100 } : { y: 500, gap: 82, width: 560, size: 38, depth: 1100 });
}
