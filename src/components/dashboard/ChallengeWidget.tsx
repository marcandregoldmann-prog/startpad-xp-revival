import { useEffect, useState } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { getDailyChallenge } from '@/lib/challenges';
import { addXP } from '@/lib/tasks';
import { toast } from 'sonner';

export function ChallengeWidget() {
  const [challenge, setChallenge] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setChallenge(getDailyChallenge());
    const saved = localStorage.getItem('clearmind-challenge-completed');
    if (saved) {
      try {
        const { date, done } = JSON.parse(saved);
        if (date === new Date().toISOString().split('T')[0] && done) {
          setCompleted(true);
        }
      } catch (e) {
        // invalid json
      }
    }
  }, []);

  const handleComplete = () => {
    if (completed) return;
    setCompleted(true);
    addXP(10);
    localStorage.setItem('clearmind-challenge-completed', JSON.stringify({
      date: new Date().toISOString().split('T')[0],
      done: true
    }));
    toast.success('Challenge gemeistert! +10 XP');
  };

  return (
    <div className="rounded-2xl bg-card p-5 border border-border shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-colors ${completed ? 'bg-green-500 text-white' : 'bg-accent/10 text-accent'}`}>
          {completed ? <CheckCircle2 className="h-5 w-5" /> : <Target className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-0.5">Tages-Challenge</p>
          <p className={`text-sm font-medium truncate ${completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {challenge}
          </p>
        </div>
      </div>
      {!completed && (
        <button onClick={handleComplete} className="text-xs font-bold bg-accent text-accent-foreground px-3 py-1.5 rounded-lg shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all shrink-0">
          Fertig
        </button>
      )}
    </div>
  );
}
