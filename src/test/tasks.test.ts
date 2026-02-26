import { describe, it, expect } from 'vitest';
import { calculateLevel } from '../lib/tasks';

describe('calculateLevel', () => {
  it('should return level 1 for 0 XP', () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it('should return level 1 for 99 XP', () => {
    expect(calculateLevel(99)).toBe(1);
  });

  it('should return level 2 for 100 XP', () => {
    expect(calculateLevel(100)).toBe(2);
  });

  it('should return level 2 for 150 XP', () => {
    expect(calculateLevel(150)).toBe(2);
  });

  it('should return level 3 for 200 XP', () => {
    expect(calculateLevel(200)).toBe(3);
  });

  it('should return level 1 for negative XP (min level 1)', () => {
    expect(calculateLevel(-50)).toBe(1);
    expect(calculateLevel(-100)).toBe(1);
  });
});
