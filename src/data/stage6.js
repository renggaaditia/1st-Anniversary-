// Teks Stage 6 — Back to Where It Began (Yulia). Ubah bebas supaya sesuai cerita asli.

export const S6 = {
  intro: [
    { who: 'narrator', text: 'Pantai. Tempat perasaan Rengga pertama kali tumbuh.' },
    { who: 'heart_yulia', text: 'Kami datang ke sini lagi. Kali ini aku yang harus berani.' },
  ],

  shell: [
    { who: 'heart_yulia', text: 'Kerang ini... mirip yang dulu dia pungut waktu kami ke Kofiau.' },
  ],

  approach: [
    { who: 'yulia', text: 'Rengga.' },
    { who: 'rengga', text: 'Hm?' },
  ],

  apology: [
    { who: 'yulia', text: 'Maaf.', anim: { yulia: 'apologize' } },
    { who: 'yulia', text: 'Maaf aku nggak lihat ketulusanmu dari awal.' },
    { who: 'yulia', text: 'Maaf aku bikin kamu sakit sendirian.' },
  ],

  secondChance: [
    { who: 'rengga', text: '...' },
    { who: 'rengga', text: 'Jujur, aku belum sepenuhnya lupa rasanya.' },
    { who: 'rengga', text: 'Tapi aku mau coba lagi. Pelan-pelan.' },
    { who: 'yulia', text: 'Pelan-pelan juga nggak apa-apa.', anim: { yulia: 'happy' } },
  ],

  letterFound: [
    { who: 'heart_yulia', text: 'Kertas kosong. Ada yang belum sempat aku tulis untuknya.' },
    { who: 'narrator', text: 'Tulis surat dari Yulia untuk Rengga. Surat ini akan dibuka lagi di Stage 8.' },
  ],

  // Teks hati Rengga sesuai GDD.
  heartEnd: 'walaupun masih berat akan aku coba jalani dulu',
  unlocked: 'A SECOND CHANCE — UNLOCKED',
};
