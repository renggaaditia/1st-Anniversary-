# Our Story — Stage 1–6

Game web Phaser 3, resolusi 1672x941 (mengikuti background), skala otomatis ke layar. Desktop + HP (landscape).

## Menjalankan
Butuh server lokal (modul JS tidak jalan dari file://):
- VS Code: klik kanan `index.html` > **Open with Live Server**, atau
- Terminal: `npx serve .` lalu buka alamat yang muncul.

## Kontrol
- Desktop: A/D atau panah = jalan, E/Spasi/Enter = interaksi & lanjut dialog, X = lewati dialog yang sudah pernah dibaca, Esc = jeda.
- HP: tombol ◀ ▶ (kiri bawah), A (kanan bawah), II (jeda). Ketuk layar untuk lanjut dialog.

## Alur Stage 1
Tanjung (dekati Yulia) > mini-game foto > kapal siang (tiket, ngobrol + pilihan) > malam > duduk di bangku > tunjuk bintang > tertidur > puisi > kapal menjauh > ringkasan.
Kenangan: Foto Pertama (foto asli hasil mini-game), Tiket Kapal, Bintang Malam, The First Poem.

## Alur Stage 2
Toko bunga (cari surat izin yang jatuh, masuk toko, pilih bouquet) > mall (beri bunga ke Yulia) > photobooth (Yulia minta batal, 4 jepret: tekan saat hitungan "1") > taman sore (Rengga duduk sendiri, isi hati) > jalan malam > ringkasan.
Kenangan: Formal Permission Letter, Bouquet, Photobooth Strip (foto asli hasil mini-game), Uncertain Heart.

## Alur Stage 3
Taman sore (3 Desember) > dua flashback hitam-putih saat berjalan > bicara dengan Yulia > pilih "Ungkapkan perasaan" > jeda detak jantung > diterima > berdiri bersama > isi hati > 3 DECEMBER 2025 > Rengga menghilang > CHAPTER 2 — HER SIDE OF THE STORY.
Kenangan: Third Attempt, Accepted Heart, Promise.

## Alur Stage 4 (Chapter 2, main sebagai Yulia)
Mall sepi (lihat HP: pesan lama Rengga + kenangan putus; photobooth) > taman mendung hujan (panggil Rengga, ia pergi tanpa menjawab) > cutaway Rengga hancur di jalan hujan (yang tidak Yulia ketahui) > Yulia berdiri sendiri > ringkasan.
Kenangan: Unanswered Message, Broken Heart, Hidden Pain. Latar s4_* dibuat dari latar Stage 2 dengan color grading (redup, kebiruan).

## Alur Stage 5 (Yulia)
HP Yulia: buat Story, Catatan, Status (pilih isi) > Rengga melihat tanpa membalas > isi hati Rengga > chat pertama (pilih pembuka) > minta pinjam novel Pulang > depan toko bunga: terima buku > ngobrol santai (pilihan) > percakapan hangat, belum ada keputusan > ringkasan.
UI media sosial generik, tanpa logo/desain resmi. Kenangan: First Message, Pulang Book, Second Chance.

## Alur Stage 6 (Yulia)
Pantai sunset > ambil kerang > dekati Rengga > minta maaf + pelukan > Rengga bicara soal kesempatan kedua > ambil kertas kosong > pemain menulis surat sendiri (kolom teks, disimpan di save sebagai `letter`, dibuka lagi di Stage 8) > hati Rengga > A SECOND CHANCE — UNLOCKED > ringkasan.
Kenangan: Familiar Shore, Second Heart, Yulia's Letter (album menampilkan cuplikan surat).

## Mengubah isi
- Teks dialog: `src/data/stage1.js` (puisi di bagian `poem`) `src/data/stage2.js`, `src/data/stage4.js`, `src/data/stage5.js`, `src/data/stage6.js`, `src/data/stage3.js` (teks penutup GDD di `heartEnd`, `dateLine`, `closing`, `chapter`).
- Nama & deskripsi kenangan: `src/data/collectibles.js`.
- Posisi tanah karakter, judul stage: `src/config.js`.
- Background: `assets/bg/*.png` (render dari SVG kamu, 1672x941).

## Sistem yang sudah ada
Save otomatis (localStorage): stage terbuka/selesai, kenangan, pilihan dialog, foto, checkpoint, pengaturan.
Menu: Mulai/Lanjutkan, Pilih Stage (8 stage, terkunci), Memory Album (8 halaman), Pengaturan (volume, kecepatan teks, suara ketik, layar penuh).
Jeda: Lanjut, Memory Album, Pengaturan, Ulangi Stage, Menu Utama.
Efek suara dibuat dengan WebAudio (tanpa file). Musik belum ada: slider volume musik sudah disiapkan.

## Stage 7 — Our Happy Moments (Yulia)
7 mini-scene: nonton film, naik motor malam, makan sate, playground, jalan bareng, lari bareng, taman bunga. Ditutup pertanyaan "Did you regret the path you chose?" (jawaban disimpan di `stage7Answer`). Teks: `src/data/stage7.js`. Latar baru dibuat dari latar asli: `tools/s7_art.py`.

## Stage 8 — One Year (Yulia)
Ruang anniversary, dinding foto (20 foto asli di `assets/photos/`, galeri `Gallery`), Memory Album mode cerita (halaman 1–7 + surat Yulia + jawaban Stage 7), pertanyaan "Let's continue our journey..." / "Yes, always.", teks ending GDD, lalu langit malam: HAPPY 1ST ANNIVERSARY · 3 DECEMBER 2026 · CHAPTER 2 — OUR FUTURE. Teks: `src/data/stage8.js`. Foto: `tools/s8_photos.py` (urutan & tanggal di dalamnya).
