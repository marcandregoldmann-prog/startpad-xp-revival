import { generateId } from './decisions';

export type TaskCategory = 'Haushalt' | 'Gesundheit' | 'Routine' | 'Sonstiges';
export type TaskRepeat = 'täglich' | 'wöchentlich' | 'manuell';
export type TaskPriority = 'hoch' | 'mittel' | 'niedrig';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  xp: number;
  repeat: TaskRepeat;
  createdAt: string;
  priority?: TaskPriority;
  dueDate?: string;
  subtasks?: Subtask[];
  isArchived?: boolean;
  note?: string;
}

export interface TaskCompletion {
  taskId: string;
  completedAt: string;
}

export interface TaskStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletedTasks: number;
  lastCompletionDate: string | null;
}

const TASKS_KEY = 'clearmind-tasks';
const COMPLETIONS_KEY = 'clearmind-completions';
const STATS_KEY = 'clearmind-stats';

export function loadTasks(): Task[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTask(task: Task): void {
  const tasks = loadTasks();
  tasks.push(task);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updates };
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
}

export function deleteTask(id: string): void {
  const tasks = loadTasks().filter(t => t.id !== id);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function createTask(
  title: string,
  category: TaskCategory,
  xp: number,
  repeat: TaskRepeat,
  priority: TaskPriority = 'mittel',
  dueDate?: string
): Task {
  return {
    id: generateId(),
    title,
    category,
    xp,
    repeat,
    createdAt: new Date().toISOString(),
    priority,
    dueDate,
    subtasks: [],
    isArchived: false,
    note: '',
  };
}

export function loadCompletions(): TaskCompletion[] {
  try {
    const data = localStorage.getItem(COMPLETIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveCompletions(completions: TaskCompletion[]): void {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function isTaskCompletedToday(taskId: string, completions: TaskCompletion[]): boolean {
  const today = getToday();
  return completions.some(c => c.taskId === taskId && c.completedAt.startsWith(today));
}

export function getTodaysTasks(tasks: Task[]): Task[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const todayStr = getToday();
  
  return tasks.filter(task => {
    if (task.isArchived) return false;

    // Priority sorting logic should be done by caller, this just filters valid tasks for today

    // If specific due date:
    if (task.dueDate) {
      // Show if due today or overdue
      if (task.dueDate <= todayStr) return true;
      // If future date, only show if repeat rules match?
      // Usually due date overrides repeat.
      // If manually set due date in future, hide until then.
      return false;
    }

    if (task.repeat === 'täglich') return true;
    if (task.repeat === 'wöchentlich') return dayOfWeek === 1; // Monday
    return true; // Default manual (no date) always visible
  });
}

export function loadStats(): TaskStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    if (data) return JSON.parse(data);
  } catch { /* ignore */ }
  return {
    totalXP: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletedTasks: 0,
    lastCompletionDate: null,
  };
}

export function saveStats(stats: TaskStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function calculateLevel(totalXP: number): number {
  return Math.max(1, Math.floor(totalXP / 100) + 1);
}

export function xpForCurrentLevel(totalXP: number): number {
  return totalXP % 100;
}

export function xpToNextLevel(): number {
  return 100;
}

export function addXP(amount: number): TaskStats {
  const stats = loadStats();
  stats.totalXP += amount;
  stats.level = calculateLevel(stats.totalXP);
  saveStats(stats);
  return stats;
}

export function removeXP(amount: number): TaskStats {
  const stats = loadStats();
  stats.totalXP = Math.max(0, stats.totalXP - amount);
  stats.level = calculateLevel(stats.totalXP);
  saveStats(stats);
  return stats;
}

export function completeTask(taskId: string, xpValue: number): TaskStats {
  const completions = loadCompletions();
  completions.push({ taskId, completedAt: new Date().toISOString() });
  saveCompletions(completions);

  const stats = loadStats();
  const today = getToday();

  stats.totalXP += xpValue;
  stats.level = calculateLevel(stats.totalXP);
  stats.totalCompletedTasks += 1;

  if (stats.lastCompletionDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (stats.lastCompletionDate === yesterdayStr || stats.lastCompletionDate === null) {
      stats.currentStreak += 1;
    } else if (stats.lastCompletionDate !== today) {
      stats.currentStreak = 1;
    }

    stats.lastCompletionDate = today;
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }
  }

  saveStats(stats);
  return stats;
}

export function checkStreakReset(): TaskStats {
  const stats = loadStats();
  if (!stats.lastCompletionDate) return stats;

  const today = getToday();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (stats.lastCompletionDate !== today && stats.lastCompletionDate !== yesterdayStr) {
    stats.currentStreak = 0;
    saveStats(stats);
  }

  return stats;
}

export function getTodaysXP(completions: TaskCompletion[], tasks: Task[]): number {
  const today = getToday();
  const todayCompletions = completions.filter(c => c.completedAt.startsWith(today));
  return todayCompletions.reduce((sum, c) => {
    const task = tasks.find(t => t.id === c.taskId);
    return sum + (task?.xp || 0);
  }, 0);
}
