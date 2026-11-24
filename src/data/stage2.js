// Teks Stage 2 — Our First Date?. Ubah bebas supaya sesuai cerita asli.
// who: 'rengga' | 'yulia' | 'heart' (isi hati Rengga) | 'narrator'

export const S2 = {
  // Kampus (siang)
  kampus: [
    { who: 'narrator', text: 'Beberapa waktu setelah Kofiau. Di kampus.' },
    { who: 'heart', text: 'Itu Yulia. Hari ini aku harus berani ngajak dia jalan.' },
  ],
  kampusMeet: [
    { who: 'rengga', text: 'Yulia!' },
    { who: 'yulia', text: 'Eh, Rengga. Ada apa?' },
    { who: 'rengga', text: 'Nanti malam... kamu ada waktu?' },
    { who: 'yulia', text: 'Malam ini? Hmm... boleh.' },
    { who: 'rengga', text: 'Nanti aku izin dulu ke ibumu, ya.' },
    { who: 'yulia', text: 'Serius banget.', anim: { yulia: 'happy' } },
    { who: 'heart', text: 'Kencan pertama. Harus serius. Harus rapi.' },
  ],

  intro: [
    { who: 'narrator', text: 'Sore harinya.' },
    { who: 'heart', text: 'Bunga dulu. Surat izin buat ibunya juga sudah aku siapkan.' },
    { who: 'narrator', text: 'Cari barang yang terjatuh, lalu masuk ke toko bunga.' },
  ],

  letter: [
    { who: 'heart', text: 'Eh, surat izinnya jatuh! Untung ketemu.' },
    { who: 'heart', text: 'Surat izin buat ibunya Yulia. Aku tulis ulang tiga kali biar rapi.' },
  ],

  needLetter: [
    { who: 'heart', text: 'Tunggu, surat izinku mana? Tadi ada di saku...' },
  ],

  shop: [
    { who: 'narrator', text: 'Toko bunga. Wangi bunga segar memenuhi ruangan.' },
    {
      who: 'heart', text: 'Yulia suka bunga apa ya?', choiceId: 's2_bouquet',
      choices: ['Mawar merah muda', 'Bunga putih', 'Campur semua warna'],
      replies: [
        [{ who: 'heart', text: 'Merah muda. Manis, kayak dia.' }],
        [{ who: 'heart', text: 'Putih. Sederhana, tapi tulus.' }],
        [{ who: 'heart', text: 'Semua warna. Biar dia tahu aku serius.' }],
      ],
    },
  ],

  toMall: [
    'Surat izin sudah diserahkan ke ibu Yulia.',
    'Malam itu, mereka bertemu di mall.',
  ],

  meet: [
    { who: 'rengga', text: 'Yulia! Maaf, nunggu lama?' },
    { who: 'yulia', text: 'Nggak kok, baru sampai.' },
    { who: 'rengga', text: 'Ini... buat kamu.', anim: { rengga: 'interact' } },
    { who: 'yulia', text: 'Eh? Bunga? Makasih...' },
    { who: 'heart', text: 'Kenapa senyumnya kayak dipaksa?' },
    { who: 'yulia', text: 'Jadi, kita mau ke mana?' },
    { who: 'rengga', text: 'Aku sudah pesan photobooth. Di sebelah sana.' },
  ],

  booth: [
    { who: 'yulia', text: 'Rengga...', anim: { yulia: 'sad' } },
    { who: 'yulia', text: 'Boleh nggak, fotonya dibatalkan saja?' },
    { who: 'rengga', text: 'Kenapa? Ada yang salah?', anim: { rengga: 'confused' } },
    { who: 'yulia', text: 'Nggak apa-apa. Aku cuma lagi nggak mood foto.' },
    { who: 'heart', text: 'Padahal sudah dipesan dari kemarin...' },
    { who: 'rengga', text: 'Sudah terlanjur dibayar. Sekali saja, ya?' },
    { who: 'yulia', text: '...Ya sudah. Sekali saja.' },
  ],

  boothHelp: [
    { who: 'narrator', text: 'Empat kali jepret. Tekan [E] / Spasi / tombol A tepat saat hitungan "1" supaya Rengga tersenyum.' },
  ],

  afterStrip: [
    { who: 'narrator', text: 'Hasil fotonya canggung. Senyum yang kaku, jarak yang terasa.' },
    { who: 'yulia', text: 'Aku pulang duluan ya. Makasih buat hari ini.' },
    { who: 'rengga', text: 'Oh... iya. Hati-hati.' },
    { who: 'narrator', text: 'Malam itu, Yulia mulai bimbang. Masa lalunya yang belum selesai, atau ketulusan Rengga.' },
  ],

  park: [
    { who: 'narrator', text: 'Malam itu Rengga duduk sendiri di taman.' },
  ],

  // Teks hati Rengga di akhir stage, sesuai GDD.
  heartEnd: 'hari ini aku senang sekaligus sedih, bahagia sekaligus marah, kenapa yulia gabisa lihat tulusku ya',
};
