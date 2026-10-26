/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AcademicLevel,
  BoardingReadinessResult,
  DifferentiationRecommendation,
  InterestResult,
  LearningStyleResult,
  ModuleScore,
  PsychosocialResult,
  StudentFlag,
  TahfizLevel,
} from '../types';

/**
 * Calculates academic level based on percentage correct (<50 Dasar, 50-79 Cakap, >=80 Mahir)
 * Used for Modul B, C, D, E, H
 */
export function calculatePercentageLevel(correct: number, maxScore: number): {
  percent: number;
  level: AcademicLevel;
} {
  if (maxScore <= 0) return { percent: 0, level: 'Dasar' };
  const percent = Math.round((correct / maxScore) * 100);
  let level: AcademicLevel = 'Dasar';
  if (percent >= 80) {
    level = 'Mahir';
  } else if (percent >= 50) {
    level = 'Cakap';
  }
  return { percent, level };
}

/**
 * Calculates academic level based on rubric average (<2 Dasar, 2-3 Cakap, >3 Mahir)
 * Used for Modul N, F, I, M
 */
export function calculateRubricLevel(average: number): AcademicLevel {
  if (average > 3.0) return 'Mahir';
  if (average >= 2.0) return 'Cakap';
  return 'Dasar';
}

/**
 * Evaluates Tahfiz level (G0 - G4) and checks fluency threshold
 * Used for Modul G
 */
export function evaluateTahfizLevel(
  level: TahfizLevel,
  fluencyAverage: number
): {
  level: TahfizLevel;
  fluencyAverage: number;
  needMurajaahBoost: boolean;
  notes: string;
} {
  const needMurajaahBoost = fluencyAverage < 2.0;
  let notes = `Level ${level}`;
  if (needMurajaahBoost) {
    notes += ' — Rerata kelancaran < 2: Dianjurkan penguatan murajaah harian.';
  }
  return {
    level,
    fluencyAverage,
    needMurajaahBoost,
    notes,
  };
}

/**
 * Calculates dominant interest from Module J (scale 1-4, 4 clusters: IPA, IPS, Bahasa, Keagamaan)
 * If top 2 clusters have difference <= 1, it is categorized as mixed (Campuran)
 */
export function calculateInterestModuleJ(scores: {
  IPA: number;
  IPS: number;
  Bahasa: number;
  Keagamaan: number;
}): {
  dominant: string;
  isMixed: boolean;
  sortedClusters: { cluster: string; score: number }[];
} {
  const clusters = [
    { cluster: 'IPA', score: scores.IPA },
    { cluster: 'IPS', score: scores.IPS },
    { cluster: 'Bahasa', score: scores.Bahasa },
    { cluster: 'Keagamaan', score: scores.Keagamaan },
  ].sort((a, b) => b.score - a.score);

  const highest = clusters[0];
  const second = clusters[1];
  const isMixed = highest.score - second.score <= 1;

  const dominant = isMixed
    ? `Campuran (${highest.cluster}/${second.cluster})`
    : highest.cluster;

  return { dominant, isMixed, sortedClusters: clusters };
}

/**
 * Calculates dominant learning style (V/A/K) from Module K
 * Highest cluster is dominant, difference <= 1 is Campuran
 */
export function calculateLearningStyleModulK(vak: {
  visual: number;
  auditory: number;
  kinesthetic: number;
}): LearningStyleResult {
  const styles = [
    { name: 'Visual' as const, score: vak.visual },
    { name: 'Auditori' as const, score: vak.auditory },
    { name: 'Kinestetik' as const, score: vak.kinesthetic },
  ].sort((a, b) => b.score - a.score);

  const top1 = styles[0];
  const top2 = styles[1];
  const isMixed = top1.score - top2.score <= 1;

  return {
    vak,
    dominant: isMixed ? 'Campuran' : top1.name,
    isMixed,
  };
}

/**
 * Calculates boarding readiness from Module K (K7-K14)
 * < 16 Rendah, 16-24 Sedang, > 24 Siap
 * K11 <= 2 triggers motivation flag (wajib ditindaklanjuti di wawancara)
 */
