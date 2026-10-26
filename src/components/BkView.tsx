/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  HeartHandshake,
  CheckCircle2,
  FileText,
  UserCheck,
  PhoneCall,
  Heart,
  Stethoscope,
  Info,
  Clock,
  Sparkles,
  ShieldCheck,
  Search,
  MessageSquare,
  Users,
} from 'lucide-react';
import { CriticalAlert, Student } from '../types';
import { StudentRepository } from '../services/studentRepository';
import { StudentProfileSheet } from './StudentProfileSheet';

export const BkView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() =>
    StudentRepository.getAllStudents('bk')
  );
  const [alerts, setAlerts] = useState<CriticalAlert[]>(() =>
    StudentRepository.getCriticalAlerts()
  );
  const [selectedStudentForProfile, setSelectedStudentForProfile] =
    useState<Student | null>(null);
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'alert' | 'kesehatan'>('ringkasan');

  const refreshData = () => {
    setStudents(StudentRepository.getAllStudents('bk'));
    setAlerts(StudentRepository.getCriticalAlerts());
  };

  const handleResolveAlert = (alertId: string) => {
    const note =
      actionNotes[alertId] ||
      'Telah dilakukan pendampingan tatap muka hari yang sama bersama wali santri.';
    StudentRepository.resolveCriticalAlert(alertId, note);
    refreshData();
  };

  const highPsychosocialStudents = students.filter(
    (s) => s.psychosocialResult && s.psychosocialResult.totalScore >= 15
  );
  const monitoringStudents = students.filter(
    (s) =>
      s.psychosocialResult &&
      s.psychosocialResult.totalScore >= 9 &&
      s.psychosocialResult.totalScore < 15
  );

  const activeAlerts = alerts.filter((a) => a.status === 'baru');

  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kodePeserta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asalSekolah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D2D2D7]/60 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              Ruang Bimbingan & Konseling (BK)
            </h1>
            <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[13px] font-bold border border-purple-200/60 dark:border-purple-800/40">
              Akses Rahasia Konselor
            </span>
          </div>
          <p className="text-[14px] text-[#48484A] dark:text-[#AEAEB2]">
            Instrumen skrining kesejahteraan emosional (Modul L), rekaman kesehatan asrama, dan pendampingan santri.
          </p>
        </div>
      </div>

      {/* CRITICAL ALERT BANNER (Refined Apple style without garish glow - PRD B.5) */}
      {activeAlerts.length > 0 && (
        <div className="p-6 sm:p-7 rounded-[32px] bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/70 text-[#1D1D1F] dark:text-[#F5F5F7] shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3B30] text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-6 h-6" strokeWidth={1.5} />
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <span className="inline-block px-3 py-0.5 rounded-full bg-[#FF3B30] text-white text-[12px] font-bold uppercase tracking-wider mb-1.5">
                  Alert Kritis — Tindakan Hari yang Sama
                </span>
                <h2 className="text-xl font-bold text-rose-950 dark:text-rose-100">
                  Perhatian Mendesak: Respons Skrining Keselamatan Santri
                </h2>
                <p className="text-[14px] text-rose-900/90 dark:text-rose-200 mt-1">
                  Sistem mendeteksi respons non-negatif pada butir skrining kritis (L-K1 / L-K2). Lakukan penanganan sesuai 4 langkah protokol:
                </p>
              </div>

              {/* Protocol Step Box (Organized as numbered list with icons - PRD B.5) */}
              <div className="p-5 rounded-2xl bg-white/90 dark:bg-black/50 border border-rose-200 dark:border-rose-900/50 space-y-3 text-[13px] leading-relaxed">
                <p className="font-bold text-rose-950 dark:text-rose-200 uppercase text-[12px] tracking-wider">
                  Protokol Eskalasi Hari yang Sama MA Nurul Ummah:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-rose-950 dark:text-rose-100">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30">
                    <span className="w-6 h-6 rounded-full bg-[#FF3B30] text-white font-bold flex items-center justify-center shrink-0 text-[12px]">
                      1
                    </span>
                    <span>Hubungi segera Guru BK / psikolog mitra madrasah untuk temu wicara awal.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30">
                    <span className="w-6 h-6 rounded-full bg-[#FF3B30] text-white font-bold flex items-center justify-center shrink-0 text-[12px]">
                      2
                    </span>
                    <span>Kabari wali santri secara bijak dan hangat tanpa menimbulkan kepanikan.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30">
                    <span className="w-6 h-6 rounded-full bg-[#FF3B30] text-white font-bold flex items-center justify-center shrink-0 text-[12px]">
                      3
                    </span>
                    <span>Temani santri dengan tenang; jangan biarkan santri sendirian dalam situasi tertekan.</span>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/30">
                    <span className="w-6 h-6 rounded-full bg-[#FF3B30] text-white font-bold flex items-center justify-center shrink-0 text-[12px]">
                      4
                    </span>
                    <span>Pendekatan penuh penerimaan, tanpa komentar menghakimi atau menyudutkan.</span>
                  </div>
                </div>
              </div>

              {/* Active Alerts List */}
              <div className="space-y-3 pt-1">
                {activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-4.5 rounded-2xl bg-white dark:bg-[#1C1C1E] border border-rose-300 dark:border-rose-900/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7]">
                          {alert.studentName}
                        </span>
                        <span className="text-[12px] text-[#86868B] font-mono">
                          (Butir {alert.butir})
                        </span>
                        <span className="text-[12px] text-[#86868B]">· {alert.waktu}</span>
                      </div>
                      <p className="text-[13px] text-rose-700 dark:text-rose-400 mt-1 font-semibold">
                        "{alert.jawaban}"
                      </p>
                    </div>

                    <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                      <input
                        type="text"
                        placeholder="Catatan tindak lanjut konselor..."
                        value={actionNotes[alert.id] || ''}
                        onChange={(e) =>
                          setActionNotes({ ...actionNotes, [alert.id]: e.target.value })
                        }
                        className="text-[13px] px-3.5 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-[#F5F5F7] dark:bg-black/30 focus:outline-none focus:ring-2 focus:ring-[#0071E3] w-full sm:w-64"
                      />
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-4.5 py-2.5 rounded-xl bg-[#248A3D] hover:bg-emerald-700 text-white text-[13px] font-bold shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
                      >
                        Tandai Selesai Ditindaklanjuti
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
            <span>Rujukan Konseling (L ≥ 15)</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-500">
              <AlertTriangle className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
            {highPsychosocialStudents.length}
          </div>
          <p className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
            Prioritas pendampingan adaptasi awal
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
            <span>Status Pantau (L = 9–14)</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0071E3]">
              <Clock className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-[#0071E3] dark:text-[#0A84FF]">
            {monitoringStudents.length}
          </div>
          <p className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
            Observasi dinamika di asrama minggu 1-4
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
            <span>Rekaman Kesehatan Asrama</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-[#248A3D]">
              <Stethoscope className="w-4 h-4" strokeWidth={1.5} />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-[#248A3D] dark:text-[#30D158]">
            {students.filter((s) => s.healthRecord?.alergi !== 'Tidak ada.' || s.healthRecord?.penyakitKronis !== 'Tidak ada.').length}
          </div>
          <p className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
            Santri dengan catatan alergi/obat rutin
          </p>
        </div>
      </div>

      {/* Main Psychosocial & Health List - Full Text Wrapping (PRD A.4) */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 sm:p-8 border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Daftar Santri — Layanan Konseling & Kesehatan
            </h2>
            <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">
              Akses khusus hasil psikososial Modul L, catatan medis wali, dan penanganan adaptasi.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" strokeWidth={1.5} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau kode..."
              className="w-full text-[13px] pl-9.5 pr-4 py-2.5 rounded-xl border border-[#D2D2D7] dark:border-white/20 bg-[#F5F5F7] dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredStudents.map((student) => {
            const isHighL =
              student.psychosocialResult &&
              student.psychosocialResult.totalScore >= 15;
            const isCritical = student.psychosocialResult?.isCritical;

            return (
              <div
                key={student.id}
                className={`p-5 sm:p-6 rounded-[24px] border transition-all ${
                  isCritical
                    ? 'border-rose-300 bg-rose-50/50 dark:bg-rose-950/20 dark:border-rose-900/60'
                    : isHighL
                    ? 'border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/60'
                    : 'border-[#D2D2D7]/60 bg-white dark:bg-white/[0.02] dark:border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 flex items-center justify-center font-bold text-[14px] shrink-0">
                      {getInitials(student.nama)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-[16px] text-[#1D1D1F] dark:text-[#F5F5F7]">
                          {student.nama}
                        </h3>
                        <span className="font-mono text-[12px] text-[#6E6E73] dark:text-[#98989D]">
                          ({student.kodePeserta})
                        </span>
                        {isCritical && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FF3B30] text-white text-[11px] font-bold">
                            Alert Kritis
                          </span>
                        )}
                        {isHighL && !isCritical && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[11px] font-bold">
                            Rujuk BK
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">
                        {student.asalSekolah} · {student.riwayatMondok}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStudentForProfile(student)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 hover:bg-purple-200 text-[13px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <FileText className="w-4 h-4" strokeWidth={1.5} />
                      <span>Buka Profil Lengkap (BK)</span>
                    </button>
                  </div>
                </div>

                {/* Specific BK Data Summary - Clean Full Text Wrapping (PRD A.4) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-black/5 dark:border-white/10 text-[13px]">
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/5">
                    <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-semibold mb-1">
                      Kesejahteraan Psikososial (Modul L)
                    </span>
                    <span
                      className={`font-bold text-[14px] ${
                        isHighL
                          ? 'text-amber-700 dark:text-amber-400'
                          : 'text-[#248A3D] dark:text-[#30D158]'
                      }`}
                    >
                      Skor {student.psychosocialResult?.totalScore || 0}/24 (Status: {student.psychosocialResult?.status || 'Belum diisi'})
                    </span>
                    {student.psychosocialResult && (
                      <p className="text-[12px] text-[#6E6E73] dark:text-[#98989D] mt-1 font-medium">
                        {student.psychosocialResult.isCritical
                          ? `Butir kritis aktif: ${student.psychosocialResult.criticalReasons.join('; ')}`
                          : "Dijawab 'tidak' pada L-K1 dan L-K2"}
                      </p>
                    )}
                  </div>

                  {/* Medical info with full wrapping */}
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/5">
                    <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-semibold mb-1">
                      Catatan Medis Wali (Angket A)
                    </span>
                    <div className="text-[13px] text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed">
                      <p><span className="font-semibold text-[#6E6E73] dark:text-[#98989D]">Riwayat:</span> {student.healthRecord?.penyakitKronis || 'Tidak ada riwayat kronis'}</p>
                      <p><span className="font-semibold text-[#6E6E73] dark:text-[#98989D]">Alergi:</span> {student.healthRecord?.alergi || 'Tanpa alergi'}</p>
                      <p><span className="font-semibold text-[#6E6E73] dark:text-[#98989D]">Obat:</span> {student.healthRecord?.obatRutin || 'Tanpa obat rutin'}</p>
                    </div>
                  </div>

                  {/* Accommodations with full wrapping */}
                  <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/5">
                    <span className="text-[12px] text-[#6E6E73] dark:text-[#98989D] block font-semibold mb-1">
                      Kebutuhan Khusus / Akomodasi Asrama
                    </span>
                    <div className="text-[13px] text-[#1D1D1F] dark:text-[#F5F5F7] leading-relaxed">
                      <p><span className="font-semibold text-[#6E6E73] dark:text-[#98989D]">Kebutuhan:</span> {student.healthRecord?.kebutuhanKhusus || 'Standar santri baru'}</p>
                      <p className="mt-1 font-medium text-purple-700 dark:text-purple-300">
                        {student.healthRecord?.akomodasi || 'Fasilitas asrama reguler'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full Student Profile Modal (BK Version) */}
      {selectedStudentForProfile && (
        <StudentProfileSheet
          student={selectedStudentForProfile}
          role="bk"
          onClose={() => setSelectedStudentForProfile(null)}
        />
      )}
    </div>
  );
};
