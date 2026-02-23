import { useState } from 'react';
import { Trash2, Archive, Calendar, Check, MoreVertical, Plus, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { type Task, type Subtask, type TaskPriority } from '@/lib/tasks';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskItemProps {
  task: Task;
  completed: boolean;
  onComplete: (task: Task) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  hoch: 'text-red-500 bg-red-500/10 border-red-500/20',
  mittel: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
  niedrig: 'text-green-500 bg-green-500/10 border-green-500/20',
};

const TaskItem = ({ task, completed, onComplete, onDelete, onArchive, onUpdate }: TaskItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const handleSubtaskToggle = (subtaskId: string) => {
    const updated = task.subtasks?.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s) || [];
    onUpdate(task.id, { subtasks: updated });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const newSub: Subtask = { id: crypto.randomUUID(), title: newSubtask.trim(), completed: false };
    onUpdate(task.id, { subtasks: [...(task.subtasks || []), newSub] });
    setNewSubtask('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updated = task.subtasks?.filter(s => s.id !== subtaskId) || [];
    onUpdate(task.id, { subtasks: updated });
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate(task.id, { note: e.target.value });
  };

  const priorityColor = task.priority ? priorityColors[task.priority] : '';

  return (
    <div
      className={cn(
        "group relative rounded-2xl border bg-card transition-all duration-300",
        completed
          ? "border-emerald-500/20 bg-emerald-500/5 shadow-none"
          : "border-border shadow-sm hover:border-border/80 hover:shadow-md hover:bg-card/80",
        expanded ? "ring-1 ring-accent/50" : ""
      )}
    >
      <div className="flex items-center gap-3.5 p-4">
        <button
          onClick={() => !completed && onComplete(task)}
          className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            completed
              ? "bg-emerald-500 scale-110 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20"
              : "border-2 border-muted-foreground/30 hover:border-accent hover:bg-accent/10"
          )}
        >
          {completed && <Check className="h-3.5 w-3.5 text-white animate-in zoom-in font-bold" />}
        </button>

        <div className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-sm font-medium transition-colors truncate",
              completed ? "text-muted-foreground line-through decoration-emerald-500/30 decoration-2" : "text-foreground"
            )}>
              {task.title}
            </span>
            {task.priority && (
              <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full border font-medium uppercase tracking-wider", priorityColor)}>
                {task.priority}
              </span>
            )}
            {task.dueDate && (
              <span className={cn("text-[10px] flex items-center gap-1 ml-1",
                 new Date(task.dueDate) < new Date() && !completed ? "text-red-400 font-bold" : "text-muted-foreground"
              )}>
                <Calendar className="h-3 w-3" />
                {new Date(task.dueDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
              </span>
            )}
            {task.knowledgeId && (
              <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 ml-1" title="Verknüpftes Wissen">
                <BookOpen className="h-3 w-3" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5">
             <span className={cn("text-[10px] font-mono transition-colors", completed ? "text-emerald-500/50" : "text-muted-foreground group-hover:text-accent/80")}>
              +{task.xp} XP
            </span>
            {(task.subtasks?.length || 0) > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Check className="h-3 w-3" />
                {task.subtasks?.filter(s => s.completed).length}/{task.subtasks?.length}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/10 transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/10 transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onArchive(task.id)}>
                <Archive className="mr-2 h-4 w-4" /> Archivieren
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-4 animate-in slide-in-from-top-1 duration-200">
          <div className="h-px bg-border/50" />

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Notiz</label>
            <Textarea
              value={task.note || ''}
              onChange={handleNoteChange}
              placeholder="Notizen zur Aufgabe..."
              className="text-xs min-h-[60px] bg-muted/20 border-border resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Teilaufgaben</label>
            <div className="space-y-2 pl-1">
              {task.subtasks?.map(sub => (
                <div key={sub.id} className="flex items-center gap-2 group/sub">
                  <button onClick={() => handleSubtaskToggle(sub.id)}
                    className={cn(
                      "h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0",
                      sub.completed ? "bg-accent border-accent text-accent-foreground" : "border-muted-foreground/30 hover:border-accent"
                    )}>
                    {sub.completed && <Check className="h-3 w-3" />}
                  </button>
                  <span className={cn("text-xs flex-1 truncate cursor-pointer select-none", sub.completed ? "line-through text-muted-foreground" : "text-foreground")} onClick={() => handleSubtaskToggle(sub.id)}>
                    {sub.title}
                  </span>
                  <button onClick={() => handleDeleteSubtask(sub.id)} className="opacity-0 group-hover/sub:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-opacity">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <div className="flex gap-2 items-center mt-2">
                <input
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask()}
                  placeholder="Neue Teilaufgabe..."
                  className="flex-1 bg-transparent text-xs border-b border-border py-1 focus:outline-none focus:border-accent transition-colors"
                />
                <button onClick={handleAddSubtask} disabled={!newSubtask.trim()}
                  className="p-1 text-muted-foreground hover:text-accent disabled:opacity-50 transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
