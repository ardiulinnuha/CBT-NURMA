/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Coffee,
  Calendar,
  FileText,
  AlertCircle,
  Sparkles,
  Printer,
  Compass,
  AlertTriangle,
  PlayCircle,
  LayoutDashboard,
  UserCheck,
  Settings,
  Search,
} from 'lucide-react';
import { Student } from '../types';
import { StudentRepository } from '../services/studentRepository';
import { StudentProfileSheet } from './StudentProfileSheet';

export const AdminView: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() =>
    StudentRepository.getAllStudents('admin')
  );
  const [activeDay, setActiveDay] = useState<1 | 2>(() =>
    StudentRepository.getActiveDay()
  );
  const [selectedStudentForProfile, setSelectedStudentForProfile] =
    useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'murid' | 'pengaturan'>('dashboard');

  const refreshStudents = () => {
    setStudents(StudentRepository.getAllStudents('admin'));
  };

  const handleToggleConsent = (studentId: string, currentStatus: boolean) => {
    StudentRepository.updateGuardianConsent(studentId, !currentStatus);
    refreshStudents();
  };

  const handleToggleDay = (day: 1 | 2) => {
    StudentRepository.setActiveDay(day);
    setActiveDay(day);
  };

  // Dashboard calculations - Separated "Sedang mengerjakan" and "Belum tes" (PRD A.8)
  const totalRegistered = students.length;
  const totalCompleted = students.filter((s) => s.statusSesi === 'selesai').length;
  const totalInProgress = students.filter((s) => s.statusSesi === 'sedang').length;
  const totalPending = students.filter((s) => s.statusSesi === 'belum').length;
  const totalDelayed = students.filter((s) => s.statusSesi === 'ditunda').length;

  // Level Distribution aggregation without ranking (PRD A.9: Blue-teal family)
  const levelDistribution = {
    B: { Dasar: 0, Cakap: 0, Mahir: 0 },
    C: { Dasar: 0, Cakap: 0, Mahir: 0 },
    D: { Dasar: 0, Cakap: 0, Mahir: 0 },
    E: { Dasar: 0, Cakap: 0, Mahir: 0 },
    H: { Dasar: 0, Cakap: 0, Mahir: 0 },
  };

  students.forEach((student) => {
    (['B', 'C', 'D', 'E', 'H'] as const).forEach((mod) => {
      const lvl = student.scores[mod]?.level as 'Dasar' | 'Cakap' | 'Mahir';
      if (lvl && levelDistribution[mod][lvl] !== undefined) {
        levelDistribution[mod][lvl]++;
      }
    });
  });

  // Interest Distribution
  const interestCount: Record<string, number> = {};
  students.forEach((s) => {
    const dom = s.interestResult?.dominant || 'Belum diisi';
    interestCount[dom] = (interestCount[dom] || 0) + 1;
  });

  // Filtered Students List
  const filteredStudents = students.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kodePeserta.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.asalSekolah.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Soft avatar color helper
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
      'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
      'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300',
      'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
      'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      {/* Top Header - Renamed strictly to "Dashboard Admin" (PRD A.2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D2D2D7]/60 dark:border-white/10 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              Dashboard Admin
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#0071E3] dark:text-[#0A84FF] text-[13px] font-semibold border border-blue-200/60 dark:border-blue-900/40">
              Soal demo
            </span>
          </div>
          <p className="text-[14px] text-[#48484A] dark:text-[#AEAEB2]">
            Pemetaan kompetensi murid baru MA Nurul Ummah · Bukan dasar penolakan murid
          </p>
        </div>

        {/* Day Switcher */}
        <div className="flex items-center gap-2 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#D2D2D7]/70 dark:border-white/10 shadow-xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-[#0071E3] ml-2 shrink-0" strokeWidth={1.5} />
          <span className="text-[13px] font-semibold text-[#48484A] dark:text-[#AEAEB2] mr-1">
            Hari Aktif:
          </span>
          <button
            onClick={() => handleToggleDay(1)}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              activeDay === 1
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            Hari 1 (Tertulis)
          </button>
          <button
            onClick={() => handleToggleDay(2)}
            className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
              activeDay === 2
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            Hari 2 (Angket & Praktik)
          </button>
        </div>
      </div>

      {/* Main Layout: Desktop Glass Sidebar + Content Area (PRD B.4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (3 cols) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-20 bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-xl rounded-[28px] p-4 border border-[#D2D2D7]/70 dark:border-white/10 shadow-xs space-y-1.5">
          <div className="px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-[#6E6E73] dark:text-[#98989D]">
            Menu Navigasi
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>Ringkasan Asesmen</span>
          </button>
          <button
            onClick={() => setActiveTab('murid')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] font-semibold transition-all cursor-pointer ${
              activeTab === 'murid'
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>Daftar Murid ({students.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pengaturan')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[14px] font-semibold transition-all cursor-pointer ${
              activeTab === 'pengaturan'
                ? 'bg-[#0071E3] text-white shadow-xs'
                : 'text-[#1D1D1F] dark:text-[#F5F5F7] hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>Pengaturan Hari & Izin</span>
          </button>

          {/* Policy Box in Sidebar */}
          <div className="mt-6 p-4 rounded-2xl bg-[#F5F5F7] dark:bg-black/30 border border-[#D2D2D7]/50 dark:border-white/10 text-[12px] text-[#48484A] dark:text-[#AEAEB2] leading-relaxed">
            <span className="font-bold text-[#1D1D1F] dark:text-white block mb-1">
              Prinsip Perlindungan Data
            </span>
            Admin tidak memiliki akses terhadap Modul L dan data kesehatan sensitif sesuai amanat UU PDP 27/2022.
          </div>
        </div>

        {/* Main Content Area (9 cols on desktop, full on mobile) */}
        <div className="lg:col-span-9 space-y-8 pb-20 lg:pb-0">
          {/* Dashboard Summary: Visible on activeTab === 'dashboard' or on desktop */}
          <div className={`${activeTab !== 'dashboard' ? 'hidden lg:block' : ''} space-y-8`}>
            {/* Bento Grid: Statistics Cards - 5 Cards Separating InProgress & Pending (PRD A.8 & B.3) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
                <span>Terdaftar</span>
                <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#0071E3]">
                  <Users className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                {totalRegistered}
              </div>
              <div className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
                Total calon murid
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
                <span>Selesai</span>
                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-[#248A3D] dark:text-[#30D158]">
                  <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-[#248A3D] dark:text-[#30D158]">
                {totalCompleted}
              </div>
              <div className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
                Terkunci di sistem
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
                <span>Mengerjakan</span>
                <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8]">
                  <PlayCircle className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-[#0284C7] dark:text-[#38BDF8]">
                {totalInProgress}
              </div>
              <div className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
                Sedang aktif tes
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
                <span>Belum Tes</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[#48484A] dark:text-[#AEAEB2]">
                  <Clock className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                {totalPending}
              </div>
              <div className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
                Menunggu giliran
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center justify-between text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-1.5 font-medium">
                <span>Ditunda</span>
                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-[#FF9F0A]">
                  <Coffee className="w-4 h-4" strokeWidth={1.5} />
                </div>
              </div>
              <div className="text-3xl font-bold tracking-tight text-[#FF9F0A]">
                {totalDelayed}
              </div>
              <div className="text-[12px] text-[#86868B] dark:text-[#AEAEB2] mt-1">
                Istirahat santri
              </div>
            </div>
          </div>

          {/* Distribution Overview with Blue-Teal Single Family & Legend (PRD A.9 & B.3) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Academic Level Spread */}
            <div className="p-6 sm:p-7 rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Sebaran Kompetensi Modul
                </h3>
                {/* Legend (PRD A.9) */}
                <div className="text-[12px] text-[#6E6E73] dark:text-[#98989D] flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0071E3]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3]" /> Mahir
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0284C7]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38B2AC]" /> Cakap
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0D9488]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7DD3FC]" /> Dasar
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-5">
                Statistik tanpa perbandingan atau peringkat antar santri.
              </p>

              <div className="space-y-4">
                {[
                  { code: 'B', name: 'Literasi Bahasa Indonesia' },
                  { code: 'C', name: 'Numerasi' },
                  { code: 'D', name: 'Bahasa Inggris' },
                  { code: 'E', name: 'Bahasa Arab (Tulis)' },
                  { code: 'H', name: 'Fikih, Akidah, Akhlak' },
                ].map(({ code, name }) => {
                  const dist = levelDistribution[code as keyof typeof levelDistribution];
                  const total = (dist.Dasar + dist.Cakap + dist.Mahir) || 1;
                  return (
                    <div key={code} className="text-[13px] space-y-1.5">
                      <div className="flex justify-between font-semibold">
                        <span className="text-[#1D1D1F] dark:text-[#F5F5F7]">{name} ({code})</span>
                        <span className="text-[#6E6E73] dark:text-[#98989D] font-mono text-[12px]">
                          {dist.Mahir}M · {dist.Cakap}C · {dist.Dasar}D
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden flex">
                        <div
                          style={{ width: `${(dist.Mahir / total) * 100}%` }}
                          className="bg-[#0071E3] transition-all"
                          title={`Mahir: ${dist.Mahir}`}
                        />
                        <div
                          style={{ width: `${(dist.Cakap / total) * 100}%` }}
                          className="bg-[#38B2AC] transition-all"
                          title={`Cakap: ${dist.Cakap}`}
                        />
                        <div
                          style={{ width: `${(dist.Dasar / total) * 100}%` }}
                          className="bg-[#7DD3FC] transition-all"
                          title={`Dasar: ${dist.Dasar}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interests & Flags */}
            <div className="p-6 sm:p-7 rounded-[28px] bg-white dark:bg-[#1C1C1E] border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-1">
                  Sebaran Minat & Peminatan (Modul J)
                </h3>
                <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mb-5">
                  Empat rumpun peminatan MA Nurul Ummah
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[13px] mb-6">
                  {Object.entries(interestCount).map(([cluster, count]) => (
                    <div
                      key={cluster}
                      className="p-3 sm:p-3.5 rounded-2xl bg-[#F5F5F7] dark:bg-white/[0.03] border border-[#D2D2D7]/40 dark:border-white/5 flex items-center justify-between gap-2"
                    >
                      <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {cluster}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#0071E3]/10 text-[#0071E3] dark:text-[#0A84FF] font-bold text-[13px] shrink-0">
                        {count} santri
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-[#D2D2D7]/50 dark:border-white/10 text-[13px] text-[#48484A] dark:text-[#AEAEB2] leading-relaxed">
                <span className="font-bold text-[#1D1D1F] dark:text-white block mb-0.5">
                  Batas Akses Peran Admin
                </span>
                Skor Modul L, rekaman kesehatan sensitif, dan butir kritis dikelola khusus oleh Guru BK demi menjaga privasi santri.
              </div>
            </div>
          </div>
        </div>

        {/* Student Management Table Section: Visible on activeTab === 'murid' or on desktop */}
        <div className={`${activeTab !== 'murid' ? 'hidden lg:block' : ''} bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 sm:p-7 border border-[#D2D2D7]/70 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.03)]`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Daftar Murid Baru
              </h2>
                <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">
                  Kelola persetujuan wali dan cetak Profil Murid (Versi Admin)
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#86868B] absolute left-3.5 top-3.5" strokeWidth={1.5} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, kode, sekolah..."
                  className="w-full text-[13px] pl-9.5 pr-4 py-2.5 rounded-xl border border-[#D2D2D7] dark:border-white/20 bg-[#F5F5F7] dark:bg-black/40 focus:outline-none focus:ring-2 focus:ring-[#0071E3]"
                />
              </div>
            </div>

            {/* Desktop Table View - Generous Row Padding, Avatar Initials, Text Wrapping (PRD A.4 & B.3) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="border-b border-[#D2D2D7]/60 dark:border-white/10 text-[#48484A] dark:text-[#AEAEB2] font-bold text-[13px] uppercase tracking-wider">
                    <th className="pb-3.5 px-3">Kode & Nama</th>
                    <th className="pb-3.5 px-3">Asal Sekolah & Riwayat</th>
                    <th className="pb-3.5 px-3 text-center">Persetujuan Wali</th>
                    <th className="pb-3.5 px-3 text-center">Status Sesi</th>
                    <th className="pb-3.5 px-3">Indikator Pemetaan (Lengkap)</th>
                    <th className="pb-3.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D2D2D7]/30 dark:divide-white/5">
                  {filteredStudents.map((student) => {
                    const hasNeutralBkFlag = student.flags.some(
                      (f) => f.label === 'Ada tindak lanjut di BK'
                    );

                    return (
                      <tr key={student.id} className="hover:bg-[#F5F5F7]/60 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-[13px] shrink-0 ${getAvatarColor(
                                student.nama
                              )}`}
                            >
                              {getInitials(student.nama)}
                            </div>
                            <div>
                              <div className="font-bold text-[14px] text-[#1D1D1F] dark:text-[#F5F5F7]">
                                {student.nama}
                              </div>
                              <div className="font-mono text-[12px] text-[#6E6E73] dark:text-[#98989D]">
                                {student.kodePeserta} ({student.jenisKelamin === 'L' ? 'L' : 'P'})
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 text-[#48484A] dark:text-[#AEAEB2]">
                          <div className="text-[#1D1D1F] dark:text-[#F5F5F7] font-semibold">
                            {student.asalSekolah}
                          </div>
                          <div className="text-[12px] text-[#6E6E73] dark:text-[#98989D]">{student.riwayatMondok}</div>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <button
                            onClick={() => handleToggleConsent(student.id, student.persetujuanWali)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                              student.persetujuanWali
                                ? 'bg-emerald-50 text-[#248A3D] dark:bg-emerald-950/40 dark:text-[#30D158] hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100'
                            }`}
                            title="Klik untuk mengubah status izin wali"
                          >
                            {student.persetujuanWali ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                <span>Disetujui</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                                <span>Belum Disetujui</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold capitalize ${
                              student.statusSesi === 'selesai'
                                ? 'bg-emerald-50 text-[#248A3D] dark:bg-emerald-950/40 dark:text-[#30D158]'
                                : student.statusSesi === 'ditunda'
                                ? 'bg-amber-50 text-[#FF9F0A] dark:bg-amber-950/40'
                                : student.statusSesi === 'sedang'
                                ? 'bg-sky-50 text-[#0284C7] dark:bg-sky-950/40'
                                : 'bg-slate-100 text-[#48484A] dark:bg-white/10 dark:text-[#AEAEB2]'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                student.statusSesi === 'selesai'
                                  ? 'bg-[#34C759]'
                                  : student.statusSesi === 'ditunda'
                                  ? 'bg-[#FF9F0A]'
                                  : student.statusSesi === 'sedang'
                                  ? 'bg-[#0284C7]'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span>{student.statusSesi}</span>
                          </span>
                        </td>
                        {/* Indikator Pemetaan: Allowed to wrap multiple lines per PRD A.4 */}
                        <td className="py-4 px-3 max-w-[260px]">
                          <div className="flex flex-col gap-1.5">
                            {hasNeutralBkFlag && (
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 text-[#0071E3] text-[12px] font-semibold dark:bg-blue-950/50 leading-snug border border-blue-200/50">
                                Ada tindak lanjut di BK
                              </span>
                            )}
                            {student.flags
                              .filter((f) => f.label !== 'Ada tindak lanjut di BK')
                              .map((f) => (
                                <span
                                  key={f.id}
                                  className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-[#48484A] text-[12px] font-medium dark:bg-white/10 dark:text-[#AEAEB2] leading-snug border border-slate-200/50 dark:border-white/5"
                                >
                                  {f.label}
                                </span>
                              ))}
                            {student.flags.length === 0 && !hasNeutralBkFlag && (
                              <span className="text-[13px] text-[#6E6E73] dark:text-[#98989D] italic">
                                Sesuai harapan standar
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => setSelectedStudentForProfile(student)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-[13px] transition-all cursor-pointer shadow-xs active:scale-95"
                          >
                            <FileText className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span>Lihat Profil</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View (PRD C) */}
            <div className="md:hidden space-y-3.5">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="p-5 rounded-2xl border border-[#D2D2D7]/60 dark:border-white/10 bg-[#F5F5F7]/40 dark:bg-white/[0.02] space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-[13px] shrink-0 ${getAvatarColor(
                          student.nama
                        )}`}
                      >
                        {getInitials(student.nama)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] text-[#1D1D1F] dark:text-[#F5F5F7]">
                          {student.nama}
                        </h3>
                        <p className="font-mono text-[12px] text-[#6E6E73] dark:text-[#98989D]">
                          {student.kodePeserta} · {student.asalSekolah}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                        student.statusSesi === 'selesai'
                          ? 'bg-emerald-50 text-[#248A3D]'
                          : 'bg-slate-100 text-[#48484A]'
                      }`}
                    >
                      {student.statusSesi}
                    </span>
                  </div>

                  {/* Indicator labels wrapped cleanly */}
                  <div className="space-y-1">
                    {student.flags.map((f) => (
                      <span
                        key={f.id}
                        className="inline-block px-2.5 py-0.5 rounded-lg bg-slate-100 text-[#48484A] text-[12px] font-medium mr-1 mb-1"
                      >
                        {f.label}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#D2D2D7]/40 dark:border-white/10 text-[13px]">
                    <button
                      onClick={() => handleToggleConsent(student.id, student.persetujuanWali)}
                      className={`px-3 py-1.5 rounded-xl font-semibold cursor-pointer ${
                        student.persetujuanWali
                          ? 'bg-emerald-50 text-[#248A3D]'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      Izin: {student.persetujuanWali ? 'Disetujui' : 'Belum'}
                    </button>

                    <button
                      onClick={() => setSelectedStudentForProfile(student)}
                      className="px-4 py-1.5 rounded-xl bg-[#0071E3] text-white font-semibold cursor-pointer"
                    >
                      Buka Profil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Tab View for Mobile */}
          <div className={`${activeTab !== 'pengaturan' ? 'hidden' : 'block lg:hidden'} bg-white dark:bg-[#1C1C1E] rounded-[28px] p-6 border border-[#D2D2D7]/70 dark:border-white/10 shadow-xs space-y-5`}>
            <div>
              <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                Pengaturan Hari Asesmen
              </h2>
              <p className="text-[13px] text-[#6E6E73] dark:text-[#98989D] mt-0.5">
                Pilih hari tes yang sedang aktif untuk dibuka di perangkat murid
              </p>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleToggleDay(1)}
                  className={`p-4 rounded-2xl text-[13px] font-bold border transition-all cursor-pointer text-center ${
                    activeDay === 1
                      ? 'bg-[#0071E3] text-white border-transparent shadow-xs'
                      : 'bg-[#F5F5F7] dark:bg-white/[0.04] text-[#1D1D1F] dark:text-[#F5F5F7] border-[#D2D2D7]/60'
                  }`}
                >
                  Hari 1 (Tertulis)
                </button>
                <button
                  onClick={() => handleToggleDay(2)}
                  className={`p-4 rounded-2xl text-[13px] font-bold border transition-all cursor-pointer text-center ${
                    activeDay === 2
                      ? 'bg-[#0071E3] text-white border-transparent shadow-xs'
                      : 'bg-[#F5F5F7] dark:bg-white/[0.04] text-[#1D1D1F] dark:text-[#F5F5F7] border-[#D2D2D7]/60'
                  }`}
                >
                  Hari 2 (Praktik)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar on HP (PRD B.4) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border-t border-[#D2D2D7]/70 dark:border-white/10 p-2 flex justify-around no-print">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-semibold ${
            activeTab === 'dashboard' ? 'text-[#0071E3]' : 'text-[#6E6E73] dark:text-[#98989D]'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} />
          <span>Ringkasan</span>
        </button>
        <button
          onClick={() => setActiveTab('murid')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-semibold ${
            activeTab === 'murid' ? 'text-[#0071E3]' : 'text-[#6E6E73] dark:text-[#98989D]'
          }`}
        >
          <Users className="w-5 h-5" strokeWidth={1.5} />
          <span>Murid</span>
        </button>
        <button
          onClick={() => setActiveTab('pengaturan')}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-[11px] font-semibold ${
            activeTab === 'pengaturan' ? 'text-[#0071E3]' : 'text-[#6E6E73] dark:text-[#98989D]'
          }`}
        >
          <Settings className="w-5 h-5" strokeWidth={1.5} />
          <span>Pengaturan</span>
        </button>
      </div>

      {/* Student Profile Modal for Admin */}
      {selectedStudentForProfile && (
        <StudentProfileSheet
          student={selectedStudentForProfile}
          role="admin"
          onClose={() => setSelectedStudentForProfile(null)}
        />
      )}
    </div>
  );
};
