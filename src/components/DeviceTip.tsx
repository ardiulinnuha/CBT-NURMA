/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Laptop, X } from 'lucide-react';

interface DeviceTipProps {
  moduleContext?: 'welcome' | 'writing' | 'arabic';
}

export const DeviceTip: React.FC<DeviceTipProps> = ({ moduleContext = 'welcome' }) => {
  const [dismissed, setDismissed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  if (!isSmallScreen || dismissed) {
    return null;
  }

  let tipMessage = 'Tips: untuk hasil terbaik, gunakan tablet, laptop, atau komputer.';
  if (moduleContext === 'writing') {
    tipMessage = 'Tips: Mengetik esai lebih nyaman bila menggunakan keyboard fisik atau tablet/laptop.';
  } else if (moduleContext === 'arabic') {
    tipMessage = 'Tips: Teks berharakat Arab akan lebih mudah terbaca pada layar tablet atau laptop.';
  }

  return (
    <div className="mx-auto w-full max-w-xl mb-4 px-3 sm:px-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl bg-[#0071E3]/10 dark:bg-[#0A84FF]/15 border border-[#0071E3]/20 text-[#0071E3] dark:text-[#0A84FF] text-xs sm:text-sm shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <Laptop className="w-4 h-4 shrink-0" />
          <span className="font-normal leading-snug">{tipMessage}</span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
          aria-label="Tutup saran"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
