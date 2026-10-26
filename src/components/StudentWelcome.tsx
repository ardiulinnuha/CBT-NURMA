/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Calculator,
  PenTool,
  Globe,
  Languages,
  Compass,
  Heart,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Coffee,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Student } from '../types';
import { ACTIVITIES_DAY_1, ACTIVITIES_DAY_2 } from '../data/dummyStudents';
import { DeviceTip } from './DeviceTip';
import { StudentRepository } from '../services/studentRepository';

interface StudentWelcomeProps {
  onBackToRoles: () => void;
}

export const StudentWelcome: React.FC<StudentWelcomeProps> = () => {
  const [inputCode, setInputCode] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [consentError, setConsentError] = useState<boolean>(false);
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const activeDay = StudentRepository.getActiveDay();
  const activities = activeDay === 1 ? ACTIVITIES_DAY_1 : ACTIVITIES_DAY_2;

  const handleVerifyCode = (codeToVerify?: string) => {
    const code = (codeToVerify || inputCode).trim().toUpperCase();
    setCodeError(null);
    setConsentError(false);

    if (!code) {
      setCodeError('Silakan masukkan kode peserta terlebih dahulu.');
      return;
    }

    const student = StudentRepository.getStudentByCode(code, 'murid');
    if (!student) {
      setCodeError('Kode peserta tidak ditemukan. Pastikan format sesuai (contoh: NU-2026-001).');
      setCurrentStudent(null);
      return;
    }

    if (!student.persetujuanWali) {
      setConsentError(true);
      setCurrentStudent(student);
      return;
    }

    // Record device description as neutral note for Admin
    const screenWidth = window.innerWidth;
    const deviceDesc =
      screenWidth < 768
        ? `HP / Ponsel (${screenWidth}x${window.innerHeight})`
        : screenWidth < 1024
        ? `Tablet (${screenWidth}x${window.innerHeight})`
        : `Laptop / Komputer (${screenWidth}x${window.innerHeight})`;
    StudentRepository.recordDevice(student.id, deviceDesc);

    setCurrentStudent(student);
  };

  const handleQuickSelect = (code: string) => {
    setInputCode(code);
    handleVerifyCode(code);
  };

  const handleStartSession = () => {
    if (!currentStudent || !hasReadInstructions) return;
    StudentRepository.markSessionStarted(currentStudent.id);
    setHasStarted(true);
  };

  const handleRequestBreak = () => {
    if (!currentStudent) return;
    StudentRepository.markSessionDelayed(currentStudent.id);
    setIsDelayed(true);
  };

  // Activity Icon Helper
  const getActivityIcon = (code: string, isWithExaminer?: boolean) => {
    if (isWithExaminer) {
      return <Users className="w-5 h-5 text-[#0284C7] dark:text-[#38BDF8]" strokeWidth={1.5} />;
    }
    switch (code) {
      case 'B':
        return <BookOpen className="w-5 h-5 text-[#0071E3] dark:text-[#0A84FF]" strokeWidth={1.5} />;
      case 'C':
        return <Calculator className="w-5 h-5 text-indigo-500" strokeWidth={1.5} />;
      case 'N':
        return <PenTool className="w-5 h-5 text-[#248A3D] dark:text-[#30D158]" strokeWidth={1.5} />;
      case 'D':
        return <Globe className="w-5 h-5 text-sky-500" strokeWidth={1.5} />;
      case 'E':
        return <Languages className="w-5 h-5 text-teal-600 dark:text-teal-400" strokeWidth={1.5} />;
      case 'H':
        return <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" strokeWidth={1.5} />;
      case 'J':
        return <Compass className="w-5 h-5 text-[#0071E3]" strokeWidth={1.5} />;
      case 'K':
        return <Heart className="w-5 h-5 text-rose-500" strokeWidth={1.5} />;
      case 'L':
        return <HelpCircle className="w-5 h-5 text-purple-500" strokeWidth={1.5} />;
      default:
        return <Users className="w-5 h-5 text-slate-500" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
      {/* Device Tip for Mobile screens (< 768px) */}
      <DeviceTip moduleContext="welcome" />

      {/* Code Input Card if not logged in */}
      {!currentStudent ? (
        <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl rounded-[32px] p-7 sm:p-10 border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-50/80 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/40 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center mx-auto mb-5">
            <BookOpen className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2.5">
            Masuk Peserta Tes
          </h2>
          <p className="text-[14px] text-[#48484A] dark:text-[#AEAEB2] mb-7 leading-relaxed">
            Ketikkan kode peserta yang tercantum pada kartu peserta tes madrasah kamu.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerifyCode();
            }}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Contoh: NU-2026-001"
                className="w-full text-center tracking-widest uppercase font-mono text-xl font-bold px-5 py-4 rounded-2xl border border-[#D2D2D7] dark:border-white/20 bg-[#F5F5F7] dark:bg-black/40 text-[#1D1D1F] dark:text-[#F5F5F7] focus:outline-none focus:ring-2 focus:ring-[#0071E3] transition-all shadow-inner"
              />
              {codeError && (
                <p className="mt-2.5 text-[13px] text-rose-500 flex items-center justify-center gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{codeError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-[52px] rounded-2xl bg-[#0071E3] dark:bg-[#0A84FF] text-white font-semibold text-base shadow-sm hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer"
            >
              Lanjutkan
            </button>
          </form>

          {/* Quick simulation helper chips including NU-2026-004 per PRD A.6 */}
          <div className="mt-8 pt-6 border-t border-[#D2D2D7]/50 dark:border-white/10 text-left">
            <p className="text-[13px] font-semibold text-[#48484A] dark:text-[#AEAEB2] mb-3">
              Pilih kode contoh untuk uji coba cepat:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px]">
              <button
                type="button"
                onClick={() => handleQuickSelect('NU-2026-001')}
                className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-[#0071E3] font-mono text-left transition-all cursor-pointer"
              >
                <span className="font-bold block">NU-2026-001</span>
                <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">Ahmad Fauzi (MTs Pondok)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('NU-2026-002')}
                className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-[#0071E3] font-mono text-left transition-all cursor-pointer"
              >
                <span className="font-bold block">NU-2026-002</span>
                <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">Nurul Aisyah (MTs Umum)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('NU-2026-003')}
                className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-[#0071E3] font-mono text-left transition-all cursor-pointer"
              >
                <span className="font-bold block">NU-2026-003</span>
                <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">Bima Pratama (SMP)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('NU-2026-004')}
                className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 font-mono text-left transition-all cursor-pointer"
              >
                <span className="font-bold block">NU-2026-004</span>
                <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">Zahra (Kasus Kritis BK)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickSelect('NU-2026-005')}
                className="p-2.5 sm:col-span-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 font-mono text-left transition-all cursor-pointer"
                title="Persetujuan wali belum terkonfirmasi"
              >
                <span className="font-bold block">NU-2026-005</span>
                <span className="text-[12px] text-rose-600 dark:text-rose-400">Muhammad Rizky (Persetujuan Wali Belum Dicentang)</span>
              </button>
            </div>
          </div>
        </div>
      ) : consentError ? (
        /* Blocked Screen: Guardian Consent Missing */
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-8 sm:p-10 border border-amber-200 dark:border-amber-900/50 shadow-sm text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-[#FF9F0A] flex items-center justify-center mx-auto mb-4 border border-amber-200/50">
            <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2.5">
            Persetujuan Wali Belum Terkonfirmasi
          </h2>
          <p className="text-[14px] text-[#48484A] dark:text-[#AEAEB2] leading-relaxed mb-6">
            Halo <span className="font-semibold text-[#1D1D1F] dark:text-white">{currentStudent.nama}</span>. Sesuai ketentuan perlindungan data anak (UU PDP No. 27/2022), tes diagnostik hanya dapat dimulai setelah surat persetujuan wali diverifikasi oleh madrasah.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-[13px] text-left mb-6 leading-relaxed border border-amber-200/50 dark:border-amber-900/40">
            Silakan hubungi ustaz/ustazah di meja administrasi untuk memverifikasi persetujuan wali agar kodemu aktif.
          </div>
          <button
            onClick={() => {
              setCurrentStudent(null);
              setConsentError(false);
            }}
            className="w-full h-[50px] rounded-2xl bg-black/5 dark:bg-white/10 text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold text-[14px] hover:bg-black/10 transition-all cursor-pointer"
          >
            Kembali ke Halaman Masuk
          </button>
        </div>
      ) : isDelayed ? (
        /* Delayed Break Confirmation Screen */
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-8 sm:p-10 border border-[#D2D2D7]/60 dark:border-white/10 shadow-sm text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-[#FF9F0A] flex items-center justify-center mx-auto mb-4 border border-amber-200/50">
            <Coffee className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2.5">
            Sesi Ditunda untuk Istirahat
          </h2>
          <p className="text-[14px] text-[#48484A] dark:text-[#AEAEB2] leading-relaxed mb-6">
            Terima kasih sudah memberitahu, <span className="font-semibold">{currentStudent.nama}</span>. Status pengerjaanmu telah tercatat di panitia. Silakan beristirahat sejenak dan lapor ke pengawas bila sudah siap kembali.
          </p>
          <button
            onClick={() => setIsDelayed(false)}
            className="px-7 py-3.5 rounded-2xl bg-[#0071E3] text-white text-[14px] font-semibold hover:brightness-105 transition-all cursor-pointer"
          >
            Aku Sudah Siap Lanjut
          </button>
        </div>
      ) : hasStarted ? (
        /* Layar "Sesi Tes Dimulai" - Honest demo placeholder per PRD A.3 */
        <div className="bg-white dark:bg-[#1C1C1E] rounded-[32px] p-8 sm:p-10 border border-blue-200 dark:border-blue-900/50 shadow-md text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0071E3] dark:text-[#0A84FF] text-[13px] font-semibold mb-4 border border-blue-200/60">
            <Info className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>Mode Demo (Iterasi 1)</span>
          </div>

          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-[#0071E3] flex items-center justify-center mx-auto mb-4 border border-blue-200/50">
            <Clock className="w-8 h-8" strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-2.5">
            Pengerjaan Soal Tersedia di Iterasi Berikutnya
          </h2>

          <p className="text-[14px] text-[#48484A] dark:text-[#AEAEB2] leading-relaxed mb-5">
            Halo <span className="font-semibold text-[#1D1D1F] dark:text-white">{currentStudent.nama}</span>. Pada tahap uji coba awal ini, alur sambutan dan kesiapan tes telah diverifikasi dengan sukses. Antarmuka pengerjaan soal interaktif (Modul B, C, D, E, H, N) akan dibuka pada tahap implementasi berikutnya.
          </p>

          <div className="p-4 rounded-2xl bg-[#F5F5F7] dark:bg-black/40 text-[13px] text-[#48484A] dark:text-[#AEAEB2] text-left mb-6 space-y-1.5 border border-[#D2D2D7]/50 dark:border-white/10">
            <p>• Kode Peserta: <span className="font-mono font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">{currentStudent.kodePeserta}</span></p>
            <p>• Hari Tes Aktif: Hari {activeDay}</p>
            <p>• Asal Sekolah: {currentStudent.asalSekolah} ({currentStudent.riwayatMondok})</p>
          </div>

          <button
            onClick={() => {
              setHasStarted(false);
              setCurrentStudent(null);
            }}
            className="px-6 py-3 rounded-2xl bg-[#0071E3] text-white text-[14px] font-semibold hover:brightness-105 transition-all cursor-pointer"
          >
            Kembali ke Halaman Sambutan
          </button>
        </div>
      ) : (
        /* Welcome Screen (Layar Sambutan Ramah) - 2 Columns on Desktop */
        <div className="space-y-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 Cols): Greeting, Student identity, Duration Ring, Notes */}
            <div className="lg:col-span-5 space-y-5">
              {/* Greeting Card */}
              <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-7 border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0071E3] dark:text-[#0A84FF] text-[13px] font-semibold border border-blue-200/50">
                    Hari {activeDay} · Peserta Terdaftar
                  </span>
                  <span className="text-[13px] text-[#6E6E73] dark:text-[#98989D] font-mono font-semibold">
                    {currentStudent.kodePeserta}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mb-3">
                  Halo, {currentStudent.nama}!
                </h2>
                <p className="text-[14px] text-[#48484A] dark:text-[#AEAEB2] leading-relaxed">
                  Selamat datang di MA Nurul Ummah. Hari ini kamu akan mengerjakan beberapa kegiatan supaya madrasah bisa mengenal kemampuanmu dan membantumu belajar dengan cara yang paling cocok. <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">Ini BUKAN seleksi</span>, jadi tidak perlu takut. Kerjakan sebaik kemampuanmu, dan boleh bertanya kalau ada yang kurang jelas.
                </p>

                <div className="mt-4 pt-4 border-t border-[#D2D2D7]/40 dark:border-white/10 flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D]">
                  <span>Asal: {currentStudent.asalSekolah}</span>
                  <span>{currentStudent.riwayatMondok}</span>
                </div>
              </div>

              {/* Duration Progress Ring Card */}
              <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl rounded-[28px] p-6 border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex items-center gap-5">
                <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-black/5 dark:text-white/10"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#0071E3] dark:text-[#0A84FF]"
                      strokeDasharray="100, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <Clock className="w-7 h-7 text-[#0071E3] dark:text-[#0A84FF] absolute" strokeWidth={1.5} />
                </div>
                <div>
                  <span className="text-[12px] font-bold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] block mb-1">
                    Estimasi Waktu Hari Ini
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {activeDay === 1 ? '±2 jam 45 menit' : '±75 menit'}
                  </div>
                  <span className="text-[13px] text-[#48484A] dark:text-[#AEAEB2] mt-0.5 block">
                    {activeDay === 1 ? 'Termasuk istirahat 15 menit' : '28 mnt gawai + stasiun praktik'}
                  </span>
                </div>
              </div>

              {/* Three Key Reminders */}
              <div className="bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl rounded-[28px] p-6 border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-3">
                <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D] mb-1">
                  Catatan Penting
                </h4>
                <div className="space-y-2.5 text-[13px] text-[#48484A] dark:text-[#AEAEB2]">
                  <div className="p-3 rounded-2xl bg-[#F5F5F7] dark:bg-white/[0.04] flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#0071E3] shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>Timer akan terlihat menempel di bagian atas layar selama mengerjakan</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F5F7] dark:bg-white/[0.04] flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#248A3D] dark:text-[#30D158] shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>Jawaban tidak dapat diubah setelah modul dikirim</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#F5F5F7] dark:bg-white/[0.04] flex items-start gap-3">
                    <Heart className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                    <span>Kamu tidak akan melihat nilai di layar ini</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): Vertical Activity Timeline */}
            <div className="lg:col-span-7 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-xl rounded-[28px] p-6 sm:p-7 border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between pb-4 border-b border-[#D2D2D7]/40 dark:border-white/10 mb-5">
                <div>
                  <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Linimasa Kegiatan Hari {activeDay}
                  </h3>
                  <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">
                    Modul dikerjakan berurutan sesuai alur sesi
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  {activities.length} Kegiatan
                </span>
              </div>

              <div className="space-y-3.5">
                {activities.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`relative flex items-center justify-between p-4 sm:p-4.5 rounded-2xl border transition-all ${
                      item.isWithExaminer
                        ? 'bg-[#F5F5F7]/40 dark:bg-white/[0.02] border-dashed border-[#D2D2D7] dark:border-white/20'
                        : 'bg-white dark:bg-white/[0.03] border-[#D2D2D7]/60 dark:border-white/10 hover:border-[#0071E3]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center shrink-0">
                        {getActivityIcon(item.code, item.isWithExaminer)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[12px] font-mono font-bold text-[#0071E3] dark:text-[#0A84FF]">
                            Modul {item.code}
                          </span>
                          <h4 className="text-[15px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                            {item.title}
                          </h4>
                          {item.isWithExaminer && (
                            <span className="px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0284C7] dark:text-[#38BDF8] text-[12px] font-medium border border-sky-200/50">
                              Dengan penguji
                            </span>
                          )}
                        </div>
                        <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <span className="inline-block text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10">
                        {item.durationMinutes} menit
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Break Note for Day 1 */}
              {activeDay === 1 && (
                <div className="mt-5 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-center gap-3 text-[13px] text-[#0071E3] dark:text-[#0A84FF] font-medium leading-relaxed">
                  <Coffee className="w-5 h-5 shrink-0" strokeWidth={1.5} />
                  <span>
                    Setelah Sesi 1 (90 menit: Literasi, Numerasi, Menulis), ada jeda istirahat 15 menit dengan hitung mundur sebelum masuk ke Sesi 2.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Action Bar per PRD B.2 so user doesn't need to scroll down */}
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-[#D2D2D7]/70 dark:border-white/10 p-3 sm:p-4 shadow-[0_-8px_32px_rgba(0,0,0,0.06)] no-print">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Checkbox Agreement */}
              <label className="flex items-center gap-3 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={hasReadInstructions}
                  onChange={(e) => setHasReadInstructions(e.target.checked)}
                  className="w-5 h-5 rounded-lg text-[#0071E3] focus:ring-[#0071E3] border-[#D2D2D7] dark:border-white/20 cursor-pointer"
                />
                <span className="text-[14px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Aku sudah membaca petunjuk di atas
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleRequestBreak}
                  className="px-4 sm:px-5 h-12 rounded-2xl bg-black/5 dark:bg-white/10 text-[13px] sm:text-[14px] font-semibold text-[#48484A] dark:text-[#AEAEB2] hover:bg-black/10 transition-all cursor-pointer whitespace-nowrap active:scale-[0.97]"
                >
                  Aku perlu istirahat
                </button>

                <button
                  type="button"
                  onClick={handleStartSession}
                  disabled={!hasReadInstructions}
                  className={`flex-1 sm:flex-initial px-7 h-12 rounded-2xl font-bold text-[14px] sm:text-[15px] transition-all flex items-center justify-center gap-2 ${
                    hasReadInstructions
                      ? 'bg-[#0071E3] dark:bg-[#0A84FF] text-white hover:brightness-105 active:scale-[0.97] shadow-sm cursor-pointer'
                      : 'bg-[#D2D2D7]/50 dark:bg-white/10 text-[#86868B] dark:text-[#6E6E73] cursor-not-allowed'
                  }`}
                >
                  <span>Aku siap, mulai!</span>
                  <ChevronRight className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
