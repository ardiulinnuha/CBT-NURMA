/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  ShieldCheck,
  AlertTriangle,
  Heart,
  CheckCircle2,
  FileText,
  User,
  Compass,
  Home,
  BookMarked,
  Activity,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';
import { Student } from '../types';
import { getDifferentiationRecommendations } from '../engine/scoring';

interface StudentProfileSheetProps {
  student: Student;
  role: 'admin' | 'bk';
  onClose: () => void;
}

export const StudentProfileSheet: React.FC<StudentProfileSheetProps> = ({
  student,
  role,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Micro-detail: brief 150ms skeleton transition polish
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 120);
    return () => clearTimeout(timer);
  }, []);

  const recommendations = getDifferentiationRecommendations(
    student.scores,
    student.interestResult,
    student.boardingReadinessResult,
    student.riwayatMondok
  );

  const handlePrint = () => {
    window.print();
  };

  // Color family blue-teal with 3 intensity levels (Dasar paling muda, Mahir pekat - PRD A.9)
  const getLevelBadge = (level: string) => {
    if (level === 'Mahir' || level === 'Siap') {
      return {
        bg: 'bg-[#0071E3] text-white border-transparent',
        label: level,
      };
    }
    if (level === 'Cakap' || level === 'Sedang') {
      return {
        bg: 'bg-[#E0F2FE] dark:bg-sky-950/70 text-[#0284C7] dark:text-[#38BDF8] border-[#BAE6FD] dark:border-sky-800/60 font-semibold',
        label: level,
      };
    }
    // Dasar: soft light blue-teal (No orange!)
    return {
      bg: 'bg-[#F0FDFA] dark:bg-teal-950/50 text-[#0D9488] dark:text-[#5EEAD4] border-[#CCFBF1] dark:border-teal-800/50 font-medium',
      label: level,
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print-modal-container">
      {/* Modal Container: Max-height 90vh, internal scroll, sticky top control bar (PRD A.1) */}
      <div className="bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-[#F5F5F7] w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl border border-[#D2D2D7]/70 dark:border-white/10 flex flex-col overflow-hidden print-modal-card">
        {/* Sticky Modal Top Bar (Hidden in Print) */}
        <div className="sticky top-0 z-20 no-print flex items-center justify-between px-6 py-4 bg-white/95 dark:bg-[#1C1C1E]/95 backdrop-blur-md border-b border-[#D2D2D7]/50 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold bg-black/5 dark:bg-white/10">
              <FileText className="w-4 h-4 text-[#0071E3]" strokeWidth={1.5} />
              <span>
                Profil Murid — {role === 'bk' ? 'Versi Guru BK (Lengkap & Rahasia)' : 'Versi Admin'}
              </span>
            </span>
            {role === 'bk' && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[12px] font-semibold dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/50">
                Data Sensitif Terbuka
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white text-[13px] font-semibold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" strokeWidth={1.5} />
              <span>Cetak / Simpan PDF (A4)</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[#6E6E73] dark:text-[#98989D] transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Scrollable Content Container (All content inside the card borders!) */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6 text-[13px] leading-relaxed">
          {isLoading ? (
            /* Skeleton Loading micro-detail */
            <div className="space-y-6 animate-pulse">
              <div className="h-20 bg-black/5 dark:bg-white/5 rounded-2xl" />
              <div className="grid grid-cols-4 gap-3 h-24 bg-black/5 dark:bg-white/5 rounded-2xl" />
              <div className="grid grid-cols-4 gap-3 h-40 bg-black/5 dark:bg-white/5 rounded-2xl" />
            </div>
          ) : (
            <>
              {/* Header Lembaga (Kop Surat dengan Logo Monogram NU) */}
              <div className="border-b-2 border-[#1D1D1F]/80 dark:border-white/80 pb-4 text-center">
                <div className="flex items-center justify-center gap-3.5 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0071E3] to-[#38B2AC] p-[2px] shrink-0">
                    <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#1C1C1E] flex items-center justify-center font-bold text-sm text-[#0071E3]">
                      NU
                    </div>
                  </div>
                  <div className="text-left">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight uppercase text-[#1D1D1F] dark:text-[#F5F5F7]">
                      Madrasah Aliyah Nurul Ummah Kotagede
                    </h1>
                    <p className="text-[13px] text-[#48484A] dark:text-[#AEAEB2]">
                      Yayasan Pendidikan Bina Putra · Pondok Pesantren Nurul Ummah Kotagede Yogyakarta
                    </p>
                  </div>
                </div>

                <div className="inline-block mt-2 px-3.5 py-1 bg-black/5 dark:bg-white/10 rounded-full text-[13px] font-semibold">
                  Laporan Pemetaan Kompetensi Murid Baru (Asesmen Diagnostik Awal)
                </div>
                <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D] italic mt-1.5">
                  Catatan: Hasil pemetaan ini adalah instrumen diferensiasi pembelajaran, bukan dasar penolakan murid.
                </p>
              </div>

              {/* Bagian 1: Identitas Murid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F5F5F7] dark:bg-white/[0.03] p-4 rounded-2xl border border-[#D2D2D7]/50 dark:border-white/10">
                <div>
                  <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-medium">Nama Lengkap</span>
                  <span className="font-bold text-[14px] text-[#1D1D1F] dark:text-white">{student.nama}</span>
                </div>
                <div>
                  <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-medium">Kode Peserta / JK</span>
                  <span className="font-mono font-bold text-[14px] text-[#1D1D1F] dark:text-white">
                    {student.kodePeserta} ({student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'})
                  </span>
                </div>
                <div>
                  <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-medium">Asal Sekolah</span>
                  <span className="font-semibold text-[13px] text-[#1D1D1F] dark:text-white">{student.asalSekolah}</span>
                </div>
                <div>
                  <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-medium">Riwayat Mondok</span>
                  <span className="font-semibold text-[13px] text-[#1D1D1F] dark:text-white">{student.riwayatMondok}</span>
                </div>
              </div>

              {/* Bagian 2: Peta Kompetensi Modul */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#48484A] dark:text-[#AEAEB2] flex items-center gap-2">
                    <BookMarked className="w-4 h-4 text-[#0071E3]" strokeWidth={1.5} />
                    <span>Peta Kompetensi Modul Akademik & Pesantren</span>
                  </h3>
                  {/* Color Legend (PRD A.9) */}
                  <div className="text-[12px] text-[#6E6E73] dark:text-[#98989D] flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0071E3]">
                      <span className="w-2 h-2 rounded-full bg-[#0071E3]" /> Mahir
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0284C7]">
                      <span className="w-2 h-2 rounded-full bg-[#38B2AC]" /> Cakap
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0D9488]">
                      <span className="w-2 h-2 rounded-full bg-[#7DD3FC]" /> Dasar
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(student.scores).map(([kode, score]) => {
                    const badge = getLevelBadge(score.level);
                    return (
                      <div
                        key={kode}
                        className="p-3 rounded-2xl border border-[#D2D2D7]/60 dark:border-white/10 bg-white dark:bg-white/[0.02]"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-[#0071E3] dark:text-[#0A84FF]">
                            Modul {kode}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <div className="text-[13px] font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
                          {score.modulNama}
                        </div>
                        <div className="mt-1 text-[12px] text-[#6E6E73] dark:text-[#98989D]">
                          {score.persen !== undefined ? (
                            <span>Skor: {score.skorMentah}/{score.skorMaks} ({score.persen}%)</span>
                          ) : score.rerata !== undefined ? (
                            <span>Rerata: {score.rerata.toFixed(2)}/4.00</span>
                          ) : (
                            <span>{score.detailLevel || `Level ${score.level}`}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bagian 3: Minat, Gaya Belajar, dan Kesiapan Asrama */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Minat Modul J */}
                <div className="p-4 rounded-2xl border border-[#D2D2D7]/60 dark:border-white/10 bg-[#F5F5F7]/40 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase text-[#6E6E73] dark:text-[#98989D] mb-1.5">
                    <Compass className="w-4 h-4 text-[#0071E3]" strokeWidth={1.5} />
                    <span>Minat & Peminatan (Modul J)</span>
                  </div>
                  <p className="font-bold text-[15px] text-[#0071E3] dark:text-[#0A84FF]">
                    {student.interestResult.dominant}
                  </p>
                  <p className="text-[13px] text-[#48484A] dark:text-[#AEAEB2] mt-1">
                    Cita-cita: <span className="text-[#1D1D1F] dark:text-white font-semibold">{student.interestResult.citaCita || '-'}</span>
                  </p>
                </div>

                {/* Gaya Belajar VAK Modul K */}
                <div className="p-4 rounded-2xl border border-[#D2D2D7]/60 dark:border-white/10 bg-[#F5F5F7]/40 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase text-[#6E6E73] dark:text-[#98989D] mb-1.5">
                    <User className="w-4 h-4 text-indigo-500" strokeWidth={1.5} />
                    <span>Gaya Belajar (Modul K)</span>
                  </div>
                  <p className="font-bold text-[15px] text-indigo-600 dark:text-indigo-400">
                    {student.learningStyleResult.dominant}
                  </p>
                  <p className="text-[13px] text-[#48484A] dark:text-[#AEAEB2] mt-1">
                    V: {student.learningStyleResult.vak.visual} · A: {student.learningStyleResult.vak.auditory} · K: {student.learningStyleResult.vak.kinesthetic}
                  </p>
                </div>

                {/* Kesiapan Asrama Modul K */}
                <div className="p-4 rounded-2xl border border-[#D2D2D7]/60 dark:border-white/10 bg-[#F5F5F7]/40 dark:bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-[12px] font-bold uppercase text-[#6E6E73] dark:text-[#98989D] mb-1.5">
                    <Home className="w-4 h-4 text-[#248A3D] dark:text-[#30D158]" strokeWidth={1.5} />
                    <span>Kesiapan Asrama</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[15px] text-[#1D1D1F] dark:text-white">
                      {student.boardingReadinessResult.level}
                    </span>
                    <span className="text-[13px] text-[#6E6E73] dark:text-[#98989D]">
                      (Skor {student.boardingReadinessResult.totalScore}/32)
                    </span>
                  </div>
                  {student.boardingReadinessResult.hasMotivationFlag && (
                    <p className="text-[13px] text-amber-700 dark:text-amber-300 font-medium mt-1">
                      • Flag Motivasi (K11 ≤ 2): Perlu eksplorasi niat mandiri santri.
                    </p>
                  )}
                </div>
              </div>

              {/* Bagian 4: Flag & Catatan Penanganan */}
              <div>
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#48484A] dark:text-[#AEAEB2] mb-2.5 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" strokeWidth={1.5} />
                  <span>Flag Pemetaan & Catatan Perhatian</span>
                </h3>

                {student.flags.length === 0 ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 text-[#248A3D] dark:text-[#30D158] text-[13px] flex items-center gap-2 border border-emerald-200/50">
                    <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                    <span>Seluruh indikator adaptasi dan kesiapan berada dalam batas wajar.</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {student.flags.map((flag) => (
                      <div
                        key={flag.id}
                        className={`p-3.5 rounded-2xl text-[13px] border ${
                          flag.tingkat === 'kritis'
                            ? 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900'
                            : flag.tingkat === 'perhatian'
                            ? 'bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900'
                            : 'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{flag.label}</span>
                          <span className="text-[11px] font-semibold uppercase tracking-wider opacity-75">
                            {flag.jenis}
                          </span>
                        </div>
                        <p className="mt-1 font-normal opacity-90 leading-relaxed">{flag.catatan}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bagian 5: KHUSUS GURU BK vs VERSI ADMIN */}
              {role === 'bk' ? (
                <div className="p-5 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800/40 pb-2.5">
                    <div className="flex items-center gap-2 text-purple-800 dark:text-purple-300 font-bold text-[13px] uppercase tracking-wide">
                      <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                      <span>Bagian Rahasia Konseling BK & Kesehatan Santri (UU PDP 27/2022)</span>
                    </div>
                    <span className="text-[12px] text-purple-700 dark:text-purple-300 font-semibold">
                      Hanya terlihat oleh Guru BK
                    </span>
                  </div>

                  {student.psychosocialResult ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
                      <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-purple-100 dark:border-purple-900/30">
                        <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-medium">Skor Kesejahteraan (Modul L)</span>
                        <span className="font-bold text-[14px]">
                          {student.psychosocialResult.totalScore}/24 · Status: {student.psychosocialResult.status}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-white dark:bg-black/40 border border-purple-100 dark:border-purple-900/30 sm:col-span-2">
                        <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-medium">Skrining Keselamatan Kritis (L-K1 / L-K2)</span>
                        {/* Wording fix per PRD A.7: "Dijawab 'tidak' pada L-K1 dan L-K2" */}
                        <span className={`font-semibold ${student.psychosocialResult.isCritical ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-[#248A3D] dark:text-[#30D158]'}`}>
                          {student.psychosocialResult.isCritical
                            ? student.psychosocialResult.criticalReasons.join('; ')
                            : "Dijawab 'tidak' pada L-K1 dan L-K2"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[13px] text-purple-600">Data psikososial belum diisi.</p>
                  )}

                  {student.healthRecord && (
                    <div className="text-[13px] space-y-1.5 pt-1 text-[#1D1D1F] dark:text-[#F5F5F7]">
                      <p>
                        <span className="font-semibold text-[#6E6E73] dark:text-[#98989D]">Alergi:</span> {student.healthRecord.alergi}
                      </p>
                      <p>
                        <span className="font-semibold text-[#6E6E73] dark:text-[#98989D]">Penyakit / Obat Rutin:</span> {student.healthRecord.penyakitKronis} | Obat: {student.healthRecord.obatRutin}
                      </p>
                      <p>
                        <span className="font-semibold text-[#6E6E73] dark:text-[#98989D]">Akomodasi Asrama:</span> {student.healthRecord.akomodasi}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Versi Admin: Note Netral */
                <div className="p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-white/[0.03] text-[13px] text-[#48484A] dark:text-[#AEAEB2] flex items-center justify-between border border-[#D2D2D7]/50 dark:border-white/10">
                  <span className="italic">
                    Catatan: Data psikososial mendalam dan riwayat kesehatan khusus santri diarsipkan secara aman di ruang Bimbingan & Konseling (BK).
                  </span>
                  <span className="font-semibold text-[#1D1D1F] dark:text-white shrink-0 ml-3">
                    Privasi Terlindungi
                  </span>
                </div>
              )}

              {/* Bagian 6: Rekomendasi Diferensiasi Pembelajaran (Bagian 18) */}
              <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#0071E3] dark:text-[#0A84FF] mb-2.5">
                  Rekomendasi Pembelajaran Berdiferensiasi & Penempatan Halaqah
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] leading-relaxed text-[#1D1D1F] dark:text-[#F5F5F7]">
                  <div>
                    <p className="font-bold text-[#0071E3] dark:text-[#0A84FF] mb-1">Akademik & Literasi:</p>
                    <p>• {recommendations.akademik.literasi}</p>
                    <p>• {recommendations.akademik.numerasi}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0071E3] dark:text-[#0A84FF] mb-1">Bahasa & Pengayaan:</p>
                    <p>• {recommendations.bahasa.arab}</p>
                    <p>• {recommendations.bahasa.inggris}</p>
                  </div>
                  <div className="sm:col-span-2 pt-2.5 border-t border-blue-200/60 dark:border-blue-900/60">
                    <p className="font-bold text-[#0071E3] dark:text-[#0A84FF] mb-1">Penempatan Halaqah & Asrama:</p>
                    <p>• <span className="font-semibold">Tahsin & Tahfiz:</span> {recommendations.pesantren.tahsin} | {recommendations.pesantren.tahfiz}</p>
                    <p>• <span className="font-semibold">Kitab Kuning:</span> {recommendations.pesantren.kitab}</p>
                    <p>• <span className="font-semibold">Asrama:</span> {recommendations.asrama}</p>
                  </div>
                </div>
              </div>

              {/* Signature / Footer - Renamed per PRD A.2 */}
              <div className="pt-4 border-t border-[#D2D2D7]/50 dark:border-white/10 flex justify-between items-end text-[13px] text-[#6E6E73] dark:text-[#98989D]">
                <div>
                  <p className="font-semibold text-[#1D1D1F] dark:text-white">MA Nurul Ummah Kotagede</p>
                  <p className="text-[12px]">Dokumen Sah Cetak Sistem Diagnostik</p>
                </div>
                <div className="text-right">
                  <p>Yogyakarta, 26 Oktober 2026</p>
                  <p className="mt-8 font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {role === 'bk' ? 'Koordinator Bimbingan & Konseling' : 'Tim Asesmen MA Nurul Ummah'}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
