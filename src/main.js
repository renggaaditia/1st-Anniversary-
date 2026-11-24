import { W, H } from './config.js';
import { Boot } from './scenes/Boot.js';
import { Title } from './scenes/Title.js';
import { StageSelect } from './scenes/StageSelect.js';
import { Album } from './scenes/Album.js';
import { Settings } from './scenes/Settings.js';
import { Pause } from './scenes/Pause.js';
import { S1Tanjung } from './scenes/S1Tanjung.js';
import { S1Kapal } from './scenes/S1Kapal.js';
import { S1Poem } from './scenes/S1Poem.js';
import { S1End } from './scenes/S1End.js';
import { S2Kampus, S2Bunga, S2Mall, S2Booth, S2Taman, S2Jalan } from './scenes/Stage2.js';
import { S3Taman } from './scenes/Stage3.js';
import { S4Mall, S4Taman, S4Hidden } from './scenes/Stage4.js';
import { S5Phone, S5Buku } from './scenes/Stage5.js';
import { S6Pantai } from './scenes/Stage6.js';
import { S8Room, S8End } from './scenes/Stage8.js';
import { Gallery } from './scenes/Gallery.js';
import { S7Bioskop, S7Motor, S7Sate, S7Playground, S7Jalan, S7Lari, S7Taman } from './scenes/Stage7.js';

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#0d1030',
  pixelArt: true,
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 3 },
  scene: [Boot, Title, StageSelect, Album, Settings, Pause, S1Tanjung, S1Kapal, S1Poem, S1End, S2Kampus, S2Bunga, S2Mall, S2Booth, S2Taman, S2Jalan, S3Taman, S4Mall, S4Taman, S4Hidden, S5Phone, S5Buku, S6Pantai, S7Bioskop, S7Motor, S7Sate, S7Playground, S7Jalan, S7Lari, S7Taman, S8Room, S8End, Gallery],
});

window.__game = game; // untuk debug di console
