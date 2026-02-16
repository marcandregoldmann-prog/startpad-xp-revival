import { Flame, Trophy, Target, Zap } from 'lucide-react';
import type { TaskStats } from '@/lib/tasks';

interface StatsCardProps {
  stats: TaskStats;
}

const StatsCard = ({ stats }: StatsCardProps) => {
  const items = [
    { icon: <Target className="h-4 w-4 text-xp" />, label: 'Erledigt', value: stats.totalCompletedTasks },
    { icon: <Zap className="h-4 w-4 text-xp" />, label: 'Gesamt XP', value: stats.totalXP },
    { icon: <Flame className="h-4 w-4 text-streak" />, label: 'Streak', value: `${stats.currentStreak}d` },
    { icon: <Trophy className="h-4 w-4 text-streak" />, label: 'Bester Streak', value: `${stats.longestStreak}d` },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
          <div className="rounded-lg bg-secondary p-2">{item.icon}</div>
          <div>
            <p className="text-lg font-semibold font-mono text-foreground leading-none">{item.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
