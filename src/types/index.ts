/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'murid' | 'admin' | 'bk';

export type AcademicLevel = 'Dasar' | 'Cakap' | 'Mahir';
export type TahfizLevel = 'G0' | 'G1' | 'G2' | 'G3' | 'G4';

export interface ModuleScore {
  modulKode: string; // 'B' | 'C' | 'D' | 'E' | 'H' | 'N' | 'F' | 'G' | 'I' | 'M'
  modulNama: string;
  skorMentah: number;
  skorMaks: number;
  persen?: number;
  rerata?: number;
  level: AcademicLevel | TahfizLevel;
  statusKoreksi: 'otomatis' | 'antrean' | 'manual';
  detailLevel?: string;
  kelancaran?: number; // For Modul G (1-4)
}

export interface InterestResult {
  scores: {
    IPA: number;
    IPS: number;
    Bahasa: number;
    Keagamaan: number;
  };
  dominant: string;
  isMixed: boolean;
  citaCita?: string;
  profesiImpian?: string[];
  rencanaSetelahLulus?: string;
}

export interface LearningStyleResult {
  vak: {
    visual: number;
    auditory: number;
    kinesthetic: number;
  };
  dominant: 'Visual' | 'Auditori' | 'Kinestetik' | 'Campuran';
  isMixed: boolean;
}

export interface BoardingReadinessResult {
  totalScore: number; // K7 - K14
  level: 'Rendah' | 'Sedang' | 'Siap';
  k11Score: number;
  hasMotivationFlag: boolean;
}

export interface PsychosocialResult {
  totalScore: number; // 0 - 24
  status: 'Normal' | 'Pantau' | 'Rujuk BK';
  lk1Answer: string;
  lk2Answer: string;
  isCritical: boolean;
  criticalReasons: string[];
}

export interface StudentFlag {
  id: string;
  jenis: 'psikososial' | 'literasi' | 'numerasi' | 'kesehatan' | 'motivasi' | 'adaptasi';
  label: string;
  catatan: string;
  visibleTo: 'admin' | 'bk';
  tingkat: 'info' | 'perhatian' | 'kritis';
}

export interface CriticalAlert {
  id: string;
  studentId: string;
  studentName: string;
  butir: 'L-K1' | 'L-K2';
  pertanyaan: string;
  jawaban: string;
  waktu: string;
  status: 'baru' | 'ditindaklanjuti';
  catatanBK?: string;
}

export interface HealthRecord {
  studentId: string;
  alergi: string;
  penyakitKronis: string;
  obatRutin: string;
  kebutuhanKhusus: string;
  akomodasi: string;
}

export interface Student {
  id: string;
  nama: string;
  jenisKelamin: 'L' | 'P';
  asalSekolah: string;
  riwayatMondok: string;
  persetujuanWali: boolean;
  kodePeserta: string;
  hariAktif: 1 | 2;
  statusSesi: 'belum' | 'sedang' | 'selesai' | 'ditunda';
  jenisPerangkat?: string;
  catatanWali?: string;
  scores: Record<string, ModuleScore>;
  interestResult: InterestResult;
  learningStyleResult: LearningStyleResult;
  boardingReadinessResult: BoardingReadinessResult;
  psychosocialResult?: PsychosocialResult; // Sensitive: only visible to BK!
  flags: StudentFlag[];
  healthRecord?: HealthRecord; // Only loaded/displayed in BK role
}

export interface DifferentiationRecommendation {
  akademik: {
    literasi: string;
    numerasi: string;
  };
  bahasa: {
    inggris: string;
    arab: string;
  };
  pesantren: {
    tahsin: string;
    tahfiz: string;
    kitab: string;
  };
  asrama: string;
  catatanKhusus: string[];
}

export interface ActivityCardItem {
  id: string;
  code: string;
  title: string;
  description: string;
  durationMinutes: number;
  session: 1 | 2;
  day: 1 | 2;
  status: 'belum' | 'sedang' | 'selesai';
  isWithExaminer?: boolean;
}