export function calculateBoardingReadinessModulK(
  kScores: number[], // 8 items: K7 through K14
  k11Score: number
): BoardingReadinessResult {
  const totalScore = kScores.reduce((sum, score) => sum + score, 0);
  let level: 'Rendah' | 'Sedang' | 'Siap' = 'Sedang';
  if (totalScore > 24) {
    level = 'Siap';
  } else if (totalScore < 16) {
    level = 'Rendah';
  }

  const hasMotivationFlag = k11Score <= 2;

  return {
    totalScore,
    level,
    k11Score,
    hasMotivationFlag,
  };
}

/**
 * Calculates Psychosocial score from Module L
 * Items 11 & 12 are inverted (sering=0, kadang=1, tidak=2).
 * Items 1-10 are direct (sering=2, kadang=1, tidak=0).
 * Thresholds: 0-8 Normal, 9-14 Pantau, >=15 Rujuk BK.
 * Items L-K1 and L-K2 are critical screening questions separate from score.
 */
export function calculatePsychosocialModulL(
  items: number[], // 12 numbers representing items L1 through L12
  lk1Answer: string,
  lk2Answer: string
): PsychosocialResult {
  if (items.length !== 12) {
    throw new Error('Modul L requires exactly 12 items');
  }

  const totalScore = items.reduce((sum, val) => sum + val, 0);

  let status: 'Normal' | 'Pantau' | 'Rujuk BK' = 'Normal';
  if (totalScore >= 15) {
    status = 'Rujuk BK';
  } else if (totalScore >= 9) {
    status = 'Pantau';
  }

  const isLk1Critical = isNonNegativeResponse(lk1Answer);
  const isLk2Critical = isNonNegativeResponse(lk2Answer);
  const isCritical = isLk1Critical || isLk2Critical;

  const criticalReasons: string[] = [];
  if (isLk1Critical) {
    criticalReasons.push(`L-K1 dijawab "${lk1Answer}" (skrining dorongan melukai diri)`);
  }
  if (isLk2Critical) {
    criticalReasons.push(`L-K2 dijawab "${lk2Answer}" (skrining pengalaman kekerasan)`);
  }

  return {
    totalScore,
    status,
    lk1Answer,
    lk2Answer,
    isCritical,
    criticalReasons,
  };
}

function isNonNegativeResponse(answer: string): boolean {
  if (!answer) return false;
  const clean = answer.trim().toLowerCase();
  return clean !== 'tidak' && clean !== 'tidak pernah' && clean !== 'never' && clean !== 'no';
}

/**
 * Evaluates learning screening flags (skrining, bukan diagnosis, rujuk psikolog/dokter)
 */
