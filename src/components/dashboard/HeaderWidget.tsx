import { useState, useEffect } from 'react';
import { Calendar, Award, Flame, Zap } from 'lucide-react';
import { TaskStats, Task } from '@/lib/tasks';

interface HeaderWidgetProps {
  stats: TaskStats;
  todaysXP: number;
  openTasksCount: number;
}

export function HeaderWidget({ stats, todaysXP, openTasksCount }: HeaderWidgetProps) {
  const [now, setNow] = useState(new Date());
  const [name, setName] = useState('User');

  useEffect(() => {
    const savedName = localStorage.getItem('clearmind-username');
    if (savedName) setName(savedName);

    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = now.getHours();
  let greeting = 'Hallo';
  if (hour < 12) greeting = 'Guten Morgen';
  else if (hour < 18) greeting = 'Guten Tag';
  else greeting = 'Guten Abend';

  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-tageskompass p-6 shadow-xl shadow-purple-500/10 min-h-[160px] flex flex-col justify-between">
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-zinc-800/80">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">{dateStr}</span>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {greeting}, {name}.
          </h2>
          <p className="text-sm font-medium text-zinc-700">
            {openTasksCount === 0
              ? 'Alles erledigt für heute! 🎉'
              : `Noch ${openTasksCount} Aufgaben offen.`}
          </p>
        </div>

        <div className="flex flex-col gap-1.5 items-end">
           <div className="font-mono text-2xl font-bold tracking-tight text-zinc-900/80 mb-1">
            {timeStr}
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-md px-2.5 py-1 shadow-sm border border-white/20">
            <Flame className="h-3.5 w-3.5 text-orange-600" />
            <span className="text-[10px] font-bold text-zinc-900">{stats.currentStreak}d Streak</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-white/30 backdrop-blur-md px-2.5 py-1 shadow-sm border border-white/20">
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[10px] font-bold text-zinc-900">+{todaysXP} XP</span>
          </div>
        </div>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/20 blur-3xl pointer-events-none"></div>
    </div>
  );
}
