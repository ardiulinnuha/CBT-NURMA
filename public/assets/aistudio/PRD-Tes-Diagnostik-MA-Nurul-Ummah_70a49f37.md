# PRD — Tes Diagnostik MA Nurul Ummah

Versi 1.0 · 26 Oktober 2026 · Dokumen Master Terakhir diperbarui: Senin, 26 Oktober 2026, pukul 19.43 WIB (Yogyakarta)

---

## 1. Ringkasan

**Tes Diagnostik MA Nurul Ummah** adalah aplikasi web untuk memetakan kompetensi murid baru Madrasah Aliyah Nurul Ummah (Yayasan Pendidikan Bina Putra, Pondok Pesantren Nurul Ummah Kotagede, Yogyakarta). Aplikasi menjalankan tes tertulis dan angket di perangkat murid, menerima skor praktik dari penguji, menghitung level dan flag otomatis, lalu menghasilkan Profil Murid satu halaman dan rekomendasi pembelajaran berdiferensiasi.

Sifat tes adalah **pemetaan, bukan seleksi**. Hasil tidak dipakai untuk menolak murid.

## 2. Tujuan dan Bukan Tujuan

**Tujuan**
1. Memetakan kompetensi akademik, diniyah, minat, gaya belajar, dan kesiapan asrama murid baru.
2. Mengotomatiskan koreksi, skoring, level, flag, dan rekomendasi sesuai dokumen paket tes.
3. Menjaga data sensitif (psikososial dan kesehatan) hanya terlihat oleh peran yang berhak.
4. Menyajikan pengalaman ramah anak dan terasa seperti produk Apple: bersih, lega, halus.

**Bukan tujuan (tahap ini)**
- Bukan sistem seleksi, ranking, atau penerimaan murid.
- Bukan alat diagnosis. Modul L, K, dan flag belajar hanya skrining.
- Tidak menambah modul baru di luar 14 modul. Tidak ada pemetaan khusus program unggulan.
- Tidak memakai data murid asli selama masih prototipe.

## 3. Konteks Madrasah

