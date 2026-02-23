import { Trash2 } from 'lucide-react';
import { type Task } from '@/lib/tasks';

interface TaskItemProps {
  task: Task;
  completed: boolean;
  onComplete: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, completed, onComplete, onDelete }: TaskItemProps) => {
  return (
    <div
      className={`group relative flex items-center gap-3.5 rounded-2xl border bg-card p-4 transition-all duration-300 ${
        completed
          ? 'border-emerald-500/20 bg-emerald-500/5 shadow-none'
          : 'border-white/5 shadow-sm hover:border-white/10 hover:shadow-md hover:bg-white/5'
      }`}
    >
      <button
        onClick={() => !completed && onComplete(task)}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
          completed
            ? 'bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20'
            : 'border-2 border-muted-foreground/30 hover:border-accent hover:bg-accent/10'
        }`}
      >
        {completed && <span className="text-xs text-white animate-in zoom-in font-bold">✓</span>}
      </button>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className={`text-sm font-medium transition-colors truncate ${
          completed ? 'text-emerald-500/80 line-through decoration-emerald-500/30 decoration-2' : 'text-foreground'
        }`}>
          {task.title}
        </span>
        <span className={`text-[10px] font-mono transition-colors ${
          completed ? 'text-emerald-500/50' : 'text-muted-foreground group-hover:text-accent/80'
        }`}>
          +{task.xp} XP
        </span>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="text-muted-foreground/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-400/10"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TaskItem;
