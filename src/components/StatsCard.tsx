import { type TaskStats } from '@/lib/tasks';
import { BarChart3, Target, Calendar } from 'lucide-react';

interface StatsCardProps {
  stats: TaskStats;
}

const StatsCard = ({ stats }: StatsCardProps) => {
  return (
    <div className="rounded-2xl border border-white/5 bg-card/50 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Statistik</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-accent/5 p-4 border border-accent/10 hover:bg-accent/10 transition-colors">
          <div className="flex items-center gap-2 text-accent mb-2">
            <Target className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wide">Gesamt</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.totalCompletedTasks}</p>
          <p className="text-[10px] text-muted-foreground">Aufgaben erledigt</p>
        </div>

        <div className="rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wide">Streak</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.currentStreak} <span className="text-sm font-normal text-muted-foreground">Tage</span></p>
          <p className="text-[10px] text-muted-foreground">in Folge aktiv</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
