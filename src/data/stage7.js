// Teks Stage 7 — Our Happy Moments (Yulia). Ubah bebas supaya sesuai momen asli.

export const MOMENTS = [
  'Nonton Film', 'Naik Motor Malam', 'Makan Sate', 'Playground',
  'Jalan Bareng', 'Lari Bareng', 'Taman Bunga',
];

export const S7 = {
  // 1. Nonton film
  bioskopIntro: [
    { who: 'narrator', text: 'Setelah kesempatan kedua, hari-hari mulai terasa ringan lagi.' },
    { who: 'rengga', text: 'Filmnya mulai 15 menit lagi. Kamu yang pilih kursi, ya.' },
    { who: 'yulia', text: 'Oke! Aku beli tiketnya dulu.', anim: { yulia: 'happy' } },
  ],
  ticket: [
    { who: 'heart_yulia', text: 'Dua tiket. Kursi di tengah, biar layarnya pas.' },
  ],
  enter: [
    { who: 'yulia', text: 'Yuk masuk!' },
    { who: 'rengga', text: 'Popcorn-nya jangan dihabisin sebelum film mulai.' },
    { who: 'yulia', text: 'Nggak janji.', anim: { yulia: 'happy' } },
  ],
  movie: [
    { who: 'narrator', text: 'Lampu studio meredup.' },
    { who: 'rengga', text: '(bisik) Eh, ini bagian sedihnya...' },
    { who: 'yulia', text: '(bisik) Kamu nangis?' },
    { who: 'rengga', text: '(bisik) Nggak. Kelilipan popcorn.' },
    { who: 'heart_yulia', text: 'Aku lebih sering lihat ekspresinya daripada filmnya.' },
  ],

  // 2. Naik motor malam
  motorIntro: [
    { who: 'rengga', text: 'Pegangan, ya. Kita muter kota dulu sebelum pulang.' },
    { who: 'yulia', text: 'Pelan-pelan aja. Aku mau lihat lampu-lampunya.' },
  ],
  motorHint: 'Tekan A untuk berpegangan',
  motorAfter: [
    { who: 'heart_yulia', text: 'Angin malam, lampu jalan, dan punggung yang hangat.' },
    { who: 'rengga', text: 'Kamu kedinginan?' },
    { who: 'yulia', text: 'Nggak. Udah pas kok.', anim: { yulia: 'happy' } },
  ],

  // 3. Makan sate
  sateIntro: [
    { who: 'rengga', text: 'Laper? Ada sate di depan.' },
    { who: 'yulia', text: 'Sate ayam! Aku yang pesan.', anim: { yulia: 'happy' } },
  ],
  fanHint: 'Tekan A berkali-kali untuk mengipas arang',
  sateReady: [
    { who: 'narrator', text: 'Dua porsi sate ayam, bumbu kacang, lontong.' },
  ],
  sateEat: [
    { who: 'yulia', text: 'Aduh... kenyang. Nggak habis.' },
    { who: 'rengga', text: 'Sini, aku yang habisin.' },
    { who: 'yulia', text: 'Kamu selalu jadi tukang habisin makananku.', anim: { yulia: 'happy' } },
    { who: 'rengga', text: 'Sayang kalau dibuang. Lagian, sate dari kamu rasanya beda.' },
    { who: 'heart_yulia', text: 'Hal kecil, tapi selalu dia lakukan.' },
  ],


  // 4. Playground
  playIntro: [
    { who: 'yulia', text: 'Ayunan! Udah lama banget aku nggak main ini.', anim: { yulia: 'happy' } },
    { who: 'rengga', text: 'Naik. Aku yang dorong.' },
  ],
  swingHint: 'Tekan A untuk mengayun lebih tinggi',
  playAfter: [
    { who: 'yulia', text: 'Rasanya kayak jadi anak kecil lagi.' },
    { who: 'rengga', text: 'Bagus. Sama aku, kamu nggak harus selalu dewasa.' },
  ],

  // 5. Jalan bareng
  walkIntro: [
    { who: 'rengga', text: 'Jalan kaki aja, yuk. Nggak usah buru-buru.' },
  ],
  walkHold: [
    { who: 'yulia', text: '(menggandeng tangan Rengga)' },
    { who: 'rengga', text: '...' },
    { who: 'rengga', text: 'Hangat.', anim: { rengga: 'happy' } },
  ],
  walkMid: [
    { who: 'yulia', text: 'Kamu inget nggak, dulu kita duduk di bangku itu?' },
    { who: 'rengga', text: 'Inget. Waktu itu aku nggak tahu harus ngomong apa.' },
    { who: 'yulia', text: 'Sekarang?' },
    { who: 'rengga', text: 'Sekarang nggak perlu ngomong apa-apa.' },
  ],
  walkEnd: [
    { who: 'heart_yulia', text: 'Langkahnya menyesuaikan langkahku.' },
  ],

  // 6. Lari bareng
  runIntro: [
    { who: 'rengga', text: 'Lomba sampai bendera. Yang kalah traktir es kelapa.' },
    { who: 'yulia', text: 'Siap. Jangan nangis kalau kalah.' },
  ],
  runHint: 'Tahan ▶ untuk lari!',
  runWin: [
    { who: 'rengga', text: '(ngos-ngosan) Kamu... cepet juga...' },
    { who: 'yulia', text: 'Es kelapa dua, ya!', anim: { yulia: 'happy' } },
    { who: 'rengga', text: 'Iya, iya. Juara.' },
  ],

  // 7. Taman bunga + pertanyaan
  flowerIntro: [
    { who: 'narrator', text: 'Taman bunga, di hari yang cerah.' },
    { who: 'yulia', text: 'Cantik banget...', anim: { yulia: 'happy' } },
  ],
  flowerSmell: [
    { who: 'heart_yulia', text: 'Wangi. Seperti bunga yang dia bawa di kencan pertama.' },
  ],
  benchTalk: [
    { who: 'rengga', text: 'Yul.' },
    { who: 'yulia', text: 'Hm?' },
    { who: 'rengga', text: 'Boleh aku tanya satu hal?' },
  ],
  question: 'Did you regret the path you chose?',
  answers: ['No, not at all.', 'Sometimes, but it brought me here.', 'Never. Every step was worth it.'],
  replies: [
    [{ who: 'rengga', text: 'Aku juga nggak.', anim: { rengga: 'happy' } }],
    [{ who: 'rengga', text: 'Aku juga. Tapi kalau ujungnya di sini, aku mau lewat jalan itu lagi.', anim: { rengga: 'happy' } }],
    [{ who: 'rengga', text: 'Setiap langkahnya, termasuk yang sakit.', anim: { rengga: 'happy' } }],
  ],
  heartEnd: 'Semua jalan, termasuk yang salah, akhirnya membawaku kembali ke kamu.',
  ending: 'Hampir satu tahun.',
};
