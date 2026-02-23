import { xpForCurrentLevel, xpToNextLevel } from '@/lib/tasks';

interface XPBarProps {
  totalXP: number;
  level: number;
}

const XPBar = ({ totalXP, level }: XPBarProps) => {
  const currentLevelXP = xpForCurrentLevel(totalXP);
  const needed = xpToNextLevel();
  const percent = Math.round((currentLevelXP / needed) * 100);

  return (
    <div className="rounded-2xl border border-white/5 bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-level font-mono text-sm font-semibold">LVL {level}</span>
        </div>
        <span className="text-xp font-mono text-xs">
          {currentLevelXP} / {needed} XP
        </span>
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="h-full rounded-full bg-xp transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="text-right">
        <span className="text-xs text-muted-foreground font-mono">
          Gesamt: {totalXP} XP
        </span>
      </div>
    </div>
  );
};

export default XPBar;
