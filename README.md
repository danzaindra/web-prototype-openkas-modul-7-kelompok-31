# OpenKas

OpenKas merupakan prototipe website untuk membantu pengelolaan kas dan data anggota. Proyek ini dikembangkan untuk memenuhi tugas Modul 7, yaitu mengubah desain Figma menjadi prototipe web interaktif.

## Fitur

- Halaman landing page
- Halaman login untuk simulasi masuk ke aplikasi
- Halaman daftar kelas dan anggota
- Pencarian anggota berdasarkan nama atau nomor anggota
- Formulir penambahan anggota
- Modal konfirmasi setelah anggota berhasil ditambahkan
- Tampilan yang disesuaikan untuk desktop dan perangkat seluler

> **Catatan:** OpenKas masih berupa prototipe dan belum terhubung ke backend atau database permanen. Data yang ditambahkan bersifat sementara dan tidak disimpan secara permanen.

## Teknologi

- React
- Vite
- JavaScript
- CSS
- Git dan GitHub

## Desain Figma

Desain awal OpenKas dapat dilihat melalui tautan berikut:

[OpenKas — Figma Design](https://www.figma.com/design/xC4Llgug2n0q5vl4KT9XZq/OpenKas?m=auto&t=bXCwy4FWypNSQzzk-6)

## Cara Menjalankan Proyek

Pastikan [Node.js](https://nodejs.org/) sudah terpasang di komputer.

1. Clone repositori:

   ```bash
   git clone https://github.com/danzaindra/web-prototype-openkas-modul-7-kelompok-31.git
   ```

2. Masuk ke folder proyek:

   ```bash
   cd web-prototype-openkas-modul-7-kelompok-31
   ```

3. Instal dependensi:

   ```bash
   npm install
   ```

4. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

5. Buka alamat lokal yang ditampilkan di terminal. Biasanya alamatnya adalah `http://localhost:5173/`.

## Kontribusi Anggota

| Nama | Kontribusi |
| --- | --- |
| Rafi Rizky Santosa | Halaman Tambah Anggota 1 dan Tambah Anggota 2 |
| Kinta Desvina Nur Saliha | Halaman Login dan Error 404 |
| Zaidan Ahmad Zaindra | Halaman Landing Page dan Daftar Kelas |
| Priska Andriani | Halaman Daftar Anggota dan Tambah Anggota Success |

## Penggunaan AI

AI digunakan sebagai alat bantu selama proses pengembangan, antara lain untuk membantu penulisan kode, pengembangan interaksi, dan mencari solusi ketika terjadi kesalahan. Saran dari AI diperiksa kembali sebelum diterapkan. Contoh prompt yang digunakan dan perbaikan manual yang dilakukan dicantumkan dalam laporan proyek sesuai proses pengerjaan yang sebenarnya.

## Pengujian

Pengujian dilakukan secara manual melalui browser lokal. Beberapa hal yang perlu diperiksa meliputi:

- Navigasi antarhalaman
- Alur login pada prototipe
- Pencarian anggota
- Penambahan anggota melalui formulir
- Modal konfirmasi setelah anggota berhasil ditambahkan
- Tampilan pada ukuran layar yang berbeda

Hasil pengujian perlu dicatat sesuai kondisi aplikasi saat diuji. Jangan menyatakan suatu fitur berhasil apabila fitur tersebut belum diperiksa atau masih mengalami kendala.

## Pengembangan Proyek

Pengembangan dilakukan secara bertahap menggunakan Git dan GitHub. Perubahan kode, penambahan fitur, perbaikan, dan dokumentasi dicatat melalui commit agar proses pengembangan dapat ditelusuri.

## Batasan Prototipe

- Login hanya digunakan untuk simulasi dan belum terhubung ke sistem autentikasi.
- Data anggota masih bersifat sementara.
- Aplikasi belum menggunakan backend atau database permanen.