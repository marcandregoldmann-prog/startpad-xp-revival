import { useState, useEffect, useCallback } from 'react';
import TaskItem from '@/components/TaskItem';
import TaskCreator from '@/components/TaskCreator';
import XPBar from '@/components/XPBar';
import StatsCard from '@/components/StatsCard';
import {
  loadTasks, loadCompletions, loadStats, getTodaysTasks,
  isTaskCompletedToday, completeTask, checkStreakReset, deleteTask, updateTask,
  type Task, type TaskCompletion, type TaskStats,
} from '@/lib/tasks';
import { BarChart3, Archive, CheckCheck } from 'lucide-react';

const Tasks = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [stats, setStats] = useState<TaskStats>(loadStats());
  const [showStats, setShowStats] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const refresh = useCallback(() => {
    setAllTasks(loadTasks());
    setCompletions(loadCompletions());
    setStats(checkStreakReset());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const todaysTasks = getTodaysTasks(allTasks);
  const archivedTasks = allTasks.filter(t => t.isArchived);
  const completedCount = todaysTasks.filter(t => isTaskCompletedToday(t.id, completions)).length;

  const handleComplete = (task: Task) => {
    const updatedStats = completeTask(task.id, task.xp);
    setStats(updatedStats);
    setCompletions(loadCompletions());
  };

  const handleCompleteAll = () => {
    if (confirm('Alle offenen Aufgaben von heute als erledigt markieren?')) {
      todaysTasks.forEach(t => {
        if (!isTaskCompletedToday(t.id, completions)) {
          completeTask(t.id, t.xp);
        }
      });
      refresh();
    }
  };

  const handleDelete = (id: string) => { deleteTask(id); refresh(); };
  const handleArchive = (id: string) => { updateTask(id, { isArchived: true }); refresh(); };
  const handleRestore = (id: string) => { updateTask(id, { isArchived: false }); refresh(); };
  const handleUpdate = (id: string, updates: Partial<Task>) => { updateTask(id, updates); refresh(); };
  const handleTaskCreated = () => { refresh(); };

  if (showArchived) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-20">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold">Archiv</h2>
          <button onClick={() => setShowArchived(false)} className="text-sm text-accent font-medium hover:underline">
            Zurück
          </button>
        </div>
        <div className="space-y-3">
          {archivedTasks.length === 0 ? <p className="text-muted-foreground text-center py-8">Leer.</p> :
            archivedTasks.map(task => (
              <div key={task.id} className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
                <span className="font-medium">{task.title}</span>
                <div className="flex gap-2">
                   <button onClick={() => handleRestore(task.id)} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md">Wiederherstellen</button>
                   <button onClick={() => handleDelete(task.id)} className="text-xs text-red-400 px-2 py-1">Löschen</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <XPBar totalXP={stats.totalXP} level={stats.level} />

      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Heute</h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{completedCount} / {todaysTasks.length} erledigt</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleCompleteAll} title="Alle erledigen"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/10 hover:text-foreground transition-all">
            <CheckCheck className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setShowArchived(true)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/10 hover:text-foreground transition-all">
            <Archive className="h-3.5 w-3.5" />
            Archiv
          </button>
          <button onClick={() => setShowStats(!showStats)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${showStats ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/25' : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'}`}>
            <BarChart3 className="h-3.5 w-3.5" />
            Statistik
          </button>
        </div>
      </div>

      {showStats && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <StatsCard stats={stats} />
        </div>
      )}

      <div className="space-y-3 pb-20">
        {todaysTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">Noch keine Aufgaben für heute.</p>
          </div>
        ) : (
          todaysTasks.map(task => (
            <TaskItem key={task.id} task={task} completed={isTaskCompletedToday(task.id, completions)}
              onComplete={handleComplete} onDelete={handleDelete} onArchive={handleArchive} onUpdate={handleUpdate} />
          ))
        )}

        {/* Task Creator at the bottom of the list */}
        <div className="pt-2">
          <TaskCreator onTaskCreated={handleTaskCreated} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
