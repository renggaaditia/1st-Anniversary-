// Kelas dasar untuk scene stage: pemain, objek interaktif, prompt, jeda.
import { W, H, FONT, COLOR, WALK_SPEED, CHAR_SCALE } from '../config.js';
import { face } from '../ui/helpers.js';
import { Dialogue } from '../ui/dialogue.js';
import { Controls } from '../ui/controls.js';

export class StageBase extends Phaser.Scene {
  setupStage({ bg, player = 'rengga', ground, minX = 90, maxX = W - 90 }) {
    this.bg = this.add.image(0, 0, bg).setOrigin(0).setDepth(0);
    this.ground = ground;
    this.minX = minX; this.maxX = maxX;
    this.busy = true;               // gerak dikunci sampai skrip membuka
    this.interactables = [];
    this.dlg = new Dialogue(this);
    this.ctrl = new Controls(this);
    this.player = null;
    this.playerName = player;
    this.prompt = this.add.container(0, 0).setDepth(1500).setVisible(false);
    const pg = this.add.text(0, 0, '', {
      fontFamily: FONT, fontSize: '30px', color: '#fbf3e0', backgroundColor: '#2b1d2add', padding: { x: 14, y: 8 },
    }).setOrigin(0.5, 1);
    this.prompt.add(pg);
    this.promptText = pg;
    this.tweens.add({ targets: pg, y: -10, yoyo: true, repeat: -1, duration: 500 });
  }

  addChar(name, x, y = this.ground) {
    const s = this.add.sprite(x, y, name, 0).setOrigin(0.5, 1).setScale(CHAR_SCALE);
    s.play(`${name}_idle`);
    s.setDepth(100 + y / 10);
    s.charName = name;
    this.dlg.actors[name] = s;
    return s;
  }

  // r: jarak horizontal; once: hilang setelah dipakai
  addInteract({ x, y = this.ground - 230, r = 150, label = 'Interact', onUse, once = true, enabled = true }) {
    const it = { x, y, r, label, onUse, once, enabled };
    this.interactables.push(it);
    return it;
  }

  lock() {
    this.busy = true;
    this.ctrl.setVisible(false);
    if (this.player) this.player.play(`${this.playerName}_idle`, true);
  }
  unlock() { this.busy = false; this.ctrl.setVisible(true); }

  update(time, delta) {
    if (this.ctrl.pausePressed() && !this.scene.isPaused()) {
      this.scene.launch('Pause', { from: this.scene.key });
      this.scene.pause();
      return;
    }
    if (this.busy || !this.player) { this.prompt.setVisible(false); return; }
    const p = this.player;
    let vx = 0;
    if (this.ctrl.left) vx -= 1;
    if (this.ctrl.right) vx += 1;
    if (vx) {
      p.x = Phaser.Math.Clamp(p.x + vx * (this.walkSpeed || WALK_SPEED) * (delta / 1000), this.minX, this.maxX);
      face(p, vx > 0 ? 'right' : 'left');
      p.play(`${this.playerName}_walk`, true);
    } else {
      p.play(`${this.playerName}_idle`, true);
    }
    // objek interaktif terdekat
    let best = null, bd = Infinity;
    for (const it of this.interactables) {
      if (!it.enabled) continue;
      const d = Math.abs(it.x - p.x);
      if (d < it.r && d < bd) { best = it; bd = d; }
    }
    if (best) {
      this.prompt.setVisible(true).setPosition(best.x, best.y);
      this.promptText.setText(`[${this.ctrl.actLabel}] ${best.label}`);
      if (this.ctrl.interactPressed()) {
        if (best.once) best.enabled = false;
        this.prompt.setVisible(false);
        this.lock();
        Promise.resolve(best.onUse()).catch((e) => console.error(e));
      }
    } else {
      this.prompt.setVisible(false);
      this.ctrl.interactPressed(); // buang tekanan yang tidak dipakai
    }
  }
}
