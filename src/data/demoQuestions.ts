/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DemoQuestion {
  id: string;
  modulKode: string;
  modulNama: string;
  jenis: 'pilihanGanda' | 'isian' | 'uraian' | 'skala';
  teks: string;
  teksArab?: string;
  opsi?: string[];
  kunci?: string | number;
  poin: number;
  isDemo: true;
}

export const DEMO_QUESTIONS: DemoQuestion[] = [
  // Modul B: Literasi Indonesia
  {
    id: 'B1',
    modulKode: 'B',
    modulNama: 'Literasi Bahasa Indonesia',
    jenis: 'pilihanGanda',
    teks: 'Bacalah kutipan teks berikut: "Kehidupan di pesantren menumbuhkan kemandirian dan rasa empati yang kuat melalui pembiasaan hidup bersama." Gagasan utama dari kalimat tersebut adalah...',
    opsi: [
      'A. Santri harus tinggal bersama orang lain.',
      'B. Pesantren menumbuhkan kemandirian dan empati melalui hidup bersama.',
      'C. Pembiasaan di pesantren sangat melelahkan.',
      'D. Rasa empati hanya bisa dilatih di asrama.',
    ],
    kunci: 1, // B
    poin: 1,
    isDemo: true,
  },
  {
    id: 'B7',
    modulKode: 'B',
    modulNama: 'Literasi Bahasa Indonesia',
    jenis: 'uraian',
    teks: 'Jelaskan hikmah yang dapat kamu petik dari kisah persahabatan santri dalam teks di atas, dan bagaimana penerapannya dalam kehidupan barumu di MA Nurul Ummah!',
    poin: 2,
    isDemo: true,
  },

  // Modul C: Numerasi
  {
    id: 'C1',
    modulKode: 'C',
    modulNama: 'Numerasi',
    jenis: 'isian',
    teks: 'Sebuah asrama memiliki 12 kamar. Setiap kamar menampung 6 santri. Jika 8 santri baru masuk ke asrama tersebut, berapakah total santri yang tinggal di asrama sekarang?',
    kunci: '80',
    poin: 1,
    isDemo: true,
  },
  {
    id: 'C9',
    modulKode: 'C',
    modulNama: 'Numerasi',
    jenis: 'uraian',
    teks: 'Pak Musyrif membagikan kurma kepada 3 kelompok santri. Tuliskan langkah perhitunganmu untuk membagi 45 butir kurma dengan rasio 2:3:4!',
    poin: 2,
    isDemo: true,
  },

  // Modul D: Bahasa Inggris
  {
    id: 'D1',
    modulKode: 'D',
    modulNama: 'Bahasa Inggris',
    jenis: 'pilihanGanda',
    teks: 'Choose the best phrase to complete: "Every morning before dawn, the students ... to the mosque together."',
    opsi: ['A. walks', 'B. walk', 'C. walking', 'D. has walked'],
    kunci: 1, // B
    poin: 1,
    isDemo: true,
  },

  // Modul E: Bahasa Arab (Tulis)
  {
    id: 'E1',
    modulKode: 'E',
    modulNama: 'Bahasa Arab (Tulis)',
    jenis: 'pilihanGanda',
    teks: 'Pilihlah terjemahan yang tepat untuk kalimat berikut:',
    teksArab: 'طَلَبُ العِلْمِ فَرِيْضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    opsi: [
      'A. Menuntut ilmu itu wajib bagi setiap muslim.',
      'B. Ilmu adalah penerang dalam kegelapan.',
      'C. Orang berilmu dimuliakan di mana pun berada.',
      'D. Belajar memerlukan kesabaran dan keikhlasan.',
    ],
    kunci: 0,
    poin: 1,
    isDemo: true,
  },

  // Modul H: Fikih, Akidah, Akhlak
  {
    id: 'H1',
    modulKode: 'H',
    modulNama: 'Fikih, Akidah, Akhlak',
    jenis: 'pilihanGanda',
    teks: 'Dalam Mazhab Syafi\'i, rukun wudhu yang pertama setelah berniat saat membasuh wajah adalah...',
    opsi: [
      'A. Membasuh kedua tangan sampai siku.',
      'B. Mengusap sebagian kepala.',
      'C. Membasuh muka (disertai niat di dalam hati).',
      'D. Tertib.',
    ],
    kunci: 2,
    poin: 1,
    isDemo: true,
  },

  // Modul J: Minat & Peminatan
  {
    id: 'J1',
    modulKode: 'J',
    modulNama: 'Minat & Peminatan',
    jenis: 'skala',
    teks: 'Saya sangat tertarik melakukan eksperimen sains di laboratorium dan mencari tahu bagaimana fenomena alam bekerja.',
    opsi: ['1 - Sangat tidak setuju', '2 - Kurang setuju', '3 - Setuju', '4 - Sangat setuju'],
    poin: 4,
    isDemo: true,
  },

  // Modul K: Gaya Belajar & Kesiapan Asrama
  {
    id: 'K1',
    modulKode: 'K',
    modulNama: 'Gaya Belajar & Kesiapan Asrama',
    jenis: 'skala',
    teks: 'Saya lebih mudah mengingat pelajaran jika materi disajikan dalam bentuk diagram, warna, atau peta konsep.',
    opsi: ['1 - Sangat jarang', '2 - Kadang-kadang', '3 - Sering', '4 - Selalu'],
    poin: 4,
    isDemo: true,
  },
  {
    id: 'K11',
    modulKode: 'K',
    modulNama: 'Gaya Belajar & Kesiapan Asrama',
    jenis: 'skala',
    teks: 'Saya merasa mantap dan bersemangat atas keinginan sendiri untuk belajar dan tinggal di pondok pesantren.',
    opsi: ['1 - Tidak yakin sama sekali', '2 - Masih ragu', '3 - Cukup mantap', '4 - Sangat mantap dari hati sendiri'],
    poin: 4,
    isDemo: true,
  },

  // Modul L: Kesejahteraan Psikososial (BK)
  {
    id: 'L1',
    modulKode: 'L',
    modulNama: 'Kesejahteraan Psikososial',
    jenis: 'skala',
    teks: 'Dalam sebulan terakhir, seberapa sering kamu merasa cemas atau sulit tidur memikirkan hal-hal baru?',
    opsi: ['Tidak pernah (0)', 'Kadang-kadang (1)', 'Sering (2)'],
    poin: 2,
    isDemo: true,
  },
  {
    id: 'L-K1',
    modulKode: 'L',
    modulNama: 'Kesejahteraan Psikososial (Item Kritis 1)',
    jenis: 'isian',
    teks: 'Pernahkah kamu merasa sangat putus asa hingga terlintas keinginan untuk melukai dirimu sendiri?',
    opsi: ['Tidak', 'Pernah'],
    poin: 0,
    isDemo: true,
  },
  {
    id: 'L-K2',
    modulKode: 'L',
    modulNama: 'Kesejahteraan Psikososial (Item Kritis 2)',
    jenis: 'isian',
    teks: 'Pernahkah kamu mengalami perlakuan kasar, ancaman, atau intimidasi fisik/verbal dari lingkungan sekitarmu?',
    opsi: ['Tidak', 'Pernah'],
    poin: 0,
    isDemo: true,
  },
];
