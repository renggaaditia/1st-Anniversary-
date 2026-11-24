// Teks Stage 3 — The Third Time's the Charm. Ubah bebas supaya sesuai cerita asli.

export const S3 = {
  intro: [
    { who: 'narrator', text: '3 Desember.' },
    { who: 'heart', text: 'Sudah dua kali aku bilang suka. Dua kali juga belum berhasil.' },
    { who: 'heart', text: 'Ini yang ketiga. Kalau kali ini ditolak, aku menyerah.' },
    { who: 'narrator', text: 'Berjalanlah menuju Yulia.' },
  ],

  // Flashback percobaan sebelumnya. bg = key background, ditampilkan hitam-putih.
  flashbacks: [
    {
      bg: 'bg_pantai', label: 'Percobaan pertama',
      lines: [
        { who: 'rengga', text: 'Yulia... aku suka sama kamu.' },
        { who: 'yulia', text: 'Rengga... maaf. Aku belum bisa.', anim: { yulia: 'sad' } },
      ],
    },
    {
      bg: 'bg_s2_jalan_malam', label: 'Percobaan kedua',
      lines: [
        { who: 'rengga', text: 'Aku masih serius. Perasaanku belum berubah.' },
        { who: 'yulia', text: 'Aku masih bingung, Rengga. Maaf.', anim: { yulia: 'sad' } },
      ],
    },
  ],

  afterFlashback: [
    { who: 'heart', text: 'Dua kali. Dan aku masih di sini.' },
  ],

  talk: [
    { who: 'yulia', text: 'Rengga? Katanya ada yang mau diomongin.' },
    { who: 'rengga', text: 'Iya. Ada.' },
  ],

  choose: [
    {
      who: 'heart', text: 'Sekarang, atau tidak sama sekali.', choiceId: 's3_confess',
      choices: ['Ungkapkan perasaan', 'Diam saja'],
    },
  ],

  hesitate: [
    { who: 'heart', text: 'Kalau bukan sekarang, kapan lagi?' },
  ],

  confess: [
    { who: 'rengga', text: 'Yulia. Aku tahu ini sudah ketiga kalinya.' },
    { who: 'rengga', text: 'Aku masih suka sama kamu. Dari malam di kapal itu sampai hari ini, nggak pernah berubah.' },
    { who: 'rengga', text: 'Kamu mau jadi pacarku?' },
  ],

  accept: [
    { who: 'yulia', text: 'Iya.', anim: { yulia: 'happy' } },
    { who: 'yulia', text: 'Aku mau, Rengga.' },
    { who: 'rengga', text: 'Serius?', anim: { rengga: 'happy' } },
    { who: 'yulia', text: 'Serius. Makasih sudah nggak menyerah.' },
  ],

  promise: [
    { who: 'rengga', text: 'Aku janji, aku bakal jaga kamu baik-baik.' },
    { who: 'yulia', text: 'Janji ya.', anim: { yulia: 'happy' } },
  ],

  // Teks akhir sesuai GDD.
  heartEnd: 'padahal kalau ini ditolak aku akan menyerah ternyata malah diterima aku senang sekali',
  dateLine: '3 DECEMBER 2025',
  dateSub: 'THE DAY WE BECAME US',
  closing: 'And just like that, the boy who kept trying finally got his answer.',
  chapter: 'CHAPTER 2 — HER SIDE OF THE STORY',
};
