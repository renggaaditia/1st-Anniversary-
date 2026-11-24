// Stage 6 — Back to Where It Began (Yulia).
// Pantai sunset > kerang > dekati Rengga > pelukan & maaf > kesempatan kedua > surat kosong
// > pemain menulis surat sendiri (disimpan untuk Stage 8) > hati Rengga > A SECOND CHANCE — UNLOCKED
import { W, H, FONT, COLOR, GROUND } from '../config.js';
import { Save } from '../save.js';
import { Sfx } from '../audio.js';
import { StageBase } from './StageBase.js';
import { S6 } from '../data/stage6.js';
import { fadeIn, titleCard, wait, walkTo, tweenP, faceToward, heartText, pressAny } from '../ui/helpers.js';
import { memoryFound } from '../ui/memory.js';
import { stageSummary } from '../ui/summary.js';

function sparkle(scene, x, y) {
  const sp = scene.add.text(x, y, '✦', { fontFamily: FONT, fontSize: '34px', color: '#fff4d0', stroke: '#2b1d2a', strokeThickness: 4 }).setOrigin(0.5).setDepth(91);
  scene.tweens.add({ targets: sp, alpha: 0.15, yoyo: true, repeat: -1, duration: 500 });
  return sp;
}

export class S6Pantai extends StageBase {
  constructor() { super('S6Pantai'); }

  create() {
    this.setupStage({ bg: 'bg_s6_pantai_sunset', ground: GROUND.pantai, player: 'yulia', minX: 120, maxX: 1520 });
    this.player = this.addChar('yulia', 300);
    this.rengga = this.addChar('rengga', 1300);
    this.shellDone = Save.has('s6_kerang');
    Save.checkpoint('S6Pantai');
    this.lock();
    this.run().catch((e) => console.error(e));
  }

  async run() {
    await fadeIn(this, 1000);
    await titleCard(this, 'STAGE 6', 'Back to Where It Began');
    await this.dlg.play(S6.intro, { id: 's6_intro' });
    if (!this.shellDone) {
      const sh = this.add.image(720, GROUND.pantai - 16, 's6_kerang').setScale(0.5).setDepth(90);
      const sp = sparkle(this, 750, GROUND.pantai - 70);
      this.addInteract({
        x: 720, r: 110, label: 'Ambil kerang', onUse: async () => {
          sh.destroy(); sp.destroy();
          await this.dlg.play(S6.shell);
          await memoryFound(this, 's6_kerang');
          this.unlock();
        },
      });
    }
    this.addInteract({ x: this.rengga.x, r: 240, label: 'Dekati Rengga', onUse: () => this.reunion() });
    this.unlock();
  }

  async reunion() {
    const y = this.player, r = this.rengga;
    await walkTo(this, y, r.x - 170, 220);
    await this.dlg.play(S6.approach, { id: 's6_approach' });
    await this.dlg.play(S6.apology, { id: 's6_apology' });
    // pelukan
    await walkTo(this, y, r.x - 62, 120);
    faceToward(y, r.x); faceToward(r, y.x);
    y.play('yulia_hug'); r.play('rengga_hug');
    y.setDepth(r.depth + 1);
    // cahaya senja lembut di sekitar mereka (beberapa lingkaran tipis, bukan satu cakram)
    const glow = this.add.container(0, 0).setDepth(y.depth - 2).setAlpha(0);
    [200, 150, 105].forEach((rad) => glow.add(this.add.circle((y.x + r.x) / 2, y.y - 100, rad, 0xffc890, 0.09).setBlendMode(Phaser.BlendModes.ADD)));
    await tweenP(this, { targets: glow, alpha: 1, duration: 900 });
    for (let i = 0; i < 8; i++) {
      const h = this.add.image((y.x + r.x) / 2 + Phaser.Math.Between(-60, 60), y.y - 190, 'emotes', 3).setDepth(400);
      this.tweens.add({ targets: h, y: h.y - 130, alpha: 0, duration: 1600, delay: i * 220, onComplete: () => h.destroy() });
    }
    await wait(this, 2600);
    await tweenP(this, { targets: glow, alpha: 0, duration: 700 });
    glow.destroy();
    y.play('yulia_idle'); r.play('rengga_idle');
    await walkTo(this, y, r.x - 150, 140);
    faceToward(y, r.x); faceToward(r, y.x);
    await this.dlg.play(S6.secondChance, { id: 's6_secondChance' });
    await memoryFound(this, 's6_second_heart');

    // surat kosong di pasir
    const paper = this.add.image(r.x - 360, GROUND.pantai - 16, 's6_surat_yulia').setScale(0.5).setDepth(90);
    const sp = sparkle(this, r.x - 330, GROUND.pantai - 70);
    this.addInteract({
      x: r.x - 360, r: 120, label: 'Ambil kertas', onUse: async () => {
        paper.destroy(); sp.destroy();
        await this.dlg.play(S6.letterFound, { id: 's6_letterFound' });
        await this.writeLetter();
        await memoryFound(this, 's6_surat_yulia');
        await this.ending();
      },
    });
    this.unlock();
  }