export function evaluateLearningFlags(params: {
  scoreBPercent: number;
  scoreNRubric: number;
  scoreEPercent: number;
  scoreCPercent: number;
  psychosocialLItem1?: number; // 2 = sering
  learningStyleK6?: number; // >= 3 = tinggi
  sessionFocusLow?: boolean;
  k11Score?: number;
  psychosocialTotal?: number;
  isCriticalAlert?: boolean;
}): StudentFlag[] {
  const flags: StudentFlag[] = [];

  // Flag Skrining Kesulitan Membaca-Menulis
  if (params.scoreBPercent < 50 && params.scoreNRubric < 2.0 && params.scoreEPercent < 50) {
    flags.push({
      id: 'flag-literasi',
      jenis: 'literasi',
      label: 'Skrining Kesulitan Membaca-Menulis',
      catatan:
        'Skor Literasi Indonesia (<50%), Menulis (<2.0), dan Bahasa Arab (<50%) berada di level Dasar. (Catatan: skrining, bukan diagnosis, rujuk psikolog/dokter bila diperlukan pemeriksaan lanjut).',
      visibleTo: 'admin',
      tingkat: 'perhatian',
    });
  }

  // Flag Skrining Kesulitan Numerasi
  if (params.scoreCPercent < 50 && params.scoreBPercent >= 50 && params.scoreEPercent >= 50) {
    flags.push({
      id: 'flag-numerasi',
      jenis: 'numerasi',
      label: 'Skrining Kesulitan Numerasi',
      catatan:
        'Skor Numerasi (<50%) berada di level Dasar sementara kemampuan bahasa cukup. Perlu penguatan konsep berhitung bertahap. (Catatan: skrining, bukan diagnosis).',
      visibleTo: 'admin',
      tingkat: 'perhatian',
    });
  }

  // Flag Skrining Atensi
  if (
    params.psychosocialLItem1 === 2 &&
    (params.learningStyleK6 ?? 0) >= 3 &&
    params.sessionFocusLow
  ) {
    flags.push({
      id: 'flag-atensi',
      jenis: 'psikososial',
      label: 'Skrining Atensi & Konsentrasi',
      catatan:
        'Menunjukkan kecenderungan mudah terdistraksi selama pengerjaan. Disarankan tempat duduk baris depan dan instruksi bertahap. (Catatan: skrining, bukan diagnosis).',
      visibleTo: 'bk',
      tingkat: 'perhatian',
    });
  }

  // Flag Motivasi (K11 <= 2)
  if (params.k11Score !== undefined && params.k11Score <= 2) {
    flags.push({
      id: 'flag-motivasi',
      jenis: 'motivasi',
      label: 'Perhatian Motivasi Masuk Asrama (K11 ≤ 2)',
      catatan:
        'Menunjukkan keraguan atau dorongan mandiri yang masih rendah untuk tinggal di asrama. Wajib dieksplorasi secara hangat dalam sesi wawancara dan pendampingan awal.',
      visibleTo: 'admin',
      tingkat: 'perhatian',
    });
  }

  // Flag Psikososial L >= 15
  if (params.psychosocialTotal !== undefined && params.psychosocialTotal >= 15) {
    flags.push({
      id: 'flag-psikososial-tinggi',
      jenis: 'psikososial',
      label: 'Tindak Lanjut Konseling BK (Skor L ≥ 15)',
      catatan:
        'Skor psikososial menunjukkan indikasi perlunya ruang bimbingan dan konseling rutin di awal tahun ajaran.',
      visibleTo: 'bk',
      tingkat: 'perhatian',
    });
  }

  // Critical alert flag
  if (params.isCriticalAlert) {
    flags.push({
      id: 'flag-kritis-bk',
      jenis: 'psikososial',
      label: 'Alert Kritis: Eskalasi Hari yang Sama',
      catatan:
        'Terdeteksi respons non-negatif pada instrumen skrining keselamatan. Ikuti protokol pendampingan segera.',
      visibleTo: 'bk',
      tingkat: 'kritis',
    });
  }

  return flags;
}

/**
 * Returns differentiation recommendations (Bagian 18 PRD)
 */
