import { describe, it, expect } from 'vitest';
import { createHabit } from './habits';

describe('createHabit', () => {
  it('should create a habit with the correct title and default XP', () => {
    const title = 'Test Habit';
    const habit = createHabit(title);

    expect(habit.title).toBe(title);
    expect(habit.xp).toBe(5);
  });

  it('should create a habit with custom XP', () => {
    const title = 'Test Habit';
    const xp = 10;
    const habit = createHabit(title, xp);

    expect(habit.title).toBe(title);
    expect(habit.xp).toBe(xp);
  });

  it('should generate a unique ID', () => {
    const habit1 = createHabit('Habit 1');
    const habit2 = createHabit('Habit 2');

    expect(habit1.id).toBeDefined();
    expect(habit2.id).toBeDefined();
    expect(habit1.id).not.toBe(habit2.id);
  });

  it('should initialize other fields correctly', () => {
    const habit = createHabit('Test Habit');

    expect(habit.streak).toBe(0);
    expect(habit.lastDone).toBeNull();
    expect(habit.history).toEqual([]);
  });
});