  // Kolom surat HTML di atas kanvas. Isi surat sepenuhnya dari pemain.
  writeLetter() {
    return new Promise((resolve) => {
      const kb = this.input.keyboard;
      kb.enabled = false;
      kb.disableGlobalCapture();
      const wrap = document.createElement('div');
      wrap.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(20,10,26,.72);z-index:20;padding:16px;box-sizing:border-box';
      wrap.innerHTML = `
        <div style="width:min(720px,100%);max-height:100%;display:flex;flex-direction:column;gap:12px;background:#fbf3e0;border:6px solid #2b1d2a;padding:18px;box-sizing:border-box;font-family:'Pixelify Sans',monospace;color:#2b1d2a">
          <div style="font-size:24px;font-weight:700;color:#c84a6a">Surat untuk Rengga</div>
          <div style="font-size:15px;color:#6a5a5a">Tulis dengan kata-katamu sendiri. Surat ini akan dibuka lagi di Stage 8.</div>
          <textarea maxlength="1200" style="flex:1;min-height:180px;height:38vh;resize:none;font:18px/1.5 'Pixelify Sans',monospace;color:#2b1d2a;background:#fffdf6;border:4px solid #2b1d2a;padding:12px;box-sizing:border-box;outline:none" placeholder="Untuk Rengga..."></textarea>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
            <span class="cnt" style="font-size:14px;color:#9a8f98">0 / 1200</span>
            <button style="font:700 18px 'Pixelify Sans',monospace;padding:10px 22px;background:#f2c14e;border:4px solid #2b1d2a;color:#2b1d2a;cursor:pointer;min-height:44px" disabled>Simpan surat</button>
          </div>
        </div>`;
      document.body.appendChild(wrap);
      const ta = wrap.querySelector('textarea');
      const btn = wrap.querySelector('button');
      const cnt = wrap.querySelector('.cnt');
      ta.value = Save.data.letter || '';
      const upd = () => {
        cnt.textContent = `${ta.value.length} / 1200`;
        btn.disabled = ta.value.trim().length === 0;
        btn.style.opacity = btn.disabled ? 0.5 : 1;
      };
      ta.addEventListener('input', upd);
      upd();
      setTimeout(() => ta.focus(), 50);
      btn.addEventListener('click', () => {
        Save.data.letter = ta.value.trim();
        Save.persist();
        Sfx.select();
        wrap.remove();
        kb.enabled = true;
        kb.enableGlobalCapture();
        resolve();
      });
    });
  }

  async ending() {
    await heartText(this, S6.heartEnd);
    const t = this.add.text(W / 2, H / 2, S6.unlocked, {
      fontFamily: FONT, fontSize: '64px', color: '#fff4d0', fontStyle: '700', stroke: '#c84a6a', strokeThickness: 10, align: 'center', wordWrap: { width: 1400 },
    }).setOrigin(0.5).setDepth(2200).setAlpha(0).setScale(0.7);
    Sfx.chime();
    await tweenP(this, { targets: t, alpha: 1, scale: 1, duration: 900, ease: 'Back.Out' });
    await wait(this, 2200);
    await tweenP(this, { targets: t, alpha: 0, duration: 700 });
    t.destroy();
    const dark = this.add.rectangle(0, 0, W, H, 0x000000, 0).setOrigin(0).setDepth(800);
    await tweenP(this, { targets: dark, fillAlpha: 0.45, duration: 900 });
    Save.completeStage(6);
    stageSummary(this, 6);
  }
}
