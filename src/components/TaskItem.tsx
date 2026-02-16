import { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/tasks';

interface TaskItemProps {
  task: Task;
  completed: boolean;
  onComplete: (task: Task) => void;
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  Haushalt: 'bg-xp-muted text-xp',
  Gesundheit: 'bg-pro-muted text-pro',
  Routine: 'bg-accent text-accent-foreground',
  Sonstiges: 'bg-secondary text-secondary-foreground',
};

const TaskItem = ({ task, completed, onComplete, onDelete }: TaskItemProps) => {
  const [animating, setAnimating] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const handleComplete = () => {
    if (completed) return;
    setAnimating(true);
    setShowXP(true);
    setTimeout(() => setAnimating(false), 300);
    setTimeout(() => setShowXP(false), 800);
    onComplete(task);
  };

  return (
    <div
      className={`relative flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-all duration-200 ${
        animating ? 'animate-task-complete' : ''
      } ${completed ? 'opacity-60' : ''}`}
    >
      <button
        onClick={handleComplete}
        disabled={completed}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-200 ${
          completed
            ? 'border-pro/50 bg-pro/20'
            : 'border-border hover:border-muted-foreground'
        }`}
      >
        {completed && (
          <Check className="h-3.5 w-3.5 text-pro animate-check-in" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium transition-all ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${categoryColors[task.category] || 'bg-secondary text-secondary-foreground'}`}>
            {task.category}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {task.repeat}
          </span>
        </div>
      </div>

      <span className="text-xp font-mono text-xs font-semibold shrink-0">
        +{task.xp} XP
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground hover:text-contra transition-colors shrink-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {showXP && (
        <div className="absolute right-12 top-1 animate-xp-pop text-xp font-mono text-sm font-bold pointer-events-none">
          +{task.xp}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
