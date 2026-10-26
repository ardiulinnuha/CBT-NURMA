/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
  RefreshCw,
  Layers,
  Calendar,
  Clock,
  Info,
  Shield,
} from 'lucide-react';
import { Role } from '../types';
import { ThemeMode } from './TopBanner';

export interface RoleSelectorProps {
  onSelectRole: (role: Role) => void;
  themeMode?: ThemeMode;
  onThemeChange?: (mode: ThemeMode) => void;
  onResetData?: () => void;
}

/**
 * Islamic 8-Pointed Star (Khatam / Girih) Geometric Tessellation
 * With radial edge mask fade-out and pointer parallax (max 8px).
 */
const IslamicStarPattern: React.FC<{
  parallax: { x: number; y: number };
  prefersReducedMotion: boolean;
}> = ({ parallax, prefersReducedMotion }) => {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 35%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 35%, transparent 75%)',
      }}
      aria-hidden="true"
    >
      <div
        className="w-full h-full absolute inset-0 transition-transform duration-200 ease-out"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
        }}
      >
        <svg className="w-full h-full text-[#0071E3] opacity-[0.04] dark:text-white dark:opacity-[0.065]">
          <defs>
            <pattern
              id="khatam-girih-pattern"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              {/* Central 8-Pointed Star (Khatam) */}
              <polygon
                points="40,16 44.59,28.91 56.97,23.03 51.09,35.41 64,40 51.09,44.59 56.97,56.97 44.59,51.09 40,64 35.41,51.09 23.03,56.97 28.91,44.59 16,40 28.91,35.41 23.03,23.03 35.41,28.91"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              {/* Corner Star Points */}
              <polygon
                points="0,0 4.59,8.91 16.97,3.03 11.09,15.41 24,20 11.09,24.59 16.97,36.97 4.59,31.09 0,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              <polygon
                points="80,0 75.41,8.91 63.03,3.03 68.91,15.41 56,20 68.91,24.59 63.03,36.97 75.41,31.09 80,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              <polygon
                points="0,80 4.59,71.09 16.97,76.97 11.09,64.59 24,60 11.09,55.41 16.97,43.03 4.59,48.91 0,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              <polygon
                points="80,80 75.41,71.09 63.03,76.97 68.91,64.59 56,60 68.91,55.41 63.03,43.03 75.41,48.91 80,40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.85"
              />
              {/* Interlacing connecting axes */}
              <line x1="0" y1="40" x2="16" y2="40" stroke="currentColor" strokeWidth="0.75" />
              <line x1="64" y1="40" x2="80" y2="40" stroke="currentColor" strokeWidth="0.75" />
              <line x1="40" y1="0" x2="40" y2="16" stroke="currentColor" strokeWidth="0.75" />
              <line x1="40" y1="64" x2="40" y2="80" stroke="currentColor" strokeWidth="0.75" />
              <line x1="0" y1="0" x2="23" y2="23" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
              <line x1="80" y1="0" x2="57" y2="23" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="23" y2="57" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
              <line x1="80" y1="80" x2="57" y2="57" stroke="currentColor" strokeWidth="0.7" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#khatam-girih-pattern)" />
        </svg>
      </div>
    </div>
  );
};

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  onSelectRole,
  themeMode = 'system',
  onThemeChange,
  onResetData,
}) => {
  const [parallax, setParallax] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Card spotlight coordinate states
  const [spotlightMurid, setSpotlightMurid] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [spotlightAdmin, setSpotlightAdmin] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });
  const [spotlightBk, setSpotlightBk] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });

  // Detect reduced motion and touch devices
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);

    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Parallax on pointer move (clamped to max ±8px)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || isTouchDevice) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = ((clientX / innerWidth) - 0.5) * 16;
      const y = ((clientY / innerHeight) - 0.5) * 16;
      setParallax({
        x: Math.max(-8, Math.min(8, x)),
        y: Math.max(-8, Math.min(8, y)),
      });
    },
    [prefersReducedMotion, isTouchDevice]
  );

  // Spotlight mouse tracking helpers
  const handleCardMouseMove = (
    e: React.MouseEvent<HTMLButtonElement>,
    setSpotlight: React.Dispatch<React.SetStateAction<{ x: number; y: number; opacity: number }>>
  ) => {
    if (prefersReducedMotion || isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  const handleCardMouseLeave = (
    setSpotlight: React.Dispatch<React.SetStateAction<{ x: number; y: number; opacity: number }>>
  ) => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  const cycleTheme = () => {
    if (!onThemeChange) return;
    if (themeMode === 'light') onThemeChange('dark');
    else if (themeMode === 'dark') onThemeChange('system');
    else onThemeChange('light');
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full max-w-full h-[100dvh] max-h-[100dvh] grid grid-rows-[auto_1fr_auto] overflow-hidden no-scrollbar bg-gradient-to-b from-[#FFFFFF] via-[#F8F9FA] to-[#F0F2F5] dark:from-[#000000] dark:via-[#05070E] dark:to-[#0B0F1A] text-[#1D1D1F] dark:text-[#F5F5F7] select-none transition-colors duration-300 pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      {/* 2-3 Animated Ambient Glowing Blur Orbs */}
      <div
        className={`absolute -top-28 left-1/2 -translate-x-1/2 w-[340px] sm:w-[540px] md:w-[680px] h-[300px] sm:h-[460px] md:h-[520px] rounded-full blur-[100px] pointer-events-none z-0 ${
          prefersReducedMotion ? '' : 'animate-orb-1'
        } bg-gradient-to-tr from-blue-400/12 via-teal-400/8 to-transparent dark:from-[#0A84FF]/22 dark:via-[#00C7BE]/15 dark:to-transparent`}
        aria-hidden="true"
      />
      <div
        className={`absolute -bottom-24 -left-20 w-[260px] sm:w-[420px] h-[260px] sm:h-[420px] rounded-full blur-[90px] pointer-events-none z-0 ${
          prefersReducedMotion ? '' : 'animate-orb-2'
        } bg-teal-400/10 dark:bg-[#00C7BE]/14`}
        aria-hidden="true"
      />
      <div
        className={`absolute -bottom-28 -right-20 w-[260px] sm:w-[440px] h-[260px] sm:h-[440px] rounded-full blur-[90px] pointer-events-none z-0 ${
          prefersReducedMotion ? '' : 'animate-orb-3'
        } bg-indigo-400/8 dark:bg-[#5E5CE6]/14`}
        aria-hidden="true"
      />

      {/* Islamic Star Pattern with Parallax & Edge Radial Fade-out */}
      <IslamicStarPattern
        parallax={parallax}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* ========================================================
          ROW 1: HEADER (Ramping ~48px, Transparent, Clean 1 Line)
         ======================================================== */}
      <header className="relative z-20 w-full max-w-full min-h-[44px] sm:h-12 flex items-center border-b border-black/[0.05] dark:border-white/[0.06] bg-transparent backdrop-blur-md shrink-0 px-3 sm:px-6 py-1 sm:py-0">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-2.5 min-w-0">
          {/* Left/Center: Plain text PDP notice without surrounding box or pill */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[12px] sm:text-[13px] text-[#6E6E73] dark:text-[#98989D] min-w-0 flex-1">
            <ShieldCheck
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0071E3] dark:text-[#0A84FF] shrink-0"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <span className="leading-snug text-left line-clamp-2 sm:line-clamp-1">
              Data anak = data pribadi (UU PDP No. 27/2022) · Akses dibatasi sesuai peran
            </span>
          </div>

          {/* Right: Theme Switcher & Reset */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {onThemeChange && (
              <>
                {/* Mobile Single Tap Cycling Theme Button */}
                <button
                  type="button"
                  onClick={cycleTheme}
                  title={`Tema: ${themeMode === 'light' ? 'Terang' : themeMode === 'dark' ? 'Gelap' : 'Otomatis'} (Ketuk untuk ganti)`}
                  className="sm:hidden w-7.5 h-7.5 rounded-xl flex items-center justify-center bg-black/[0.05] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.06] dark:border-white/[0.08] active:scale-95 transition-all cursor-pointer"
                  aria-label="Ganti mode tema"
                >
                  {themeMode === 'light' ? (
                    <Sun className="w-3.5 h-3.5 text-[#0071E3]" strokeWidth={1.75} />
                  ) : themeMode === 'dark' ? (
                    <Moon className="w-3.5 h-3.5 text-[#0A84FF]" strokeWidth={1.75} />
                  ) : (
                    <Laptop className="w-3.5 h-3.5 text-[#6E6E73] dark:text-[#98989D]" strokeWidth={1.75} />
                  )}
                </button>

                {/* Tablet & Desktop 3-Segment Switcher (Compact 32px height) */}
                <div className="hidden sm:flex relative items-center h-8 p-0.5 rounded-xl bg-black/[0.06] dark:bg-white/[0.08] border border-black/[0.05] dark:border-white/[0.08] backdrop-blur-md">
                  {/* Sliding Segment Indicator */}
                  <div
                    className={`absolute top-0.5 bottom-0.5 w-[calc(33.333%-2px)] rounded-lg bg-white dark:bg-white/20 shadow-xs transition-transform duration-250 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                      prefersReducedMotion ? 'transition-none' : ''
                    }`}
                    style={{
                      transform:
                        themeMode === 'light'
                          ? 'translateX(2px)'
                          : themeMode === 'dark'
                          ? 'translateX(calc(100% + 2px))'
                          : 'translateX(calc(200% + 2px))',
                    }}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    onClick={() => onThemeChange('light')}
                    title="Mode Terang"
                    className={`relative z-10 px-2.5 h-full rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      themeMode === 'light'
                        ? 'text-[#0071E3] font-semibold'
                        : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
                    }`}
                    aria-label="Aktifkan Mode Terang"
                  >
                    <Sun className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange('dark')}
                    title="Mode Gelap"
                    className={`relative z-10 px-2.5 h-full rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      themeMode === 'dark'
                        ? 'text-[#0A84FF] font-semibold'
                        : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
                    }`}
                    aria-label="Aktifkan Mode Gelap"
                  >
                    <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onThemeChange('system')}
                    title="Otomatis (Sistem)"
                    className={`relative z-10 px-2.5 h-full rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                      themeMode === 'system'
                        ? 'text-[#0071E3] dark:text-[#0A84FF] font-semibold'
                        : 'text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white'
                    }`}
                    aria-label="Otomatis mengikuti preferensi sistem"
                  >
                    <Laptop className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </button>
                </div>
              </>
            )}

            {onResetData && (
              <button
                type="button"
                onClick={onResetData}
                title="Kembalikan data simulasi ke awal"
                className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-[#6E6E73] dark:text-[#98989D] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                aria-label="Reset data simulasi"
              >
                <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          ROW 2: AREA UTAMA (Vertically Centered Unified Block)
         ======================================================== */}
      <main className="relative z-10 w-full max-w-full flex-1 flex flex-col items-center justify-center px-3 sm:px-6 md:px-8 overflow-y-auto sm:overflow-hidden no-scrollbar min-w-0">
        <div className="w-full max-w-5xl flex flex-col items-center justify-center my-auto py-1 sm:py-2 min-w-0">
          {/* 1. Madrasah Pill (Capsule on mobile without truncate) */}
          <div
            className={`inline-flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-[16px] sm:rounded-full bg-white/85 dark:bg-[#1C1C1E]/85 backdrop-blur-md border border-[#D2D2D7]/70 dark:border-white/10 shadow-2xs mb-1.5 sm:mb-2.5 md:mb-4 max-w-full text-center ${
              prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-2 duration-350'
            }`}
          >
            <div
              className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#0071E3] to-[#38B2AC] flex items-center justify-center text-white font-bold text-[10px] sm:text-[12px] shrink-0 shadow-xs"
              aria-hidden="true"
            >
              NU
            </div>
            <span className="text-[11px] sm:text-[13px] font-semibold text-[#0071E3] dark:text-[#0A84FF] leading-snug">
              Yayasan Pendidikan Bina Putra · Ponpes Nurul Ummah
            </span>
          </div>

          {/* 2. Hero Title (Single line on >=480px, clamp up to 56px, text gradient) */}
          <h1
            className={`w-full font-bold tracking-tight text-center max-[479px]:[text-wrap:balance] min-[480px]:whitespace-nowrap mb-1 sm:mb-2 bg-gradient-to-r from-[#1D1D1F] via-[#2A2D34] to-[#0A3D78] dark:from-white dark:via-[#F5F5F7] dark:to-[#B8D7FF] bg-clip-text text-transparent ${
              prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-3 duration-400 delay-75'
            }`}
            style={{
              fontSize: 'clamp(20px, 4vw, 56px)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Tes Diagnostik MA Nurul Ummah
          </h1>

          {/* 3. Subtitle & Kicker (No truncate, no line-clamp) */}
          <p
            className={`w-full text-[11.5px] xs:text-[12px] sm:text-[14px] md:text-[15.5px] text-[#48484A] dark:text-[#AEAEB2] font-normal leading-snug sm:leading-relaxed text-center max-w-2xl mx-auto mb-0.5 sm:mb-1 px-1 ${
              prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-2 duration-400 delay-150'
            }`}
          >
            Instrumen asesmen awal dan pemetaan potensi santri baru untuk mewujudkan pembelajaran berdiferensiasi terintegrasi pesantren.
          </p>
          <p
            className={`w-full text-[11px] sm:text-[13px] text-[#6E6E73] dark:text-[#98989D] font-medium text-center mb-2 sm:mb-3 md:mb-5 px-1 ${
              prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-2 duration-400 delay-150'
            }`}
          >
            Integrasi Kurikulum Madrasah & Kitab Klasik · Bukan dasar penolakan santri
          </p>

          {/* 4. Four Fact Chips (14 modul, 2 hari, ±4 jam, Pemetaan bukan seleksi) */}
          <div
            className={`grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-4 md:mb-6 max-w-full ${
              prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-2 duration-400 delay-200'
            }`}
          >
            <div className="inline-flex items-center justify-center gap-1.5 h-6.5 sm:h-8 px-2 sm:px-3 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.12] backdrop-blur-md text-[11.5px] sm:text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] shadow-2xs whitespace-nowrap">
              <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0071E3] dark:text-[#0A84FF] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>14 modul</span>
            </div>
            <div className="inline-flex items-center justify-center gap-1.5 h-6.5 sm:h-8 px-2 sm:px-3 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.12] backdrop-blur-md text-[11.5px] sm:text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] shadow-2xs whitespace-nowrap">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-[#30D158] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>2 hari</span>
            </div>
            <div className="inline-flex items-center justify-center gap-1.5 h-6.5 sm:h-8 px-2 sm:px-3 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.12] backdrop-blur-md text-[11.5px] sm:text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] shadow-2xs whitespace-nowrap">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-[#FF9F0A] shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>±4 jam</span>
            </div>
            <div className="inline-flex items-center justify-center gap-1.5 h-6.5 sm:h-8 px-2 sm:px-3 rounded-full bg-white/70 dark:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.12] backdrop-blur-md text-[11.5px] sm:text-[13px] font-medium text-[#1D1D1F] dark:text-[#F5F5F7] shadow-2xs whitespace-nowrap">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shrink-0" aria-hidden="true" />
              <span>Pemetaan, bukan seleksi</span>
            </div>
          </div>

          {/* 5. Role Selection Cards (Seamless glass, zero corner artifacts, clean responsive text) */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1.5 sm:gap-3 md:gap-4.5 lg:gap-5 justify-items-center min-w-0">
            {/* Murid Card */}
            <button
              type="button"
              onClick={() => onSelectRole('murid')}
              onMouseMove={(e) => handleCardMouseMove(e, setSpotlightMurid)}
              onMouseLeave={() => handleCardMouseLeave(setSpotlightMurid)}
              className={`group relative w-full max-w-[380px] min-h-[50px] sm:min-h-[56px] flex flex-row md:flex-col justify-between items-center md:items-start p-2 sm:p-3 md:p-5 lg:p-5.5 rounded-[18px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-[20px] border border-black/[0.08] dark:border-white/[0.12] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_1px_0_rgba(255,255,255,0.18),0_4px_20px_rgba(0,0,0,0.25)] hover:border-[#0071E3]/60 dark:hover:border-[#0A84FF]/60 hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),0_16px_36px_rgba(0,113,227,0.12)] hover:-translate-y-1 transition-all duration-300 text-left active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0071E3] min-w-0 ${
                prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-3 duration-450 delay-[260ms]'
              }`}
            >
              {/* Cursor Spotlight Layer */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
                style={{
                  opacity: isTouchDevice || prefersReducedMotion ? 0 : spotlightMurid.opacity,
                  background: `radial-gradient(280px circle at ${spotlightMurid.x}px ${spotlightMurid.y}px, rgba(0, 113, 227, 0.12), transparent 70%)`,
                }}
                aria-hidden="true"
              />

              {/* Top Row on Desktop: Icon & Decorative Progress Ring */}
              <div className="flex items-center md:justify-between shrink-0 md:w-full md:mb-3">
                <div className="w-8.5 h-8.5 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-[12px] sm:rounded-[14px] md:rounded-[20px] bg-gradient-to-tr from-blue-500/15 to-blue-500/5 dark:from-blue-500/25 dark:to-blue-500/10 border border-blue-500/25 shadow-[0_0_20px_rgba(0,113,227,0.15)] flex items-center justify-center text-[#0071E3] dark:text-[#0A84FF] shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <GraduationCap className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 md:w-7 md:h-7 lg:w-8 lg:h-8" strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Decorative Mini Progress Ring in Top-Right */}
                <div
                  className="hidden md:flex relative w-8 h-8 shrink-0 items-center justify-center p-1 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/40 dark:border-blue-900/40"
                  title="Indikator progres tes"
                  aria-hidden="true"
                >
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" className="text-blue-200/50 dark:text-blue-900/40" />
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeDasharray="56.5" strokeDashoffset="14" strokeLinecap="round" className="text-[#0071E3] dark:text-[#0A84FF]" />
                  </svg>
                </div>
              </div>

              {/* Card Body */}
              <div className="min-w-0 flex-1 ml-2 sm:ml-3 md:ml-0 md:w-full">
                <div className="inline-block px-1.5 sm:px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[#248A3D] dark:text-[#30D158] text-[10.5px] sm:text-[12px] md:text-[13px] font-semibold mb-0 sm:mb-0.5 md:mb-1 border border-emerald-200/50 dark:border-emerald-800/40 whitespace-nowrap">
                  Peserta Tes
                </div>
                <h2 className="text-[14px] sm:text-base md:text-xl lg:text-[22px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-0 sm:mb-0.5 md:mb-1">
                  Murid
                </h2>
                <p className="text-[11.5px] sm:text-[13px] text-[#48484A] dark:text-[#AEAEB2] leading-tight sm:leading-snug">
                  <span className="md:hidden">Masuk dengan kode peserta</span>
                  <span className="hidden md:inline">
                    Masuk dengan kode peserta untuk asesmen literasi, numerasi, peminatan, dan asrama.
                  </span>
                </p>
              </div>

              {/* Action Link Row */}
              <div className="mt-0 md:mt-3 flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#0071E3] dark:text-[#0A84FF] shrink-0 ml-1.5 md:ml-0">
                <span className="hidden md:inline">Mulai Tes</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-250" strokeWidth={1.75} aria-hidden="true" />
              </div>
            </button>

            {/* Admin Card */}
            <button
              type="button"
              onClick={() => onSelectRole('admin')}
              onMouseMove={(e) => handleCardMouseMove(e, setSpotlightAdmin)}
              onMouseLeave={() => handleCardMouseLeave(setSpotlightAdmin)}
              className={`group relative w-full max-w-[380px] min-h-[50px] sm:min-h-[56px] flex flex-row md:flex-col justify-between items-center md:items-start p-2 sm:p-3 md:p-5 lg:p-5.5 rounded-[18px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-[20px] border border-black/[0.08] dark:border-white/[0.12] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_1px_0_rgba(255,255,255,0.18),0_4px_20px_rgba(0,0,0,0.25)] hover:border-[#0284C7]/60 dark:hover:border-[#38BDF8]/60 hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),0_16px_36px_rgba(2,132,199,0.12)] hover:-translate-y-1 transition-all duration-300 text-left active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0284C7] min-w-0 ${
                prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-3 duration-450 delay-[330ms]'
              }`}
            >
              {/* Cursor Spotlight Layer */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
                style={{
                  opacity: isTouchDevice || prefersReducedMotion ? 0 : spotlightAdmin.opacity,
                  background: `radial-gradient(280px circle at ${spotlightAdmin.x}px ${spotlightAdmin.y}px, rgba(2, 132, 199, 0.12), transparent 70%)`,
                }}
                aria-hidden="true"
              />

              {/* Top Row on Desktop: Icon & Decorative 3 Activity Bars */}
              <div className="flex items-center md:justify-between shrink-0 md:w-full md:mb-3">
                <div className="w-8.5 h-8.5 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-[12px] sm:rounded-[14px] md:rounded-[20px] bg-gradient-to-tr from-sky-500/15 to-teal-500/5 dark:from-sky-500/25 dark:to-teal-500/10 border border-sky-500/25 shadow-[0_0_20px_rgba(2,132,199,0.15)] flex items-center justify-center text-[#0284C7] dark:text-[#38BDF8] shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 md:w-7 md:h-7 lg:w-8 lg:h-8" strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Decorative Mini 3 Bars in Top-Right */}
                <div
                  className="hidden md:flex relative w-8 h-8 shrink-0 items-end justify-center gap-1 p-1.5 rounded-xl bg-sky-50/60 dark:bg-sky-950/40 border border-sky-200/40 dark:border-sky-900/40"
                  title="Monitoring statistik"
                  aria-hidden="true"
                >
                  <span className="w-1 h-2 rounded-full bg-[#0284C7] dark:bg-[#38BDF8]" />
                  <span className="w-1 h-3.5 rounded-full bg-[#0284C7] dark:bg-[#38BDF8]" />
                  <span className="w-1 h-2.5 rounded-full bg-[#0284C7] dark:bg-[#38BDF8]" />
                </div>
              </div>

              {/* Card Body */}
              <div className="min-w-0 flex-1 ml-2 sm:ml-3 md:ml-0 md:w-full">
                <div className="inline-block px-1.5 sm:px-2 py-0.2 rounded-full bg-slate-100 dark:bg-white/10 text-[#48484A] dark:text-[#AEAEB2] text-[10.5px] sm:text-[12px] md:text-[13px] font-semibold mb-0 sm:mb-0.5 md:mb-1 border border-slate-200/60 dark:border-white/10 whitespace-nowrap">
                  Pengelola Tes
                </div>
                <h2 className="text-[14px] sm:text-base md:text-xl lg:text-[22px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-0 sm:mb-0.5 md:mb-1">
                  Admin
                </h2>
                <p className="text-[11.5px] sm:text-[13px] text-[#48484A] dark:text-[#AEAEB2] leading-tight sm:leading-snug">
                  <span className="md:hidden">Kelola peserta dan hasil tes</span>
                  <span className="hidden md:inline">
                    Kelola peserta, hari tes aktif, izin wali, sebaran data, dan cetak Profil Murid.
                  </span>
                </p>
              </div>

              {/* Action Link Row */}
              <div className="mt-0 md:mt-3 flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#0284C7] dark:text-[#38BDF8] shrink-0 ml-1.5 md:ml-0">
                <span className="hidden md:inline">Buka Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-250" strokeWidth={1.75} aria-hidden="true" />
              </div>
            </button>

            {/* Guru BK Card */}
            <button
              type="button"
              onClick={() => onSelectRole('bk')}
              onMouseMove={(e) => handleCardMouseMove(e, setSpotlightBk)}
              onMouseLeave={() => handleCardMouseLeave(setSpotlightBk)}
              className={`group relative w-full max-w-[380px] min-h-[50px] sm:min-h-[56px] flex flex-row md:flex-col justify-between items-center md:items-start p-2 sm:p-3 md:p-5 lg:p-5.5 rounded-[18px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-[20px] border border-black/[0.08] dark:border-white/[0.12] shadow-[inset_1px_1px_0_rgba(255,255,255,0.8),0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[inset_1px_1px_0_rgba(255,255,255,0.18),0_4px_20px_rgba(0,0,0,0.25)] hover:border-purple-500/60 dark:hover:border-purple-400/60 hover:shadow-[inset_1px_1px_0_rgba(255,255,255,0.9),0_16px_36px_rgba(147,51,234,0.12)] hover:-translate-y-1 transition-all duration-300 text-left active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 min-w-0 ${
                prefersReducedMotion ? '' : 'animate-in fade-in slide-in-from-bottom-3 duration-450 delay-[400ms]'
              }`}
            >
              {/* Cursor Spotlight Layer */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
                style={{
                  opacity: isTouchDevice || prefersReducedMotion ? 0 : spotlightBk.opacity,
                  background: `radial-gradient(280px circle at ${spotlightBk.x}px ${spotlightBk.y}px, rgba(147, 51, 234, 0.12), transparent 70%)`,
                }}
                aria-hidden="true"
              />

              {/* Top Row on Desktop: Icon & Decorative Shield */}
              <div className="flex items-center md:justify-between shrink-0 md:w-full md:mb-3">
                <div className="w-8.5 h-8.5 sm:w-11 sm:h-11 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-[12px] sm:rounded-[14px] md:rounded-[20px] bg-gradient-to-tr from-purple-500/15 to-purple-500/5 dark:from-purple-500/25 dark:to-purple-500/10 border border-purple-500/25 shadow-[0_0_20px_rgba(147,51,234,0.15)] flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <HeartHandshake className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 md:w-7 md:h-7 lg:w-8 lg:h-8" strokeWidth={1.5} aria-hidden="true" />
                </div>

                {/* Decorative Mini Privacy Shield in Top-Right */}
                <div
                  className="hidden md:flex relative w-8 h-8 shrink-0 items-center justify-center rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200/40 dark:border-purple-900/40 text-purple-600 dark:text-purple-400"
                  title="Privasi konseling terlindungi"
                  aria-hidden="true"
                >
                  <Shield className="w-4 h-4" strokeWidth={1.75} />
                </div>
              </div>

              {/* Card Body */}
              <div className="min-w-0 flex-1 ml-2 sm:ml-3 md:ml-0 md:w-full">
                <div className="inline-block px-1.5 sm:px-2 py-0.2 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10.5px] sm:text-[12px] md:text-[13px] font-semibold mb-0 sm:mb-0.5 md:mb-1 border border-purple-200/50 dark:border-purple-800/40 whitespace-nowrap">
                  Privasi Khusus
                </div>
                <h2 className="text-[14px] sm:text-base md:text-xl lg:text-[22px] font-bold text-[#1D1D1F] dark:text-[#F5F5F7] mb-0 sm:mb-0.5 md:mb-1">
                  Guru BK
                </h2>
                <p className="text-[11.5px] sm:text-[13px] text-[#48484A] dark:text-[#AEAEB2] leading-tight sm:leading-snug">
                  <span className="md:hidden">Skrining psikososial dan kesehatan</span>
                  <span className="hidden md:inline">
                    Akses skrining psikososial (Modul L), catatan kesehatan asrama, dan alert rujukan.
                  </span>
                </p>
              </div>

              {/* Action Link Row */}
              <div className="mt-0 md:mt-3 flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-purple-600 dark:text-purple-400 shrink-0 ml-1.5 md:ml-0">
                <span className="hidden md:inline">Buka Konseling</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-250" strokeWidth={1.75} aria-hidden="true" />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* ========================================================
          ROW 3: CATATAN BAWAH (Single Plain Line Centered)
         ======================================================== */}
      <footer className="relative z-20 w-full max-w-full border-t border-black/[0.05] dark:border-white/[0.06] bg-transparent backdrop-blur-sm shrink-0">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-1.5 sm:py-2.5 flex items-center justify-center gap-1.5 text-center text-[11.5px] sm:text-[13px] text-[#6E6E73] dark:text-[#98989D]">
          <Info className="w-3.5 h-3.5 shrink-0 text-[#0071E3] dark:text-[#0A84FF]" strokeWidth={1.75} aria-hidden="true" />
          <span>Prototipe · Iterasi 1 — simulasi dengan 5 data murid contoh</span>
        </div>
      </footer>
    </div>
  );
};
