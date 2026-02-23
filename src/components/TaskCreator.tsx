import { useState } from 'react';
import { Plus } from 'lucide-react';
import { saveTask, createTask, type TaskCategory, type TaskRepeat, type TaskPriority } from '@/lib/tasks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { loadWissen } from '@/lib/wissen';

interface TaskCreatorProps {
  onTaskCreated: () => void;
}

const TaskCreator = ({ onTaskCreated }: TaskCreatorProps) => {
  const [title, setTitle] = useState('');
  const [xp, setXp] = useState(10);
  const [category, setCategory] = useState<TaskCategory>('Routine');
  const [repeat, setRepeat] = useState<TaskRepeat>('täglich');
  const [priority, setPriority] = useState<TaskPriority>('mittel');
  const [dueDate, setDueDate] = useState('');
  const [knowledgeId, setKnowledgeId] = useState<string>('none');
  const [isAdding, setIsAdding] = useState(false);

  const wissenEntries = loadWissen();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Create task with all fields, including optional knowledgeId link if implemented in backend (not yet in createTask, but maybe in future?)
    // Wait, createTask definition in lib/tasks.ts DOES NOT accept knowledgeId.
    // If I want to persist it, I need to update createTask or add it to note?
    // For now, I will stick to what createsTask accepts.
    // The knowledgeId seems to be a UI feature in main that isn't fully backed by the helper yet?
    // Or maybe I missed createTask update?
    // Let's check lib/tasks.ts again... I saw it only had 6 args.

    const newTask = createTask(title.trim(), category, xp, repeat, priority, dueDate || undefined);

    // If knowledgeId is set, maybe append to note?
    if (knowledgeId && knowledgeId !== 'none') {
        const entry = wissenEntries.find(e => e.id === knowledgeId);
        if (entry) {
            newTask.note = `Linked Knowledge: [${entry.title}](/wissen?id=${entry.id})`;
        }
    }

    saveTask(newTask);

    setTitle('');
    setXp(10);
    setCategory('Routine');
    setRepeat('täglich');
    setPriority('mittel');
    setDueDate('');
    setKnowledgeId('none');
    setIsAdding(false);
    onTaskCreated();
  };

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)}
        className="group w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card/20 py-4 text-sm font-medium text-muted-foreground hover:bg-accent/5 hover:text-accent hover:border-accent/30 transition-all duration-300">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted group-hover:bg-accent/20 transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </div>
        Neue Aufgabe erstellen
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-lg shadow-black/20 animate-in zoom-in-95 duration-200">
      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Titel</Label>
        <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel der Aufgabe"
          className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Kategorie</Label>
          <Select value={category} onValueChange={(val) => setCategory(val as TaskCategory)}>
            <SelectTrigger className="h-9 rounded-xl border-input bg-background/50 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Routine">Routine</SelectItem>
              <SelectItem value="Haushalt">Haushalt</SelectItem>
              <SelectItem value="Gesundheit">Gesundheit</SelectItem>
              <SelectItem value="Sonstiges">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Wiederholung</Label>
          <Select value={repeat} onValueChange={(val) => setRepeat(val as TaskRepeat)}>
            <SelectTrigger className="h-9 rounded-xl border-input bg-background/50 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="täglich">Täglich</SelectItem>
              <SelectItem value="wöchentlich">Wöchentlich</SelectItem>
              <SelectItem value="manuell">Einmalig</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Priorität</Label>
          <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority)}>
             <SelectTrigger className="h-9 rounded-xl border-input bg-background/50 text-xs font-medium">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="hoch">Hoch 🔴</SelectItem>
               <SelectItem value="mittel">Mittel 🟡</SelectItem>
               <SelectItem value="niedrig">Niedrig 🟢</SelectItem>
             </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Fälligkeit (Optional)</Label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent h-9" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Verknüpftes Wissen (Optional)</Label>
        <Select value={knowledgeId} onValueChange={setKnowledgeId}>
          <SelectTrigger className="h-9 rounded-xl border-input bg-background/50 text-xs font-medium w-full">
            <SelectValue placeholder="Kein Wissenseintrag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Kein Wissenseintrag</SelectItem>
            {wissenEntries.map(w => (
              <SelectItem key={w.id} value={w.id}>{w.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center ml-1">
          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">XP Belohnung</Label>
          <span className="text-xs font-mono font-bold text-accent">+{xp} XP</span>
        </div>
        <input type="range" min="5" max="50" step="5" value={xp} onChange={(e) => setXp(Number(e.target.value))}
          className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-accent hover:accent-accent/80 transition-all" />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={() => setIsAdding(false)}
          className="flex-1 rounded-xl border border-input py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/10 hover:text-foreground transition-colors">
          Abbrechen
        </button>
        <button type="submit" disabled={!title.trim()}
          className="flex-1 rounded-xl bg-accent py-2.5 text-xs font-semibold text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 disabled:shadow-none transition-all">
          Erstellen
        </button>
      </div>
    </form>
  );
};

export default TaskCreator;