- Pendidikan berbasis pesantren dipadukan dengan kurikulum modern. Mazhab fikih: **Syafi'i**.
- Calon murid dari **campuran** MTs pondok, MTs umum, dan SMP. Skor "Dasar" tidak boleh dibaca sebagai kemampuan rendah. Belum pernah mondok bukan berarti potensi rendah.
- Peminatan kelas XI: IPA, IPS, Agama. Modul J tetap memakai **empat kelompok**: IPA, IPS, Bahasa, Keagamaan.
- Total tetap **14 modul (A–N)**, sekitar 4 jam, dalam 2 hari.
- **Soal tahap awal adalah versi demo**: butir dari dokumen paket tes apa adanya, diberi label "Soal demo" di tampilan Admin. Penyesuaian soal ke konteks Nurul Ummah (termasuk butir SKI dan Al-Qur'an Hadis di Modul H) menyusul di iterasi berikutnya.

## 4. Peran dan Hak Akses

Layar awal menampilkan tiga kartu peran besar. Tahap prototipe tanpa login (pilih peran saja). Login per peran menyusul bersama Firebase.

| Kemampuan | Murid | Admin | Guru BK |
| --- | :---: | :---: | :---: |
| Masuk dengan kode peserta | ✔ | | |
| Mengerjakan tes tertulis (B, C, D, E, H, N) dan angket (J, K, L) | ✔ | | |
| Melihat skor, level, flag sendiri atau orang lain | ✘ | | |
| Kelola data murid, persetujuan wali, kode peserta, atur hari tes | | ✔ | |
| Input skor praktik dan wawancara (F, G, I, M) | | ✔ | |
| Koreksi manual uraian (B7, C9, C10, D8, E, N) | | ✔ | |
| Dashboard sebaran level, minat, jumlah flag | | ✔ | ✔ |
| Cetak Profil Murid dan ekspor CSV | | ✔ (tanpa data L/kesehatan) | ✔ (lengkap) |
| Melihat Modul L, item kritis, data kesehatan | ✘ | ✘ | ✔ |
| Menerima alert kritis | | penanda netral saja | ✔ (banner merah) |

Aturan tegas:
- Admin hanya melihat penanda netral "Ada tindak lanjut di BK". Tidak pernah melihat isi jawaban L-K1/L-K2, skor L, atau data kesehatan.
- Murid tidak pernah melihat skor, level, flag, atau murid lain.
- Wali kelas tidak menjadi peran di aplikasi. Profil dibagikan lewat cetak/PDF oleh Admin atau BK.

## 5. Halaman Awal dan Alur

### 5.1 Halaman awal
Judul besar "Tes Diagnostik MA Nurul Ummah", tiga kartu peran (Murid, Admin, Guru BK), dan pil kecil di atas: "Data anak = data pribadi (UU PDP 27/2022). Akses dibatasi sesuai peran." Tampilkan juga catatan "Ini pemetaan, bukan seleksi."

### 5.2 Alur Murid
1. Pilih Murid, masukkan **kode peserta**.
2. Sistem cek status persetujuan wali. Jika belum dicentang: "Hubungi madrasah" dan tidak bisa lanjut.
3. **Layar sambutan** (lihat 6).
4. Hari 1: Sesi 1 (B, C, N) → istirahat 15 menit (hitung mundur) → Sesi 2 (D, E, H). Satu soal per layar, timer per modul.
5. Hari 2: angket J, K, L di aplikasi. F, G, I, M dikerjakan bersama penguji secara bergiliran (di luar tampilan murid).
6. Konfirmasi kirim → jawaban **terkunci**.
7. Layar penutup: "Terima kasih, jawabanmu sudah tersimpan." Tanpa skor atau komentar.

Sistem hanya membuka modul sesuai **hari yang dipilih Admin**. Murid tidak bisa membuka modul hari berikutnya. Modul dikerjakan berurutan sesuai sesi.

### 5.3 Alur Admin
1. Dashboard: jumlah murid terdaftar, sudah tes, belum tes, ditunda, dan sebaran level per modul (tanpa peringkat).
2. Kelola murid: tambah/ubah, centang persetujuan wali, terbitkan kode peserta, pilih hari tes aktif.
3. Stasiun praktik: antrean murid untuk F, G, I. Penguji memilih murid dan mengisi rubrik 1–4. Modul G memakai level G0–G4 plus kelancaran 1–4.
4. Wawancara (M): rubrik anak dan wali.
5. Antrean koreksi manual: B7, C9, C10, D8, E (yang tidak cocok otomatis), esai N.
6. Hasil otomatis: level Dasar/Cakap/Mahir, minat dominan, gaya belajar, kesiapan asrama, flag skrining belajar, rekomendasi diferensiasi.
7. Profil Murid (tanpa data L/kesehatan): lihat, cetak, simpan PDF. Ekspor CSV.
8. Murid dengan sesi "ditunda": tindak lanjut jadwal.

### 5.4 Alur Guru BK
1. Dashboard BK: **banner merah alert kritis** di paling atas bila ada, lalu daftar murid skor L ≥ 15 dan status "pantau".
2. Kasus kritis: buka detail, tampilkan langkah "eskalasi hari yang sama" (hubungi BK/psikolog, kabari wali, jangan tinggalkan anak sendirian, tanpa komentar menghakimi). L-K2 mengikuti protokol pencegahan kekerasan satuan pendidikan. Tombol "Sudah ditindaklanjuti" + catatan.
3. Data kesehatan dan kebutuhan khusus (dari angket A): alergi, penyakit kronis, obat rutin, akomodasi.
4. Profil lengkap versi BK.

## 6. Layar Sambutan Murid

Teks pembuka ramah anak: "Halo, [nama]! Selamat datang. Hari ini kamu akan mengerjakan beberapa kegiatan supaya madrasah bisa mengenal kemampuanmu dan membantumu belajar dengan cara yang paling cocok. Ini BUKAN seleksi, jadi tidak perlu takut. Kerjakan sebaik kemampuanmu, dan boleh bertanya kalau ada yang kurang jelas."

Kartu "Apa yang akan kamu kerjakan" sesuai hari aktif. Tiap kartu: ikon, nama, durasi, status (belum / sedang / selesai). Total durasi di atas kartu.

**Hari 1 (±2 jam 45 menit, termasuk istirahat)**
- Sesi 1 (90 menit): Membaca dan memahami teks (Literasi) 30 menit · Berhitung (Numerasi) 35 menit · Menulis 25 menit
- Istirahat 15 menit
- Sesi 2 (60 menit): Bahasa Inggris 20 menit · Bahasa Arab (tulis) 25 menit · Fikih, Akidah, Akhlak 15 menit

**Hari 2 (±75 menit)**
- Di tablet/HP/komputer (28 menit): Minat dan cita-cita 8 menit · Cara belajar dan kesiapan asrama 10 menit · Pertanyaan tentang perasaan dan pengalaman 10 menit
- Bersama ustaz/ustazah (bergiliran, tidak di aplikasi): Membaca Al-Qur'an dan tajwid 8 menit · Hafalan (tahfiz) 7 menit · Membaca kitab/pegon 8 menit · Ngobrol santai bersama wali 20 menit

Elemen lain:
- Kegiatan bersama penguji berlabel "Dengan penguji", tidak bisa dibuka dari tampilan murid.
- Tiga catatan singkat: "Timer akan terlihat di layar", "Jawaban tidak bisa diubah setelah dikirim", "Kamu tidak akan melihat nilai di sini."
- Tombol besar "Aku siap, mulai!" aktif setelah murid mencentang "Aku sudah membaca petunjuk".
- Tombol "Aku perlu istirahat" menandai sesi **ditunda** ke Admin tanpa menampilkan alasan lain.
- **Saran perangkat** (lihat 10).

## 7. Modul, Skoring, dan Flag

Semua butir, opsi, kunci, dan rumus diambil dari dokumen paket tes. Ringkasan referensi:

| Kode | Modul | Dikerjakan di | Skor | Level |
| --- | --- | --- | --- | --- |
| A | Angket wali | Admin/BK (data murid & kesehatan) | Deskriptif | — |
| B | Literasi Indonesia | Murid (app) | 10 | % benar |
| C | Numerasi | Murid (app) | 12 (+1 bonus C11) | % benar |
| N | Menulis | Murid (app) → nilai Admin | Rubrik 1–4 | Rerata |
| D | Bahasa Inggris | Murid (app) | 10 | % benar |
| E | Bahasa Arab (tulis) | Murid (app) | 14 | % benar |
| H | Fikih-Akidah-Akhlak | Murid (app) | 10 | % benar |
| J | Minat & peminatan | Murid (app) | Skala 1–4, 12 butir | Minat dominan |
| K | Gaya belajar + kesiapan asrama | Murid (app) | Skala 1–4, 14 butir | Dominan; kesiapan |
| L | Psikososial | Murid (app) → hanya BK | 0–2, 12 butir | Total 0–24 |
| F | Qur'an: tahsin + tajwid | Penguji → Admin | Rubrik 1–4 | Rerata |
| G | Tahfiz | Penguji → Admin | Level G0–G4 + kelancaran | Langsung |
| I | Kitab kuning / Pegon | Penguji → Admin | Rubrik 1–4 | Rerata |
| M | Wawancara anak + wali | Admin | Rubrik 1–4 | Rerata |

**Level:** B, C, D, E, H pakai % benar (<50 Dasar · 50–79 Cakap · ≥80 Mahir). N, F, I, M pakai rerata rubrik (<2 Dasar · 2–3 Cakap · >3 Mahir). G memakai level G0–G4 dan, bila rerata kelancaran <2, tampilkan rekomendasi naikkan murajaah.

**Koreksi otomatis dan manual**
- Pilihan ganda dikoreksi otomatis saat kirim.
- Isian singkat (mis. C1–C8, D6, E1, E5) dikoreksi otomatis dengan normalisasi (huruf besar/kecil, spasi, format angka/pecahan setara) dan alternatif kunci bila ada.
- **Jawaban isian yang tidak cocok tidak otomatis dianggap salah.** Masuk "Antrean koreksi" Admin.
- Uraian dinilai Admin lewat input poin sesuai rubrik: B7, C9, C10, D8, E2–E4, E6, esai N. C11 adalah bonus (tidak mengurangi).
- Langkah pengerjaan C (kolom "tulis langkah") disediakan sebagai kolom teks, tidak dinilai otomatis.

**Modul J:** jumlah per kelompok (3–12). Tertinggi = minat dominan. Selisih ≤1 antar kelompok teratas = campuran. Sertakan isian terbuka: cita-cita, 3 profesi impian, rencana setelah lulus.

**Modul K:** V/A/K = jumlah 2 butir, dominan tertinggi, selisih ≤1 = campuran. Kesiapan asrama = jumlah K7–K14 (<16 rendah · 16–24 sedang · >24 siap). **K11 ≤ 2 = flag motivasi**, wajib ditindaklanjuti di wawancara.

**Modul L:** butir 11 dan 12 dibalik (sering=0, kadang=1, tidak=2). 0–8 normal · 9–14 pantau · ≥15 rujuk BK. **Item kritis L-K1 dan L-K2 di luar skor.** Jawaban selain "tidak" memicu alert BK saat itu juga.

**Flag skrining belajar** (selalu berlabel "skrining, bukan diagnosis, rujuk psikolog/dokter"):
- B rendah + N (ejaan/keterbacaan) rendah + E rendah → skrining kesulitan membaca-menulis.
- C rendah, B/E normal → skrining kesulitan numerasi.
- L butir 1 sering + K6 tinggi + fokus rendah di sesi → skrining atensi.

**Rekomendasi diferensiasi** otomatis dari tabel Bagian 18 dokumen berdasarkan level dan flag. Pengelompokan fleksibel, tinjau tiap 8 minggu.

## 8. Profil Murid (1 halaman, A4)

Sesuai Bagian 17 dokumen: identitas dan asal sekolah, riwayat mondok · peta kompetensi B, C, D, E, H, N, F, I (Dasar/Cakap/Mahir) dan level G · minat dominan · gaya belajar · kesiapan asrama · flag (psikososial, literasi, numerasi, kesehatan, motivasi) · rekomendasi diferensiasi dan penempatan halaqah/kelompok kitab · catatan wali dan catatan kesehatan asrama.

- **Versi Admin:** tanpa skor L, item kritis, dan data kesehatan mentah. Flag psikososial hanya berupa penanda netral "Tindak lanjut di BK".
- **Versi BK:** lengkap.
- Tombol Print dan simpan PDF. Tata letak cetak tersendiri, tanpa sidebar dan animasi.

## 9. Dashboard dan Ekspor

- Kartu bento: murid terdaftar/sudah tes/belum/ditunda, sebaran Dasar-Cakap-Mahir per modul, distribusi minat, jumlah flag per jenis.
- **Tanpa peringkat dan tanpa perbandingan antarmurid.** Tidak menampilkan nama murid pada grafik sebaran.
- Ekspor CSV dengan kolom persis: ID · Nama · JK · Asal · B% · C% · D% · E% · H% · N_rerata · F_rerata · G_level · I_rerata · Minat · VAK · Kesiapan_asrama · L_total · Flag_kritis · Flag_belajar · Kesehatan · Catatan · Status_persetujuan.
- CSV versi Admin mengosongkan kolom L_total, Flag_kritis, Kesehatan. Versi BK lengkap.

## 10. Responsif dan Perangkat

- **Mobile-first**, lalu melebar ke tablet dan desktop. Semua perangkat didukung: HP pribadi, tablet atau laptop madrasah, lab komputer.
- **Murid:** satu soal per layar di semua ukuran. Kartu di tengah, lebar maksimal ±640px. Timer menempel di atas dan tidak tertutup keyboard saat mengetik esai.
- **Admin dan BK:** sidebar kaca di tablet dan desktop, tab bar bawah di HP. Dashboard berupa grid yang menyusut dari beberapa kolom ke satu kolom. Tabel berubah menjadi daftar kartu di HP.
- Input rubrik di HP memakai segmented control 1–4 dengan tombol besar.
- Dukung portrait dan landscape, area aman (notch), zoom teks sampai 200%.
- **Teks saran perangkat:** di layar kecil (lebar di bawah ±768px), tampilkan pil halus di layar sambutan: "Tips: untuk hasil terbaik, gunakan tablet, laptop, atau komputer." Sifatnya saran: tidak memblokir tombol mulai, bisa ditutup, tidak muncul berulang. Tidak tampil di tablet, laptop, dan desktop.
- Pengingat ringan yang sama sebelum modul **N (Menulis)** dan **E (Bahasa Arab)** di layar kecil.
- Jenis perangkat murid dicatat sebagai **keterangan untuk Admin**, bukan nilai.

## 11. Gaya Visual (terinspirasi Apple)

Tiru gaya dan nuansa Human Interface Guidelines. **Jangan memakai logo atau aset milik Apple.**

- **Konsep:** minimalis, lega, satu fokus per layar. Hierarki lewat ukuran dan bobot huruf, bukan garis dan kotak berlebihan.
- **Warna terang:** latar #F5F5F7, kartu #FFFFFF, teks #1D1D1F, teks sekunder #6E6E73, garis #D2D2D7. **Gelap otomatis (prefers-color-scheme):** latar #000000, kartu #1C1C1E, teks #F5F5F7, teks sekunder #98989D.
- **Aksen:** biru #0071E3 (gelap #0A84FF). Status: hijau #34C759 (selesai), oranye #FF9F0A (ditunda/pantau), merah #FF3B30 (**hanya** alert kritis di tampilan BK). Satu aksen per layar.
- **Tipografi:** -apple-system, "SF Pro Display", "SF Pro Text", Inter, system-ui, sans-serif. Judul 34–48px bobot 700 (letter-spacing -0.02em), isi 17px (line-height 1.5), keterangan 13px. Teks soal murid minimal 20px. Teks Arab memakai font Naskh, 28px ke atas, harakat terbaca.
- **Bentuk:** kartu 20–24px radius, tombol 14px atau pil, input 12px. Bayangan lembut (0 4px 24px rgba(0,0,0,0.06)). Efek kaca (backdrop-filter blur 20px) untuk navbar dan panel melayang.
- **Kontrol ala iOS:** segmented control untuk skala 1–4, toggle switch untuk centang, kartu opsi besar untuk pilihan ganda, cincin progres di kartu sesi, bar progres tipis di atas layar. Ikon garis tipis seragam (Lucide). Tombol utama biru, tinggi 52px (murid) atau 44px (Admin/BK).
- **Animasi halus:** transisi layar fade + slide 12–16px (350–450ms, cubic-bezier(0.25, 0.1, 0.25, 1)); tekan = scale(0.97) lalu memantul pelan; hover desktop naik 2px; daftar muncul berurutan (stagger 40–60ms); angka dashboard count-up; cincin progres terisi mulus; timer berubah oranye lembut di 60 detik terakhir tanpa suara atau getar; centang hijau animasi gambar garis di layar penutup. Hormati `prefers-reduced-motion`.
- **Nada tampilan murid:** hangat, ramah, tanpa istilah teknis, tanpa warna merah.

## 12. Aturan Bahasa Antarmuka

- Seluruh UI berbahasa Indonesia yang hangat dan jelas.
- **Dilarang** di UI: "seleksi", "lulus", "gagal", "tolak", "bodoh", "lemah", "nakal".
- Tampilkan catatan "Hasil bukan dasar penolakan" di area Admin dan pada profil.
- Banner UU PDP selalu tampil di bagian atas.

## 13. Privasi dan Kepatuhan

- Data anak = data pribadi (UU PDP No. 27/2022): persetujuan tertulis wali, minimisasi data, akses berbasis peran, retensi terbatas, enkripsi saat penyimpanan sungguhan.
- Data kesehatan dan psikososial = data sensitif, hanya BK.
- Skor tidak dipajang di depan murid. Tidak ada perbandingan antarmurid.
- Murid tanpa persetujuan wali: kode peserta tidak aktif dan skor tidak bisa diinput.
- Item kritis tidak boleh muncul di lembar atau profil yang dibaca umum.
- **Jangan masukkan data murid asli** sebelum ada backend aman, persetujuan wali, dan pembatasan akses. Prototipe memakai data dummy.

## 14. Arsitektur dan Penyimpanan

- Stack: React + TypeScript + Tailwind CSS + Vite.
- **Tahap 1:** localStorage. Seluruh akses data lewat satu lapisan repository/service sehingga mudah diganti ke Firebase Auth + Firestore (aturan akses per peran) di tahap berikutnya. Catatan: karena localStorage, murid dan Admin harus memakai perangkat yang sama selama uji coba.
- Struktur folder: `components/` (UI), `pages/` per peran, `engine/` (mesin skoring: fungsi murni, mudah diuji), `data/` (bank soal dan kunci, terpisah dan modular, penanda "demo"), `types/`, `services/` (repository).
- Bank soal berupa berkas data terpisah agar soal final Nurul Ummah bisa diganti tanpa membongkar aplikasi.

### Model data (ringkas)
- **Student:** id, nama, jenisKelamin, asalSekolah, riwayatMondok, persetujuanWali, kodePeserta, hariAktif, statusSesi (belum/sedang/selesai/ditunda), jenisPerangkat.
- **HealthRecord (BK saja):** studentId, alergi, penyakitKronis, obatRutin, kebutuhanKhusus, akomodasi.
- **Answer:** studentId, modulKode, butirId, jawaban, waktuKirim, terkunci.
- **Score:** studentId, modulKode, skorMentah, skorMaks, persen/rerata, level, statusKoreksi (otomatis/antrean/manual).
- **RubricEntry:** studentId, modulKode, aspek, nilai (1–4), penguji.
- **Flag:** studentId, jenis (psikososial/literasi/numerasi/kesehatan/motivasi), tingkat, catatan, visibleTo (admin/bk).
- **CriticalAlert (BK saja):** studentId, butir (L-K1/L-K2), jawaban, waktu, status (baru/ditindaklanjuti), catatanBK.
- **Question:** id, modulKode, jenis (pilihanGanda/isian/uraian/skala), teks, opsi, kunci, alternatifKunci, poin, label demo.

## 15. Data Dummy (uji coba)

Lima murid fiktif, cukup untuk menguji seluruh jalur:
1. Murid dari MTs pondok, tahfiz G2, kitab Menengah, semua normal.
2. Murid dari MTs umum, Arab dan kitab Dasar (bukan indikasi rendah, hanya belum pernah mondok).
3. Murid dari SMP, skor B rendah + N rendah + E rendah (memicu flag skrining membaca-menulis).
4. Murid dengan L total ≥ 15 dan jawaban L-K1 "pernah" (memicu alert kritis di BK).
5. Murid dengan persetujuan wali **belum** dicentang (kode peserta tidak aktif) dan K11 ≤ 2 pada data lain untuk menguji flag motivasi.

## 16. Tahap Pengerjaan

1. **Iterasi 1:** kerangka aplikasi, halaman awal tiga peran, data murid, mesin skoring, layar sambutan murid, Profil Murid (Admin dan BK). Data dummy dan bank soal demo termuat.
2. **Iterasi 2:** pengerjaan tes murid (B, C, D, E, H, N) dengan timer, kunci otomatis, antrean koreksi, penguncian jawaban.
3. **Iterasi 3:** angket J, K, L, alert kritis BK, dashboard, ekspor CSV.
4. **Iterasi 4:** stasiun praktik (F, G, I), wawancara (M), jadwal 2 hari dan istirahat.
5. **Iterasi 5:** ganti penyimpanan ke Firebase Auth + Firestore dengan aturan akses per peran.
6. **Iterasi 6:** soal final Nurul Ummah (termasuk SKI dan Al-Qur'an Hadis di Modul H, penyesuaian E dan I untuk asal murid campuran), soal paralel untuk pengukuran ulang minggu 6–8.

## 17. Kriteria Penerimaan (iterasi 1)

- Tiga kartu peran tampil di halaman awal, banner UU PDP terlihat.
- Admin tidak bisa membuka data L, item kritis, atau kesehatan dengan cara apa pun, termasuk lewat CSV atau profil cetak.
- Murid dengan jawaban L-K1 "pernah" menghasilkan banner merah di tampilan BK dan hanya penanda netral di tampilan Admin.
- Skor B, C, D, E, H, level, dan flag yang dihitung aplikasi cocok dengan perhitungan manual dari kunci dokumen untuk kelima data dummy.
- Layar sambutan menampilkan daftar kegiatan dan durasi yang benar untuk Hari 1 dan Hari 2.
- Tidak ada kata terlarang (bagian 12) di seluruh UI.
- Tampilan nyaman di lebar 375px, 768px, dan 1440px. Teks saran perangkat hanya muncul di layar kecil.
- Cetak Profil Murid muat satu halaman A4.
- `prefers-reduced-motion` mematikan animasi non-esensial.

## 18. Di Luar Lingkup (sementara)

Modul tambahan (SKI, Al-Qur'an Hadis, muhadatsah) sebagai modul sendiri · pemetaan khusus program unggulan · login dan manajemen akun sungguhan · notifikasi ke wali · analisis butir soal otomatis · integrasi Google Form untuk Angket A.
