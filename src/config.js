// Konstanta global game.
export const W = 1672;
export const H = 941;
export const FONT = '"Pixelify Sans", monospace';

export const COLOR = {
  ink: 0x2b1d2a, inkCss: '#2b1d2a',
  paper: 0xfbf3e0, paperCss: '#fbf3e0',
  paperDark: 0xe8dcc0,
  rose: 0xc84a6a, roseCss: '#c84a6a',
  teal: 0x2f6f73,
  gold: 0xf2c14e, goldCss: '#f2c14e',
  night: 0x0d1030,
  heart: 0xfdeef2, heartCss: '#8a3a58',
};

// Garis kaki karakter per background (y piksel di kanvas 1672x941).
export const GROUND = {
  pantai: 868,
  kapal: 880,
  bench: 800,
  // Stage 2
  kampus: 880,
  bunga: 862,
  mall: 882,
  booth: 892,
  taman: 862,
  jalan: 792,
};

export const CHAR_SCALE = 1;
// Arah hadap asli tiap sprite. Arah lain = mirror (flipX).
export const NATIVE_FACING = { rengga: 'left', yulia: 'right' };
export const WALK_SPEED = 300;

export const STAGES = [
  { n: 1, title: 'The Beginning', scene: 'S1Tanjung', month: 'Juli' },
  { n: 2, title: 'Our First Date?', scene: 'S2Kampus' },
  { n: 3, title: "The Third Time's the Charm", scene: 'S3Taman' },
  { n: 4, title: 'The Breakup', scene: 'S4Mall' },
  { n: 5, title: 'The Regret', scene: 'S5Phone' },
  { n: 6, title: 'Back to Where It Began', scene: 'S6Pantai' },
  { n: 7, title: 'Our Happy Moments', scene: 'S7Bioskop' },
  { n: 8, title: 'One Year', scene: 'S8Room' },
];

export const TEXT_SPEED = { lambat: 45, normal: 28, cepat: 12 };
