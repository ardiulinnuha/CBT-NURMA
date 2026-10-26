/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Role } from './types';
import { ThemeMode, TopBanner } from './components/TopBanner';
import { RoleSelector } from './components/RoleSelector';
import { StudentWelcome } from './components/StudentWelcome';
import { AdminView } from './components/AdminView';
import { BkView } from './components/BkView';
import { StudentRepository } from './services/studentRepository';

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Apply Theme Mode (System, Light, Dark)
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      if (themeMode === 'dark') {
        root.classList.add('dark');
      } else if (themeMode === 'light') {
        root.classList.remove('dark');
      } else {
        // System
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    const listener = () => {
      if (themeMode === 'system') applyTheme();
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [themeMode]);

  // Check URL query parameters for direct navigation / testing (?role=admin, ?role=bk, ?role=murid)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get('role');
    if (roleParam === 'murid' || roleParam === 'admin' || roleParam === 'bk') {
      setRole(roleParam);
    }
  }, []);

  const handleRoleChange = (newRole: Role | null) => {
    setIsTransitioning(true);
    setRole(newRole);
    setTimeout(() => setIsTransitioning(false), 350);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        'Kembalikan data simulasi tes diagnostik ke 5 murid awal?'
      )
    ) {
      StudentRepository.resetToDefault();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] transition-colors duration-300">
      {/* Top Banner with PDP notice, role switcher, and theme selector on active role screens */}
      {role !== null && (
        <TopBanner
          currentRole={role}
          onSelectRole={handleRoleChange}
          onResetData={handleResetData}
          themeMode={themeMode}
          onThemeChange={setThemeMode}
          isTransitioning={isTransitioning}
        />
      )}

      {/* Main Container with subtle smooth fade + slide transition (PRD B.8) */}
      <main className="w-full max-w-full overflow-hidden">
        {role === null && (
          <RoleSelector
            onSelectRole={handleRoleChange}
            themeMode={themeMode}
            onThemeChange={setThemeMode}
            onResetData={handleResetData}
          />
        )}
        {role === 'murid' && <StudentWelcome onBackToRoles={() => handleRoleChange(null)} />}
        {role === 'admin' && <AdminView />}
        {role === 'bk' && <BkView />}
      </main>
    </div>
  );
}
