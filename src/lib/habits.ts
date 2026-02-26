import { generateId } from './utils';
import { addXP, getToday } from './tasks';

export interface Habit {
  id: string;
  title: string;
  streak: number;
  lastDone: string | null;
  history: string[];
  xp: number;
}

const HABITS_KEY = 'clearmind-habits';

export function loadHabits(): Habit[] {
  try {
    const data = localStorage.getItem(HABITS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function createHabit(title: string, xp: number = 5): Habit {
  return {
    id: generateId(),
    title,
    streak: 0,
    lastDone: null,
    history: [],
    xp,
  };
}

export function addHabit(title: string): void {
  const habits = loadHabits();
  habits.push(createHabit(title));
  saveHabits(habits);
}

export function deleteHabit(id: string): void {
  const habits = loadHabits().filter(h => h.id !== id);
  saveHabits(habits);
}

export function toggleHabit(id: string): void {
  const habits = loadHabits();
  const index = habits.findIndex(h => h.id === id);
  if (index === -1) return;

  const habit = habits[index];
  const today = getToday();
  const doneToday = habit.lastDone === today;

  if (doneToday) {
    // Undo
    habit.lastDone = habit.history[habit.history.length - 2] || null;
    habit.history.pop();
    habit.streak = Math.max(0, habit.streak - 1);
    // Remove XP? Maybe not worth tracking XP removal for habits undo, keep it simple.
  } else {
    // Do
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (habit.lastDone === yesterdayStr) {
      habit.streak += 1;
    } else {
      habit.streak = 1;
    }
    habit.lastDone = today;
    habit.history.push(today);
    addXP(habit.xp);
  }

  habits[index] = habit;
  saveHabits(habits);
}

export function isHabitDoneToday(habit: Habit): boolean {
  return habit.lastDone === getToday();
}
