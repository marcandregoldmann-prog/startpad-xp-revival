const FOCUS_KEY = 'clearmind-focus';
const WOCHENFOKUS_KEY = 'clearmind-wochenfokus';
const TAGESABSCHLUSS_KEY = 'clearmind-tagesabschluss';

export interface FocusSession {
  active: boolean;
  startedAt: string | null;
  duration: number; // minutes target
  taskId?: string;
}

export function loadFocusSession(): FocusSession {
  try {
    const data = localStorage.getItem(FOCUS_KEY);
    if (data) return JSON.parse(data);
  } catch {}
  return { active: false, startedAt: null, duration: 25 };
}

export function saveFocusSession(session: FocusSession): void {
  localStorage.setItem(FOCUS_KEY, JSON.stringify(session));
}

export function startFocus(duration: number = 25, taskId?: string): FocusSession {
  const session: FocusSession = {
    active: true,
    startedAt: new Date().toISOString(),
    duration,
    taskId,
  };
  saveFocusSession(session);
  return session;
}

export function stopFocus(): FocusSession {
  const session: FocusSession = {
    active: false,
    startedAt: null,
    duration: 25,
  };
  saveFocusSession(session);
  return session;
}

// Wochenfokus
export function loadWochenfokus(): string {
  return localStorage.getItem(WOCHENFOKUS_KEY) || '';
}

export function saveWochenfokus(text: string): void {
  localStorage.setItem(WOCHENFOKUS_KEY, text);
}

// Tagesabschluss
export interface TagesabschlussEntry {
  date: string;
  mood: number; // 1-5
  note: string;
}

export function loadTagesabschluss(): TagesabschlussEntry[] {
  try {
    const data = localStorage.getItem(TAGESABSCHLUSS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTagesabschluss(entry: TagesabschlussEntry): void {
  const entries = loadTagesabschluss();
  const today = new Date().toISOString().split('T')[0];
  const existing = entries.findIndex(e => e.date === today);
  if (existing >= 0) {
    entries[existing] = entry;
  } else {
    entries.unshift(entry);
  }
  localStorage.setItem(TAGESABSCHLUSS_KEY, JSON.stringify(entries));
}

export function hasTagesabschlussToday(): boolean {
  const entries = loadTagesabschluss();
  const today = new Date().toISOString().split('T')[0];
  return entries.some(e => e.date === today);
}

// Kontext-Hinweise (time-based suggestions)
export function getKontextHinweise(): string[] {
  const hour = new Date().getHours();
  const hints: string[] = [];

  if (hour >= 6 && hour < 9) {
    hints.push('🌅 Morgenroutine: Starte mit deiner wichtigsten Aufgabe.');
    hints.push('💧 Trinke ein Glas Wasser.');
  } else if (hour >= 9 && hour < 12) {
    hints.push('🎯 Fokuszeit: Nutze die Vormittagsenergie.');
  } else if (hour >= 12 && hour < 14) {
    hints.push('🍽️ Mittagspause nicht vergessen.');
    hints.push('🚶 Kurze Bewegung tut gut.');
  } else if (hour >= 14 && hour < 17) {
    hints.push('📋 Check deine offenen Aufgaben.');
  } else if (hour >= 17 && hour < 20) {
    hints.push('🌇 Feierabend-Routine: Schließe den Tag ab.');
    hints.push('📖 Guter Zeitpunkt zum Lesen.');
  } else if (hour >= 20 || hour < 6) {
    hints.push('🌙 Wind down: Bereite dich auf morgen vor.');
    hints.push('✍️ Tagesabschluss nicht vergessen.');
  }

  return hints;
}
