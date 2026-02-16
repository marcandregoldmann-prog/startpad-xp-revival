import { useState } from 'react';
import { Plus } from 'lucide-react';
import { TaskCategory, TaskRepeat, createTask, saveTask, type Task } from '@/lib/tasks';

interface TaskCreatorProps {
  onTaskCreated: (task: Task) => void;
}

const categories: TaskCategory[] = ['Haushalt', 'Gesundheit', 'Routine', 'Sonstiges'];
const repeats: TaskRepeat[] = ['täglich', 'wöchentlich', 'manuell'];

const TaskCreator = ({ onTaskCreated }: TaskCreatorProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Routine');
  const [xp, setXp] = useState(3);
  const [repeat, setRepeat] = useState<TaskRepeat>('täglich');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const task = createTask(title.trim(), category, xp, repeat);
    saveTask(task);
    onTaskCreated(task);
    setTitle('');
    setXp(3);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Neue Aufgabe
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Aufgabe eingeben..."
        autoFocus
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
      />
      <div className="flex gap-2 flex-wrap">
        <select value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}
          className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={xp} onChange={(e) => setXp(Number(e.target.value))}
          className="w-20 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          {Array.from({ length: 10 }, (_, i) => i + 1).map(v => <option key={v} value={v}>{v} XP</option>)}
        </select>
        <select value={repeat} onChange={(e) => setRepeat(e.target.value as TaskRepeat)}
          className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          {repeats.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!title.trim()}
          className="flex-1 rounded-lg bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-30">
          Erstellen
        </button>
        <button onClick={() => setOpen(false)}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Abbrechen
        </button>
      </div>
    </div>
  );
};

export default TaskCreator;
