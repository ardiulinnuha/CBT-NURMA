/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ArrowLeft, RefreshCw, Sun, Moon, Laptop } from 'lucide-react';
import { Role } from '../types';

export type ThemeMode = 'system' | 'light' | 'dark';

interface TopBannerProps {
  currentRole: Role | null;
  onSelectRole: (role: Role | null) => void;
  onResetData?: () => void;
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  isTransitioning?: boolean;
}

export const TopBanner: React.FC<TopBannerProps> = ({
  currentRole,
  onSelectRole,
  onResetData,
  themeMode,
  onThemeChange,
  isTransitioning = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-b border-[#D2D2D7]/60 dark:border-white/10 transition-colors no-print">
      {/* Thin animated top progress bar on role switch */}
      {isTransitioning && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0071E3] to-transparent animate-pulse" />
      )}

      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-[13px]">
        {/* Left: PDP Banner & Philosophy Pill */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-[#0071E3] dark:text-[#0A84FF] font-semibold text-[13px] border border-blue-200/50 dark:border-blue-800/40">
            <ShieldCheck className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span>UU PDP No. 27/2022</span>
          </span>
          <span className="hidden sm:inline text-[#48484A] dark:text-[#AEAEB2] font-medium">
            Data anak = data pribadi. Akses dibatasi sesuai peran.
          </span>
          <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#248A3D] dark:text-[#30D158] font-semibold text-[13px] border border-emerald-200/50 dark:border-emerald-800/40">
            Pemetaan, bukan seleksi
          </span>
        </div>

        {/* Right: Role Navigation, Theme Switcher, & Reset */}
        <div className="flex items-center gap-2">
          {/* Theme Selector (Terang / Gelap / Otomatis) */}
          <div className="flex items-center p-1 rounded-xl bg-black/5 dark:bg-white/10 border border-[#D2D2D7]/40 dark:border-white/10">
            <button
              onClick={() => onThemeChange('light')}
              title="Mode Terang"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white dark:bg-white/20 text-[#0071E3] shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
              aria-label="Mode Terang"
            >
              <Sun className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => onThemeChange('dark')}
              title="Mode Gelap"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-white dark:bg-white/20 text-[#0A84FF] shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
              aria-label="Mode Gelap"
            >
              <Moon className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => onThemeChange('system')}
              title="Otomatis (Sistem)"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-white/20 text-[#0071E3] dark:text-[#0A84FF] shadow-xs'
                  : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
              aria-label="Otomatis mengikuti sistem"
            >
              <Laptop className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>

          {currentRole && (
            <button
              onClick={() => onSelectRole(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium text-[#1D1D1F] dark:text-[#F5F5F7] bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all active:scale-[0.97] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
              <span>
                Ganti Peran ({currentRole === 'murid' ? 'Murid' : currentRole === 'admin' ? 'Admin' : 'Guru BK'})
              </span>
            </button>
          )}

          {onResetData && (
            <button
              onClick={onResetData}
              title="Kembalikan data simulasi ke awal"
              className="p-2 rounded-xl text-[#6E6E73] dark:text-[#98989D] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Reset data simulasi"
            >
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
