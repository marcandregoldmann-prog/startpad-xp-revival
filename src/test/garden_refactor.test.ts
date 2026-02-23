import { describe, it, expect, beforeEach, vi } from 'vitest';
import { waterGarden, loadGarden } from '../lib/garden';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: 0,
    key: (index: number) => Object.keys(store)[index] || null,
  };
})();

if (typeof window === 'undefined') {
    (global as any).window = { localStorage: localStorageMock };
    (global as any).localStorage = localStorageMock;
} else {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      configurable: true
    });
}

describe('Garden Refactor', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should auto-plant a seed when the garden is empty', () => {
    const initialGarden = loadGarden();
    expect(initialGarden.length).toBe(0);

    const result = waterGarden(5);

    expect(result.watered).toBe(1);
    const garden = loadGarden();
    expect(garden.length).toBe(1);
    expect(garden[0].stage).toBe('seed');
    expect(garden[0].growthProgress).toBe(5);
  });

  it('should evolve a plant when threshold is reached', () => {
    // First, let it auto-plant with some progress
    waterGarden(20);
    let garden = loadGarden();
    expect(garden[0].stage).toBe('seed');
    expect(garden[0].growthProgress).toBe(20);

    // Water more to evolve (threshold for seed -> sprout is 25)
    const result = waterGarden(10);
    expect(result.evolved).toBe(1);

    garden = loadGarden();
    expect(garden[0].stage).toBe('sprout');
    expect(garden[0].growthProgress).toBe(5); // 20 + 10 - 25 = 5
  });

  it('should not plant more than 12 plants', () => {
    // Fill garden with 12 blooming plants
    const fullGarden = Array.from({ length: 12 }, (_, i) => ({
      id: `id-${i}`,
      type: 'sunflower',
      stage: 'blooming' as const,
      plantedAt: new Date().toISOString(),
      lastWatered: new Date().toISOString(),
      growthProgress: 100,
    }));
    localStorageMock.setItem('clearmind-garden', JSON.stringify(fullGarden));

    const result = waterGarden(5);
    expect(result.watered).toBe(0);
    expect(loadGarden().length).toBe(12);
  });
});
