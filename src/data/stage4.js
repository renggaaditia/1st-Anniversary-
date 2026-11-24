// Teks Stage 4 — The Breakup (Chapter 2, sudut pandang Yulia). Ubah bebas supaya sesuai cerita asli.
// who: 'yulia' | 'rengga' | 'heart_yulia' (isi hati Yulia) | 'narrator'

export const S4 = {
  intro: [
    { who: 'narrator', text: 'Beberapa bulan setelah 3 Desember.' },
    { who: 'narrator', text: 'Hubungan mereka mulai retak.' },
    { who: 'heart_yulia', text: 'Tempat ini dulu ramai. Sekarang rasanya kosong.' },
    { who: 'narrator', text: 'Kamu sekarang bermain sebagai Yulia. Jelajahi tempat ini.' },
  ],

  // Pesan lama di HP Yulia.
  message: [
    { from: 'Rengga', text: 'Aku boleh tanya sesuatu?' },
    { from: 'Rengga', text: 'Sebenarnya aku kurang apa?' },
    { from: 'Rengga', text: 'Kenapa kamu nggak bisa kasih perhatian yang sama?' },
  ],

  flashback: [
    { who: 'heart_yulia', text: 'Malam itu dia bertanya. Dan aku akhirnya jujur.' },
    { who: 'yulia', text: 'Bukan kamu yang kurang, Rengga.' },
    { who: 'yulia', text: 'Aku... masih punya perasaan sama dia.', anim: { yulia: 'sad' } },
    { who: 'rengga', text: 'Oh.' },
    { who: 'rengga', text: 'Kalau gitu, kita selesai di sini aja ya.' },
    { who: 'narrator', text: 'Hubungan mereka berakhir.' },
  ],

  booth: [
    { who: 'heart_yulia', text: 'Photobooth ini...' },
    { who: 'heart_yulia', text: 'Dulu aku minta fotonya dibatalkan. Dia tetap tersenyum.' },
    { who: 'heart_yulia', text: 'Kenapa baru sekarang rasanya sakit?' },
  ],

  toPark: [
    'Beberapa hari kemudian.',
  ],

  parkIntro: [
    { who: 'heart_yulia', text: 'Itu... Rengga?' },
    { who: 'narrator', text: 'Dekati Rengga.' },
  ],

  approach: [
    { who: 'yulia', text: 'Rengga...' },
    { who: 'yulia', text: 'Kamu apa kabar?' },
    { who: 'narrator', text: 'Rengga tidak menjawab.' },
  ],

  afterLeave: [
    { who: 'heart_yulia', text: 'Dia kelihatan baik-baik saja.' },
    { who: 'heart_yulia', text: 'Mungkin memang cuma aku yang belum selesai.' },
  ],

  // Yang tidak Yulia ketahui.
  hidden: [
    'Yang tidak Yulia ketahui:',
    'Rengga tidak baik-baik saja.',
    'Ia hancur, menangis, marah, dan terluka.',
    'Ia menjauh bukan karena tidak peduli, tapi karena sedang melindungi dirinya sendiri.',
  ],

  ending: 'Dan Yulia berdiri sendiri di bawah hujan.',
};
