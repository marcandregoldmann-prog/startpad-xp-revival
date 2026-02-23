import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { xpForCurrentLevel, xpToNextLevel } from '@/lib/tasks';

interface XPBarProps {
  totalXP: number;
  level: number;
}

const XPBar = ({ totalXP, level }: XPBarProps) => {
  const currentLevelXP = xpForCurrentLevel(totalXP);
  const needed = xpToNextLevel();
  const percent = Math.round((currentLevelXP / needed) * 100);
  const prevLevel = useRef(level);

  useEffect(() => {
    if (level > prevLevel.current) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast.success(`Level Up! Du bist jetzt Level ${level}! 🎉`);
    }
    prevLevel.current = level;
  }, [level]);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-level font-mono text-sm font-semibold text-accent">LVL {level}</span>
        </div>
        <span className="text-xp font-mono text-xs text-muted-foreground">
          {currentLevelXP} / {needed} XP
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.3)]"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <div className="text-right">
        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
          Total: {totalXP} XP
        </span>
      </div>
    </div>
  );
};

export default XPBar;
