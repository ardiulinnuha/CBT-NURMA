/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INITIAL_STUDENTS } from '../data/dummyStudents';
import { CriticalAlert, HealthRecord, Role, Student } from '../types';

const STORAGE_KEY_STUDENTS = 'nu_diag_students_v1';
const STORAGE_KEY_ACTIVE_DAY = 'nu_diag_active_day_v1';
const STORAGE_KEY_ALERTS = 'nu_diag_alerts_v1';

export class StudentRepository {
  private static initStorage(): void {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEY_STUDENTS)) {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    }

    if (!localStorage.getItem(STORAGE_KEY_ACTIVE_DAY)) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_DAY, '1');
    }

    if (!localStorage.getItem(STORAGE_KEY_ALERTS)) {
      // Seed initial critical alert for Zahra Khairunnisa (std-004)
      const initialAlerts: CriticalAlert[] = [
        {
          id: 'alert-001',
          studentId: 'std-004',
          studentName: 'Zahra Khairunnisa',
          butir: 'L-K1',
          pertanyaan:
            'Pernahkah kamu merasa sangat putus asa hingga terlintas keinginan untuk melukai dirimu sendiri?',
          jawaban: 'Pernah terlintas keinginan menyakiti diri saat merasa sangat tertekan',
          waktu: '26 Okt 2026, 09:30 WIB',
          status: 'baru',
        },
      ];
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(initialAlerts));
    }
  }

  public static resetToDefault(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEY_ACTIVE_DAY, '1');
    const initialAlerts: CriticalAlert[] = [
      {
        id: 'alert-001',
        studentId: 'std-004',
        studentName: 'Zahra Khairunnisa',
        butir: 'L-K1',
        pertanyaan:
          'Pernahkah kamu merasa sangat putus asa hingga terlintas keinginan untuk melukai dirimu sendiri?',
        jawaban: 'Pernah terlintas keinginan menyakiti diri saat merasa sangat tertekan',
        waktu: '26 Okt 2026, 09:30 WIB',
        status: 'baru',
      },
    ];
    localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(initialAlerts));
  }

  public static getActiveDay(): 1 | 2 {
    this.initStorage();
    if (typeof window === 'undefined') return 1;
    const day = localStorage.getItem(STORAGE_KEY_ACTIVE_DAY);
    return day === '2' ? 2 : 1;
  }

  public static setActiveDay(day: 1 | 2): void {
    this.initStorage();
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_ACTIVE_DAY, day.toString());
  }

  /**
   * Retrieves all students filtered strictly by role access
   */
  public static getAllStudents(role: Role): Student[] {
    this.initStorage();
    if (typeof window === 'undefined') return INITIAL_STUDENTS;

    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
      const rawStudents: Student[] = data ? JSON.parse(data) : INITIAL_STUDENTS;

      return rawStudents.map((student) => this.filterStudentByRole(student, role));
    } catch {
      return INITIAL_STUDENTS;
    }
  }

  /**
   * Retrieves single student by participant code
   */
  public static getStudentByCode(code: string, role: Role): Student | null {
    this.initStorage();
    if (typeof window === 'undefined') return null;

    try {
      const cleanCode = code.trim().toUpperCase();
      const rawStudents: Student[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]'
      );
      const found = rawStudents.find(
        (s) => s.kodePeserta.trim().toUpperCase() === cleanCode
      );
      if (!found) return null;

      return this.filterStudentByRole(found, role);
    } catch {
      return null;
    }
  }

  /**
   * Retrieves single student by ID
   */
  public static getStudentById(id: string, role: Role): Student | null {
    this.initStorage();
    if (typeof window === 'undefined') return null;

    try {
      const rawStudents: Student[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]'
      );
      const found = rawStudents.find((s) => s.id === id);
      if (!found) return null;

      return this.filterStudentByRole(found, role);
    } catch {
      return null;
    }
  }

  /**
   * Updates guardian consent status (Admin only)
   */
  public static updateGuardianConsent(studentId: string, consent: boolean): void {
    this.initStorage();
    if (typeof window === 'undefined') return;

    try {
      const rawStudents: Student[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]'
      );
      const updated = rawStudents.map((s) =>
        s.id === studentId ? { ...s, persetujuanWali: consent } : s
      );
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update guardian consent', e);
    }
  }

  /**
   * Marks student session as delayed ("Aku perlu istirahat")
   */
  public static markSessionDelayed(studentId: string): void {
    this.initStorage();
    if (typeof window === 'undefined') return;

    try {
      const rawStudents: Student[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]'
      );
      const updated = rawStudents.map((s) =>
        s.id === studentId ? { ...s, statusSesi: 'ditunda' as const } : s
      );
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to mark session delayed', e);
    }
  }

  /**
   * Marks student session as started
   */
  public static markSessionStarted(studentId: string): void {
    this.initStorage();
    if (typeof window === 'undefined') return;

    try {
      const rawStudents: Student[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]'
      );
      const updated = rawStudents.map((s) =>
        s.id === studentId ? { ...s, statusSesi: 'sedang' as const } : s
      );
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to mark session started', e);
    }
  }

  /**
   * Records student device info (as neutral note for Admin)
   */
  public static recordDevice(studentId: string, deviceDesc: string): void {
    this.initStorage();
    if (typeof window === 'undefined') return;

    try {
      const rawStudents: Student[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_STUDENTS) || '[]'
      );
      const updated = rawStudents.map((s) =>
        s.id === studentId ? { ...s, jenisPerangkat: deviceDesc } : s
      );
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to record device info', e);
    }
  }

  /**
   * Critical Alerts (Guru BK only)
   */
  public static getCriticalAlerts(): CriticalAlert[] {
    this.initStorage();
    if (typeof window === 'undefined') return [];

    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_ALERTS) || '[]');
    } catch {
      return [];
    }
  }

  public static resolveCriticalAlert(alertId: string, notes: string): void {
    this.initStorage();
    if (typeof window === 'undefined') return;

    try {
      const alerts: CriticalAlert[] = JSON.parse(
        localStorage.getItem(STORAGE_KEY_ALERTS) || '[]'
      );
      const updated = alerts.map((a) =>
        a.id === alertId ? { ...a, status: 'ditindaklanjuti' as const, catatanBK: notes } : a
      );
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to resolve alert', e);
    }
  }

  /**
   * Strips sensitive data depending on role:
   * - Admin: NEVER sees Modul L, raw health records, or critical alerts.
   *          Psychosocial flag is shown as neutral "Ada tindak lanjut di BK".
   * - Murid: NEVER sees scores, levels, or flags.
   * - Guru BK: Sees full complete records.
   */
  private static filterStudentByRole(student: Student, role: Role): Student {
    const copy: Student = JSON.parse(JSON.stringify(student));

    if (role === 'murid') {
      // Murid cannot see scores, levels, flags, or psychosocial details
      return {
        id: copy.id,
        nama: copy.nama,
        jenisKelamin: copy.jenisKelamin,
        asalSekolah: copy.asalSekolah,
        riwayatMondok: copy.riwayatMondok,
        persetujuanWali: copy.persetujuanWali,
        kodePeserta: copy.kodePeserta,
        hariAktif: copy.hariAktif,
        statusSesi: copy.statusSesi,
        jenisPerangkat: copy.jenisPerangkat,
        scores: {},
        interestResult: {
          scores: { IPA: 0, IPS: 0, Bahasa: 0, Keagamaan: 0 },
          dominant: '',
          isMixed: false,
        },
        learningStyleResult: {
          vak: { visual: 0, auditory: 0, kinesthetic: 0 },
          dominant: 'Campuran',
          isMixed: true,
        },
        boardingReadinessResult: {
          totalScore: 0,
          level: 'Sedang',
          k11Score: 0,
          hasMotivationFlag: false,
        },
        flags: [],
      };
    }

    if (role === 'admin') {
      // Admin sees academic and diniyah scores, but NEVER psychosocial score, critical alerts, or health records
      delete copy.psychosocialResult;
      delete copy.healthRecord;

      // Filter flags so only flags with visibleTo === 'admin' are shown
      copy.flags = copy.flags.filter((f) => f.visibleTo === 'admin');

      return copy;
    }

    // Role === 'bk' receives full information
    return copy;
  }
}
