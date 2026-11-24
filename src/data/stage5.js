// Teks Stage 5 — The Regret (Yulia). Ubah bebas supaya sesuai cerita asli.

export const S5 = {
  intro: [
    { who: 'narrator', text: 'Setelah perpisahan.' },
    { who: 'heart_yulia', text: 'Kenapa baru sekarang aku sadar?' },
    { who: 'heart_yulia', text: 'Aku nggak berani bilang langsung. Mungkin... lewat tanda kecil?' },
  ],

  // Level 1 — The Signals. Tiga unggahan, masing-masing pilih isinya.
  posts: [
    {
      app: 'Story', color: 0x7a4ac8, title: 'Buat Story',
      options: ['Foto langit senja + "kangen yang nggak bisa diucap"', 'Foto buku di rak + "ada yang belum selesai dibaca"', 'Layar hitam + "maaf"'],
    },
    {
      app: 'Catatan', color: 0xd8607a, title: 'Tulis Catatan',
      options: ['"lagi belajar menghargai yang dulu ada"', '"semoga kamu baik-baik saja"', '"terlambat ya?"'],
    },
    {
      app: 'Status', color: 0x2f9a6a, title: 'Buat Status',
      options: ['Foto laut + "ingat kapal malam itu"', 'Foto bunga + "bunga yang dulu kubiarkan layu"', 'Foto jalan hujan + "pulang"'],
    },
  ],

  afterPosts: [
    { who: 'heart_yulia', text: 'Dia lihat semuanya.' },
    { who: 'heart_yulia', text: 'Tapi nggak ada balasan.' },
  ],

  renggaSide: [
    { who: 'heart', text: 'Ini buat aku? Atau bukan?' },
    { who: 'heart', text: 'Jangan kegeeran. Jangan berharap lagi.' },
  ],

  // Level 2 — The First Message.
  openers: ['Hai, Rengga. Apa kabar?', 'Rengga, maaf ganggu ya...', 'Kamu masih simpan novel Pulang?'],
  openerReplies: [
    ['Baik.', 'Kamu?'],
    ['Nggak ganggu.', 'Kenapa?'],
    ['Masih.', 'Kenapa memangnya?'],
  ],
  ask: [
    { from: 'yulia', text: 'Boleh aku pinjam novel Pulang karya Leila S. Chudori?' },
    { from: 'rengga', text: '...' },
    { from: 'rengga', text: 'Boleh.' },
    { from: 'rengga', text: 'Besok siang di depan toko bunga?' },
    { from: 'yulia', text: 'Oke. Makasih, Rengga.' },
  ],

  // Level 3 — The Book.
  bookIntro: [
    { who: 'narrator', text: 'Keesokan harinya.' },
    { who: 'heart_yulia', text: 'Dia sudah di sana.' },
  ],
  book: [
    { who: 'rengga', text: 'Ini bukunya.', anim: { rengga: 'interact' } },
    { who: 'yulia', text: 'Makasih. Aku janji jaga baik-baik.' },
    { who: 'rengga', text: 'Santai aja.' },
  ],

  // Level 4 — A Little Closer.
  closer: [
    {
      who: 'heart_yulia', text: 'Ajak ngobrol sebentar?', choiceId: 's5_closer1',
      choices: ['Tanya kabar kuliahnya', 'Bahas novel Pulang', 'Cerita hal lucu minggu ini'],
      replies: [
        [{ who: 'yulia', text: 'Kuliahmu gimana?' }, { who: 'rengga', text: 'Lumayan. Lagi sibuk tugas.' }],
        [{ who: 'yulia', text: 'Pulang itu tentang apa sih?' }, { who: 'rengga', text: 'Tentang orang yang jauh dari rumah. Dan ingin pulang.' }],
        [{ who: 'yulia', text: 'Minggu ini aku salah naik angkot dua kali.' }, { who: 'rengga', text: 'Hahaha. Masih sama ya.', anim: { rengga: 'happy' } }],
      ],
    },
    { who: 'heart_yulia', text: 'Dia mulai tersenyum. Tapi masih ada jarak.' },
  ],

  // Level 5 — The Second Chance.
  warm: [
    { who: 'rengga', text: 'Kabari kalau sudah selesai baca ya.' },
    { who: 'yulia', text: 'Iya. Nanti aku kembalikan.' },
    { who: 'yulia', text: 'Rengga... makasih sudah mau ketemu.', anim: { yulia: 'happy' } },
    { who: 'rengga', text: '...Sama-sama.' },
    { who: 'narrator', text: 'Belum ada keputusan. Tapi pintu itu terbuka sedikit.' },
  ],
};
