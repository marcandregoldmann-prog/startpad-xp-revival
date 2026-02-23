import { Task } from './tasks';

export interface TimeBlock {
  time: string;
  activity: string;
  type: 'focus' | 'admin' | 'break';
}

export function generateDailyPlan(tasks: Task[]): TimeBlock[] {
  // Filter only incomplete tasks
  // In a real app, we'd check completion status from a separate list or assume input tasks are pending.
  // For now, assume passed tasks are the ones to schedule.

  const highPriority = tasks.filter(t => t.priority === 'hoch');
  const mediumPriority = tasks.filter(t => t.priority === 'mittel');
  const lowPriority = tasks.filter(t => t.priority === 'niedrig' || !t.priority);

  const schedule: TimeBlock[] = [];
  let currentHour = 9; // Start at 9:00
  let currentMinute = 0;

  const addBlock = (durationMinutes: number, activity: string, type: 'focus' | 'admin' | 'break') => {
    const startStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

    // Advance time
    currentMinute += durationMinutes;
    while (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour += 1;
    }

    const endStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    schedule.push({ time: `${startStr} - ${endStr}`, activity, type });
  };

  // Morning Deep Work (High Priority)
  if (highPriority.length > 0) {
    addBlock(90, `Deep Work: ${highPriority.map(t => t.title).join(', ')}`, 'focus');
    addBlock(15, 'Pause & Kaffee', 'break');
  }

  // Mid-Morning (Medium)
  if (mediumPriority.length > 0) {
    addBlock(60, `Projektarbeit: ${mediumPriority[0].title}`, 'focus');
    if (mediumPriority.length > 1) {
       addBlock(45, `Weiterführen: ${mediumPriority.slice(1).map(t => t.title).join(', ')}`, 'focus');
    }
  }

  // Lunch
  if (currentHour < 13) {
      // Jump to 13:00 if needed or just add lunch
      currentHour = 13;
      currentMinute = 0;
      addBlock(30, 'Mittagspause', 'break');
  }

  // Afternoon (Low / Admin)
  if (lowPriority.length > 0) {
    addBlock(45, `Admin & Kleinkram: ${lowPriority.map(t => t.title).join(', ')}`, 'admin');
  }

  // Wrap up
  addBlock(15, 'Tagesabschluss & Planung für morgen', 'admin');

  return schedule;
}
