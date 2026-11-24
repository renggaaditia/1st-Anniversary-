import { W, H, FONT, COLOR } from '../config.js';
import { Save } from '../save.js';
import { COLLECTIBLES } from '../data/collectibles.js';

export class Boot extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const bar = this.add.rectangle(W / 2 - 300, H / 2, 0, 24, COLOR.gold).setOrigin(0, 0.5);
    this.add.rectangle(W / 2, H / 2, 612, 36).setStrokeStyle(6, 0xfbf3e0);
    this.add.text(W / 2, H / 2 - 60, 'Memuat kenangan...', { fontFamily: 'monospace', fontSize: '30px', color: '#fbf3e0' }).setOrigin(0.5);
    this.load.on('progress', (v) => { bar.width = 600 * v; });

    this.load.image('bg_pantai', 'assets/bg/pantai.png');
    this.load.image('bg_kapal_siang', 'assets/bg/kapal_siang.png');
    this.load.image('bg_kapal_malam', 'assets/bg/kapal_malam.png');
    for (const k of ['s2_toko_bunga', 's2_mall', 's2_photobooth', 's2_taman_sore', 's2_jalan_malam', 's2_kampus', 's2_taman_malam', 's4_mall_sepi', 's4_taman_mendung', 's4_jalan_hujan', 's5_malam_bokeh', 's5_toko_bunga_teduh', 's6_pantai_sunset', 's7_bioskop', 's7_bioskop_dalam', 's7_warung_sate', 's7_playground', 's7_taman_bunga', 's7_pantai_pagi', 's8_room']) this.load.image(`bg_${k}`, `assets/bg/${k}.jpg`);
    for (const n of ['rengga', 'yulia']) {
      this.load.spritesheet(n, `assets/characters/${n}_sheet.png`, { frameWidth: 96, frameHeight: 194 });
      this.load.json(`${n}_anims`, `assets/characters/${n}_anims.json`);
    }
    this.load.image('p_rengga', 'assets/portraits/rengga_besar.png');
    this.load.image('p_yulia', 'assets/portraits/yulia_besar.png');
    const icons = new Set(COLLECTIBLES.map((c) => c.icon).filter(Boolean));
    for (const k of icons) this.load.image(k, `assets/collectibles/${k}.png`);
    this.load.image('s7_motor', 'assets/props/s7_motor.png');
    this.load.image('s7_motor_front', 'assets/props/s7_motor_front.png');
    this.load.json('photos_meta', 'assets/photos/photos.json');
    for (let i = 1; i <= 20; i++) this.load.image(`t${String(i).padStart(2, '0')}`, `assets/photos/t${String(i).padStart(2, '0')}.png`);
    this.load.spritesheet('emotes', 'assets/ui/emotes.png', { frameWidth: 36, frameHeight: 36 });
  }

  async create() {
    for (const n of ['rengga', 'yulia']) {
      const meta = this.cache.json.get(`${n}_anims`);
      for (const [a, v] of Object.entries(meta.anims)) {
        this.anims.create({
          key: `${n}_${a}`,
          frames: this.anims.generateFrameNumbers(n, { start: v.start, end: v.end }),
          frameRate: v.frameRate, repeat: v.repeat,
        });
      }
    }
    Save.load();
    try {
      await Promise.race([
        Promise.all([document.fonts.load(`36px ${FONT}`), document.fonts.load(`700 36px ${FONT}`), document.fonts.load(`italic 36px ${FONT}`)]),
        new Promise((r) => setTimeout(r, 2500)),
      ]);
    } catch (e) { /* lanjut */ }
    if (Save.data.photo) await this.addPhotoTexture('photo_snap', Save.data.photo);
    if (Save.data.strip) await this.addPhotoTexture('strip_snap', Save.data.strip);
    this.scene.start('Title');
  }

  addPhotoTexture(key, dataUrl) {
    return new Promise((r) => {
      if (this.textures.exists(key)) return r();
      const img = new Image();
      img.onload = () => { this.textures.addImage(key, img); r(); };
      img.onerror = () => r();
      img.src = dataUrl;
    });
  }
}
