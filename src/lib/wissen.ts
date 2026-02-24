import { generateId } from './decisions';
import { addXP, removeXP } from './tasks';

export type WissenCategory = 'Medien' | 'Projekt';
export type WissenStatus = 'Geplant' | 'Laufend' | 'Beendet' | 'Abgebrochen';
export type WissenDifficulty = 'Klein' | 'Mittel' | 'Anspruchsvoll';

export interface WissenEntry {
  id: string;
  title: string;
  type: string;
  rating: number;
  tags: string[];
  url: string;
  notes: string;
  category: WissenCategory;
  status: WissenStatus;
  difficulty?: WissenDifficulty;
  createdAt: string;
  xpAwarded?: boolean;
}

const WISSEN_KEY = 'clearmind-wissen';

export function loadWissen(): WissenEntry[] {
  try {
    const data = localStorage.getItem(WISSEN_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveWissenAll(entries: WissenEntry[]): void {
  localStorage.setItem(WISSEN_KEY, JSON.stringify(entries));
}

export function saveWissenEntry(entry: WissenEntry): void {
  const entries = loadWissen();
  entries.unshift(entry);
  saveWissenAll(entries);
}

export function deleteWissenEntry(id: string): void {
  const allEntries = loadWissen();
  const entry = allEntries.find(e => e.id === id);
  if (entry?.xpAwarded) {
    const xpAmount = getXPForEntry(entry);
    removeXP(xpAmount);
  }
  const entries = allEntries.filter(e => e.id !== id);
  saveWissenAll(entries);
}

export function createWissenEntry(
  title: string,
  type: string,
  rating: number,
  tags: string[],
  url: string,
  notes: string,
  category: WissenCategory = 'Medien',
  status: WissenStatus = 'Geplant',
  difficulty?: WissenDifficulty,
): WissenEntry {
  return {
    id: generateId(),
    title,
    type,
    rating,
    tags,
    url,
    notes,
    category,
    status,
    difficulty,
    createdAt: new Date().toISOString(),
    xpAwarded: false,
  };
}

function getXPForEntry(entry: WissenEntry): number {
  if (entry.category === 'Medien') return 15;
  if (entry.category === 'Projekt') {
    switch (entry.difficulty) {
      case 'Klein': return 10;
      case 'Mittel': return 20;
      case 'Anspruchsvoll': return 30;
      default: return 0;
    }
  }
  return 0;
}

export function updateWissenEntry(id: string, updates: Partial<WissenEntry>): WissenEntry | null {
  const entries = loadWissen();
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) return null;

  const oldEntry = entries[index];
  const newEntry = { ...oldEntry, ...updates };

  // XP logic: handle status transitions
  const oldStatus = oldEntry.status;
  const newStatus = newEntry.status;

  if (oldStatus !== newStatus) {
    // Was "Beendet" and had XP → remove XP
    if (oldEntry.xpAwarded && oldStatus === 'Beendet' && newStatus !== 'Beendet') {
      const xpAmount = getXPForEntry(oldEntry);
      removeXP(xpAmount);
      newEntry.xpAwarded = false;
    }

    // Becoming "Beendet" → award XP (only once)
    if (newStatus === 'Beendet' && !newEntry.xpAwarded) {
      const xpAmount = getXPForEntry(newEntry);
      if (xpAmount > 0) {
        addXP(xpAmount);
        newEntry.xpAwarded = true;
      }
    }
  }

  entries[index] = newEntry;
  saveWissenAll(entries);
  return newEntry;
}

export function getRunningMedia(entries: WissenEntry[]): WissenEntry[] {
  return entries
    .filter(e => e.category === 'Medien' && e.status === 'Laufend')
    .slice(0, 3);
}

export const wissenTypes = ['Buch', 'Artikel', 'Video', 'Podcast', 'Kurs', 'Tool', 'Projekt', 'Sonstiges'];
