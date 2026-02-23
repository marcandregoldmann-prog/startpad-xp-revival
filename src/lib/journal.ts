import { generateId } from './decisions';

export type JournalType = 'reflection' | 'gratitude' | 'idea';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  type: JournalType;
}

const JOURNAL_KEY = 'clearmind-journal';

export function loadJournalEntries(): JournalEntry[] {
  try {
    const data = localStorage.getItem(JOURNAL_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveJournalEntry(content: string, type: JournalType = 'reflection'): JournalEntry {
  const entries = loadJournalEntries();
  const newEntry: JournalEntry = {
    id: generateId(),
    date: new Date().toISOString(),
    content,
    type,
  };
  entries.unshift(newEntry);
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
  return newEntry;
}
