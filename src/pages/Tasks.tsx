import { useState, useEffect, useCallback } from 'react';
import TaskItem from '@/components/TaskItem';
import TaskCreator from '@/components/TaskCreator';
import XPBar from '@/components/XPBar';
import StatsCard from '@/components/StatsCard';
import {
  loadTasks, loadCompletions, loadStats, getTodaysTasks,
  isTaskCompletedToday, completeTask, checkStreakReset, deleteTask,
  type Task, type TaskCompletion, type TaskStats,
} from '@/lib/tasks';
import { BarChart3 } from 'lucide-react';

// Error Boundary Component (Simple inline version)
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
      <h3 className="text-lg font-bold text-red-500 mb-2">Da ist etwas schief gelaufen</h3>
      <p className="text-sm text-red-400 mb-4">{error.message}</p>
      <button onClick={resetErrorBoundary} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white">
        Erneut versuchen
      </button>
    </div>
  );
};

const Tasks = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    totalXP: 0, level: 1, currentStreak: 0, longestStreak: 0, totalCompletedTasks: 0, lastCompletionDate: null
  });
  const [showStats, setShowStats] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(() => {
    try {
      const loadedTasks = loadTasks() || [];
      const loadedCompletions = loadCompletions() || [];
      const loadedStats = checkStreakReset(); // checkStreakReset calls loadStats internally

      setAllTasks(loadedTasks);
      setCompletions(loadedCompletions);
      setStats(loadedStats);
      setError(null);
    } catch (err) {
      console.error("Failed to load tasks data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error loading tasks'));
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={refresh} />;
  }

  // Safe derivation of today's tasks
  const todaysTasks = Array.isArray(allTasks) ? getTodaysTasks(allTasks) : [];
  const completedCount = todaysTasks.filter(t => isTaskCompletedToday(t.id, completions)).length;

  const handleComplete = (task: Task) => {
    try {
      const updatedStats = completeTask(task.id, task.xp);
      setStats(updatedStats);
      setCompletions(loadCompletions());
    } catch (err) {
      console.error("Failed to complete task:", err);
    }
  };

  const handleDelete = (id: string) => {
    try {
      deleteTask(id);
      refresh();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleTaskCreated = () => { refresh(); };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <XPBar totalXP={stats?.totalXP || 0} level={stats?.level || 1} />

      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Heute</h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-medium">{completedCount} / {todaysTasks.length} erledigt</p>
        </div>
        <button onClick={() => setShowStats(!showStats)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${showStats ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
          <BarChart3 className="h-3.5 w-3.5" />
          Statistik
        </button>
      </div>

      {showStats && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <StatsCard stats={stats} />
        </div>
      )}

      <div className="space-y-3 pb-20">
        {todaysTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-8 text-center">
            <p className="text-sm text-muted-foreground">Noch keine Aufgaben für heute.</p>
          </div>
        ) : (
          todaysTasks.map(task => (
            <TaskItem key={task.id} task={task} completed={isTaskCompletedToday(task.id, completions)}
              onComplete={handleComplete} onDelete={handleDelete} />
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
