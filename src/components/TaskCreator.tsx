import { useState } from 'react';
import { Plus } from 'lucide-react';
import { saveTask, createTask, type TaskCategory, type TaskRepeat } from '@/lib/tasks';

interface TaskCreatorProps {
  onTaskCreated: () => void;
}

const TaskCreator = ({ onTaskCreated }: TaskCreatorProps) => {
  const [title, setTitle] = useState('');
  const [xp, setXp] = useState(10);
  const [category, setCategory] = useState<TaskCategory>('Routine');
  const [repeat, setRepeat] = useState<TaskRepeat>('täglich');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Correctly construct the task object using the helper
    const newTask = createTask(title.trim(), category, xp, repeat);
    saveTask(newTask);

    setTitle('');
    setXp(10);
    setCategory('Routine');
    setRepeat('täglich');
    setIsAdding(false);
    onTaskCreated();
  };

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)}
        className="group w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-card/20 py-4 text-sm font-medium text-muted-foreground hover:bg-accent/5 hover:text-accent hover:border-accent/30 transition-all duration-300">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/20 transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </div>
        Neue Aufgabe erstellen
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-card p-4 space-y-4 shadow-lg shadow-black/20 animate-in zoom-in-95 duration-200">
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Titel</label>
        <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel der Aufgabe"
          className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Kategorie</label>
          <div className="relative">
            <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent appearance-none">
              <option value="Routine">Routine</option>
              <option value="Haushalt">Haushalt</option>
              <option value="Gesundheit">Gesundheit</option>
              <option value="Sonstiges">Sonstiges</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
              <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Wiederholung</label>
          <div className="relative">
            <select value={repeat} onChange={(e) => setRepeat(e.target.value as TaskRepeat)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent appearance-none">
              <option value="täglich">Täglich</option>
              <option value="wöchentlich">Wöchentlich</option>
              <option value="manuell">Manuell</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
              <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center ml-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">XP Belohnung</label>
          <span className="text-xs font-mono font-bold text-accent">+{xp} XP</span>
        </div>
        <input type="range" min="5" max="50" step="5" value={xp} onChange={(e) => setXp(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-accent hover:accent-accent/80 transition-all" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => setIsAdding(false)}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
          Abbrechen
        </button>
        <button type="submit" disabled={!title.trim()}
          className="flex-1 rounded-xl bg-accent py-2.5 text-xs font-semibold text-white shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 disabled:shadow-none transition-all">
          Erstellen
        </button>
      </div>
    </form>
  );
};

export default TaskCreator;
