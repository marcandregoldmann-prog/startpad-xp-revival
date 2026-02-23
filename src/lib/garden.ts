import { generateId } from './decisions';

export type PlantStage = 'seed' | 'sprout' | 'small' | 'mature' | 'blooming';

export interface Plant {
  id: string;
  type: string; // 'sunflower', 'rose', 'tree', etc.
  stage: PlantStage;
  plantedAt: string;
  lastWatered: string;
  growthProgress: number; // 0-100 to next stage
}

const GARDEN_KEY = 'clearmind-garden';

export const PLANT_TYPES: Record<string, Record<PlantStage, string>> = {
  sunflower: { seed: '🌱', sprout: '🌿', small: '🪴', mature: '🌽', blooming: '🌻' },
  rose: { seed: '🌰', sprout: '🌱', small: '🌿', mature: '🥀', blooming: '🌹' },
  tree: { seed: '🌰', sprout: '🌱', small: '🌲', mature: '🌳', blooming: '🍎' },
  cactus: { seed: '🌵', sprout: '🌵', small: '🌵', mature: '🌵', blooming: '🌸' },
  palm: { seed: '🥥', sprout: '🌱', small: '🌴', mature: '🌴', blooming: '🥥' },
};

export function loadGarden(): Plant[] {
  try {
    const data = localStorage.getItem(GARDEN_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveGarden(garden: Plant[]): void {
  localStorage.setItem(GARDEN_KEY, JSON.stringify(garden));
}

export function plantSeed(type: string = 'sunflower'): Plant {
  const garden = loadGarden();
  const newPlant: Plant = {
    id: generateId(),
    type,
    stage: 'seed',
    plantedAt: new Date().toISOString(),
    lastWatered: new Date().toISOString(),
    growthProgress: 0,
  };
  garden.push(newPlant);
  saveGarden(garden);
  return newPlant;
}

export function waterGarden(minutes: number): { watered: number, evolved: number } {
  const garden = loadGarden();
  let wateredCount = 0;
  let evolvedCount = 0;

  // Filter for active plants (not blooming yet)
  let activePlants = garden.filter(p => p.stage !== 'blooming');

  // Auto-plant if empty or all blooming
  if (activePlants.length === 0) {
    if (garden.length < 12) { // Max garden size for now
      const types = Object.keys(PLANT_TYPES);
      const randomType = types[Math.floor(Math.random() * types.length)];

      const newPlant: Plant = {
        id: generateId(),
        type: randomType,
        stage: 'seed',
        plantedAt: new Date().toISOString(),
        lastWatered: new Date().toISOString(),
        growthProgress: 0,
      };

      garden.push(newPlant);
      activePlants = [newPlant]; // Update active reference
    } else {
      // Garden full, just water a random blooming one for fun/maintenance?
      // Or do nothing.
      return { watered: 0, evolved: 0 };
    }
  }

  // Target the last active plant (LIFO - grow one at a time)
  const targetPlant = activePlants[activePlants.length - 1];

  if (targetPlant) {
    targetPlant.growthProgress += minutes;
    targetPlant.lastWatered = new Date().toISOString();
    wateredCount++;

    // Evolution Thresholds
    let threshold = 25; // Seed -> Sprout
    if (targetPlant.stage === 'sprout') threshold = 50;
    if (targetPlant.stage === 'small') threshold = 75;
    if (targetPlant.stage === 'mature') threshold = 100;

    // Check Evolution
    if (targetPlant.growthProgress >= threshold) {
      targetPlant.growthProgress -= threshold;
      evolvedCount++;

      switch (targetPlant.stage) {
        case 'seed': targetPlant.stage = 'sprout'; break;
        case 'sprout': targetPlant.stage = 'small'; break;
        case 'small': targetPlant.stage = 'mature'; break;
        case 'mature': targetPlant.stage = 'blooming'; break;
      }
    }
  }

  saveGarden(garden);
  return { watered: wateredCount, evolved: evolvedCount };
}