export function getDifferentiationRecommendations(
  scores: Record<string, ModuleScore>,
  interest: InterestResult,
  boarding: BoardingReadinessResult,
  mondokHistory: string
): DifferentiationRecommendation {
  const bLevel = scores['B']?.level || 'Dasar';
  const cLevel = scores['C']?.level || 'Dasar';
  const dLevel = scores['D']?.level || 'Dasar';
  const eLevel = scores['E']?.level || 'Dasar';
  const fLevel = scores['F']?.level || 'Dasar';
  const gLevel = scores['G']?.level || 'G0';
  const iLevel = scores['I']?.level || 'Dasar';

  // Academic recommendations
  let litRec = 'Pembiasaan membaca terbimbing, pendampingan kosakata kontekstual.';
  if (bLevel === 'Mahir') {
    litRec = 'Pengayaan analisis teks kritis, penulisan esai opini dan karya ilmiah remaja.';
  } else if (bLevel === 'Cakap') {
    litRec = 'Pembelajaran reguler berbasis teks analitis dan latihan ringkasan terstruktur.';
  }

  let numRec = 'Scaffolding bertahap dengan media visual/konkret, penguatan logika operasi dasar.';
  if (cLevel === 'Mahir') {
    numRec = 'Pengayaan soal pemecahan masalah non-rutin, pembinaan pra-olimpiade sains/matematika.';
  } else if (cLevel === 'Cakap') {
    numRec = 'Latihan pemecahan masalah kontekstual dan interpretasi data bertahap.';
  }

  // Language recommendations
  let ingRec = 'Matrikulasi dasar: kosakata harian dan frasa komunikatif bertahap.';
  if (dLevel === 'Mahir') {
    ingRec = 'Kelas English Club tingkat lanjut, debat bahasa Inggris, dan public speaking.';
  } else if (dLevel === 'Cakap') {
    ingRec = 'Penguatan tata bahasa fungsional dan latihan percakapan dua arah terarah.';
  }

  let arabRec = 'Matrikulasi huruf/harakat dan kosakata dasar (khusus lulusan SMP/MTs umum non-pondok).';
  if (eLevel === 'Mahir') {
    arabRec = 'Pengayaan teks Arab gundul/tarakib, insya terarah, dan pembiasaan muhadatsah aktif.';
  } else if (eLevel === 'Cakap') {
    arabRec = 'Latihan kaidah nahwu-sharaf aplikatif dan membaca teks berharakat terbimbing.';
  }

  // Pesantren recommendations
  let tahsinRec = 'Halaqah Tahsin Dasar (makharijul huruf & sifat huruf).';
  if (fLevel === 'Mahir') {
    tahsinRec = 'Halaqah Tahsin Lanjutan / Talaqqi Qiraat.';
  } else if (fLevel === 'Cakap') {
    tahsinRec = 'Halaqah Tahsin Menengah (hukum tajwid aplikatif & kelancaran tilawah).';
  }

  let tahfizRec = `Halaqah Tahfiz ${gLevel} — target setoran terukur per pekan`;
  if (scores['G']?.kelancaran && scores['G'].kelancaran < 2) {
    tahfizRec += ' (prioritas penguatan murajaah hafalan lama).';
  } else {
    tahfizRec += '.';
  }

  let kitabRec = 'Kelas Pengenalan Pegon & Kaidah Dasar I\'rob (penyesuaian untuk pemula).';
  if (iLevel === 'Mahir') {
    kitabRec = 'Halaqah Kitab Menengah-Atas (Fathul Qorib / Kifayatul Akhyar & Nahwu aplikatif).';
  } else if (iLevel === 'Cakap') {
    kitabRec = 'Halaqah Kitab Standar (Safinatun Najah / Mabadi Fiqhiyah).';
  }

  // Dorm recommendations
  let asramaRec = 'Pemantauan adaptasi rutin minggu 1-4 oleh musyrif asrama.';
  if (boarding.level === 'Rendah') {
    asramaRec =
      'Pendampingan intensif musyrif/wali asrama, fasilitasi teman sebaya (peer buddy), dan adaptasi budaya bertahap.';
  } else if (boarding.level === 'Siap') {
    asramaRec =
      'Kesiapan mandiri sangat baik; dapat dilibatkan sebagai penggerak kekeluargaan di kamar santri baru.';
  }

  const catatanKhusus: string[] = [];
  if (mondokHistory.toLowerCase().includes('belum')) {
    catatanKhusus.push(
      'Latar belakang belum pernah mondok: Nilai Dasar pada Kitab/Bahasa Arab adalah wajar dan memerlukan matrikulasi ramah, bukan indikasi potensi rendah.'
    );
  }
  if (boarding.hasMotivationFlag) {
    catatanKhusus.push(
      'Flag Motivasi (K11 ≤ 2): Perlunya ruang dialog santai mengenai cita-cita dan harapan di pesantren.'
    );
  }

  return {
    akademik: {
      literasi: litRec,
      numerasi: numRec,
    },
    bahasa: {
      inggris: ingRec,
      arab: arabRec,
    },
    pesantren: {
      tahsin: tahsinRec,
      tahfiz: tahfizRec,
      kitab: kitabRec,
    },
    asrama: asramaRec,
    catatanKhusus,
  };
}
