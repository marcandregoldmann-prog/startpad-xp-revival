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

const Tasks = () => {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [completions, setCompletions] = useState<TaskCompletion[]>([]);
  const [stats, setStats] = useState<TaskStats>(loadStats());
  const [showStats, setShowStats] = useState(false);

  const refresh = useCallback(() => {
    setAllTasks(loadTasks());
    setCompletions(loadCompletions());
    setStats(checkStreakReset());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const todaysTasks = getTodaysTasks(allTasks);
  const completedCount = todaysTasks.filter(t => isTaskCompletedToday(t.id, completions)).length;

  const handleComplete = (task: Task) => {
    const updatedStats = completeTask(task.id, task.xp);
    setStats(updatedStats);
    setCompletions(loadCompletions());
  };

  const handleDelete = (id: string) => { deleteTask(id); refresh(); };
  const handleTaskCreated = () => { refresh(); };

  return (
    <div className="space-y-5">
      <XPBar totalXP={stats.totalXP} level={stats.level} />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Heute</h2>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">{completedCount} / {todaysTasks.length} erledigt</p>
        </div>
        <button onClick={() => setShowStats(!showStats)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${showStats ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          Statistik
        </button>
      </div>
      {showStats && <StatsCard stats={stats} />}
      <div className="space-y-2">
        {todaysTasks.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">Noch keine Aufgaben erstellt.</p>
        ) : (
          todaysTasks.map(task => (
            <TaskItem key={task.id} task={task} completed={isTaskCompletedToday(task.id, completions)}
              onComplete={handleComplete} onDelete={handleDelete} />
          ))
        )}
      </div>
      <TaskCreator onTaskCreated={handleTaskCreated} />
    </div>
  );
};

export default Tasks;
