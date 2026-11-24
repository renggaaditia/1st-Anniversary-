// Teks Stage 1. Ubah bebas supaya sesuai cerita asli.
// who: 'rengga' | 'yulia' | 'heart' (isi hati Rengga) | 'narrator'
// anim: ganti animasi karakter saat baris tampil, contoh { yulia: 'happy' }

export const S1 = {
  intro: [
    { who: 'narrator', text: 'Bulan Juli. Rombongan program kampus berkumpul di Tanjung, menunggu kapal ke Kofiau.' },
    { who: 'heart', text: 'Itu Yulia...' },
    { who: 'heart', text: 'Aku butuh alasan buat ngobrol sama dia. Alasan apa saja.' },
    { who: 'narrator', text: 'Gerakkan Rengga dengan A / D atau tombol panah. Dekati Yulia.' },
  ],

  askPhoto: [
    { who: 'rengga', text: 'Eh, Yulia. Lagi sibuk?' },
    { who: 'yulia', text: 'Nggak kok. Kenapa?' },
    { who: 'heart', text: 'Ayo, Rengga. Pakai alasannya.' },
    { who: 'rengga', text: 'Aku boleh minta foto? Pemandangannya bagus, sayang kalau nggak diabadikan.' },
    { who: 'yulia', text: 'Boleh. Mau aku fotoin?', anim: { yulia: 'interact' } },
    { who: 'rengga', text: 'Eh... maksudnya foto bareng. Kalau kamu mau.', anim: { rengga: 'confused' } },
    { who: 'yulia', text: 'Hahaha. Iya, boleh.', anim: { yulia: 'happy' } },
  ],

  photoHelp: [
    { who: 'narrator', text: 'Tekan [E] / Spasi / tombol A saat penanda masuk area hijau untuk mengambil foto.' },
  ],

  afterPhoto: [
    { who: 'yulia', text: 'Coba lihat. Bagus nggak?' },
    { who: 'rengga', text: 'Bagus. Bagus banget.', anim: { rengga: 'happy' } },
    { who: 'heart', text: 'Yang bagus kamunya.' },
    { who: 'yulia', text: 'Eh, kapalnya sudah mau berangkat. Ayo!' },
  ],

  shipIntro: [
    { who: 'narrator', text: 'Kapal mulai berlayar menuju Kofiau.' },
    { who: 'narrator', text: 'Jelajahi dek. Yulia ada di dekat pagar.' },
  ],

  ticket: [
    { who: 'heart', text: 'Tiket kapal. Aku simpan saja, buat kenang-kenangan.' },
  ],

  shipTalk: [
    { who: 'yulia', text: 'Anginnya enak ya.' },
    { who: 'rengga', text: 'Iya. Lautnya juga tenang.' },
    {
      who: 'yulia', text: 'Kamu pernah ke Kofiau sebelumnya?', choiceId: 's1_kofiau',
      choices: ['Belum, ini pertama kali.', 'Pernah, tapi kali ini rasanya beda.'],
      replies: [
        [
          { who: 'rengga', text: 'Belum. Ini pertama kali.' },
          { who: 'yulia', text: 'Sama! Semoga seru ya.', anim: { yulia: 'happy' } },
        ],
        [
          { who: 'rengga', text: 'Pernah. Tapi kali ini rasanya beda.' },
          { who: 'yulia', text: 'Beda kenapa?' },
          { who: 'rengga', text: 'Nggak tahu. Mungkin karena teman perjalanannya.', anim: { rengga: 'happy' } },
          { who: 'yulia', text: 'Hm? Hahaha.', anim: { yulia: 'happy' } },
        ],
      ],
    },
    { who: 'yulia', text: 'Nanti malam kita ke dek lagi, yuk. Katanya bintangnya kelihatan jelas dari sini.' },
    { who: 'rengga', text: 'Oke. Aku tunggu.' },
  ],

  nightIntro: [
    { who: 'narrator', text: 'Malam pun tiba.' },
    { who: 'narrator', text: 'Ajak Yulia duduk di bangku dek.' },
  ],

  nightTalk: [
    { who: 'yulia', text: 'Wah... bintangnya banyak banget.' },
    { who: 'rengga', text: 'Di kota nggak pernah kelihatan sebanyak ini.' },
    { who: 'yulia', text: 'Coba cari bintang yang paling terang.' },
  ],

  starHelp: [
    { who: 'narrator', text: 'Ada satu bintang yang berkelip paling terang. Tekan [E] / tombol A untuk menunjuknya.' },
  ],

  afterStar: [
    { who: 'rengga', text: 'Itu. Yang paling terang.' },
    { who: 'yulia', text: 'Cantik ya.', anim: { yulia: 'happy' } },
    { who: 'heart', text: 'Iya. Cantik.' },
    { who: 'heart', text: 'Tapi aku nggak sedang lihat bintang.' },
    { who: 'yulia', text: 'Rengga, ceritain sesuatu dong. Biar nggak ngantuk.' },
    { who: 'rengga', text: 'Cerita apa?' },
    { who: 'yulia', text: 'Apa saja.' },
  ],

  sleep: [
    'Mereka bercerita tentang banyak hal sampai pagi hampir datang.',
    'Lalu tertidur di dek, di bawah bintang yang sama.',
    'Malam itu, sesuatu mulai tumbuh di hati Rengga.',
  ],

  // Puisi sesuai GDD (kata "less" di akhir dihapus atas permintaan).
  poem: [
    'Puji-pujian pada bintang yang selalu kuutarakan malam itu, tertuju untukmu',
    'Cantik yang ku lontarkan pada langit, kuucapkan ratusan kali didalam benak, untukmu',
    'Peduli yang tak seberapa, harapan yang tak pernah kukatakan pada semua, untukmu',
    'Waktu dan airku yang sedikit, juga untukmu',
  ],
};
