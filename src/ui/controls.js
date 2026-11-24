// Input gabungan keyboard + tombol sentuh (muncul otomatis di perangkat sentuh).
import { W, H, FONT, COLOR } from '../config.js';

export class Controls {
  constructor(scene, { jump = false } = {}) {
    this.s = scene;
    this.k = scene.input.keyboard.addKeys({
      left: 'LEFT', right: 'RIGHT', a: 'A', d: 'D', up: 'UP', w: 'W',
      space: 'SPACE', e: 'E', enter: 'ENTER', esc: 'ESC',
    });
    this.t = { left: false, right: false, act: false, jump: false, pause: false };
    this.touch = scene.sys.game.device.input.touch;
    this.enabled = true;
    this.c = scene.add.container(0, 0).setDepth(2500).setScrollFactor(0);
    if (this.touch) this.buildTouch(jump);
    else {
      // tombol jeda kecil juga untuk mouse
      this.pauseBtn = this.button(W - 60, 60, 38, 'II', () => { this.t.pause = true; });
    }
  }

  button(x, y, r, label, onDown, onUp) {
    const g = this.s.add.circle(x, y, r, COLOR.ink, 0.55).setStrokeStyle(5, 0xfbf3e0, 0.9);
    const t = this.s.add.text(x, y, label, { fontFamily: FONT, fontSize: `${Math.round(r * 0.9)}px`, color: '#fbf3e0', fontStyle: '700' }).setOrigin(0.5);
    g.setInteractive();
    g.on('pointerdown', () => { g.setFillStyle(COLOR.rose, 0.75); onDown && onDown(); });
    const up = () => { g.setFillStyle(COLOR.ink, 0.55); onUp && onUp(); };
    g.on('pointerup', up); g.on('pointerout', up);
    this.c.add([g, t]);
    return { g, t };
  }

  buildTouch(jump) {
    this.button(130, H - 120, 78, '◀', () => (this.t.left = true), () => (this.t.left = false));
    this.button(320, H - 120, 78, '▶', () => (this.t.right = true), () => (this.t.right = false));
    this.actBtn = this.button(W - 140, H - 130, 90, 'A', () => (this.t.act = true));
    this.jumpBtn = this.button(W - 330, H - 100, 66, '▲', () => (this.t.jump = true));
    this.jumpBtn.g.setVisible(jump); this.jumpBtn.t.setVisible(jump);
    this.pauseBtn = this.button(W - 60, 60, 40, 'II', () => { this.t.pause = true; });
  }

  setVisible(v) { this.c.setVisible(v); }

  get left() { return this.enabled && (this.k.left.isDown || this.k.a.isDown || this.t.left); }
  get right() { return this.enabled && (this.k.right.isDown || this.k.d.isDown || this.t.right); }

  interactPressed() {
    const J = Phaser.Input.Keyboard.JustDown;
    const kb = J(this.k.space) | J(this.k.e) | J(this.k.enter);
    const v = this.t.act;
    this.t.act = false;
    return this.enabled && (!!kb || v);
  }

  pausePressed() {
    const v = Phaser.Input.Keyboard.JustDown(this.k.esc) || this.t.pause;
    this.t.pause = false;
    return v;
  }

  // nama tombol untuk prompt
  get actLabel() { return this.touch ? 'A' : 'E'; }
}
