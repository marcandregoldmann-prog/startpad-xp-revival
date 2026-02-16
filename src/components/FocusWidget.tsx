import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { loadFocusSession, startFocus, stopFocus } from '@/lib/focus';

const FocusWidget = () => {
  const [session, setSession] = useState(loadFocusSession);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!session.active || !session.startedAt) return;
    const interval = setInterval(() => {
      const start = new Date(session.startedAt!).getTime();
      const now = Date.now();
      setElapsed(Math.floor((now - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.active, session.startedAt]);

  const targetSeconds = session.duration * 60;
  const remaining = Math.max(0, targetSeconds - elapsed);
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = session.active ? Math.min(100, (elapsed / targetSeconds) * 100) : 0;
  const isDone = session.active && remaining <= 0;

  const handleStart = () => {
    const s = startFocus(25);
    setSession(s);
    setElapsed(0);
  };

  const handleStop = () => {
    const s = stopFocus();
    setSession(s);
    setElapsed(0);
  };

  return (
    <div className={`rounded-xl border p-4 space-y-3 transition-colors ${
      session.active ? (isDone ? 'border-pro bg-pro-muted' : 'border-wissen bg-wissen-muted') : 'border-border bg-card'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Fokus-Modus</h3>
        {session.active && (
          <span className={`text-xs font-mono ${isDone ? 'text-pro' : 'text-wissen'} animate-pulse-glow`}>
            {isDone ? '✓ Fertig!' : 'Aktiv'}
          </span>
        )}
      </div>

      {session.active ? (
        <>
          <div className="text-center">
            <span className="text-3xl font-mono font-bold text-foreground">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full bg-wissen transition-all duration-1000 ease-linear" style={{ width: `${progress}%` }} />
          </div>
          <button onClick={handleStop}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Pause className="h-4 w-4" /> Beenden
          </button>
        </>
      ) : (
        <button onClick={handleStart}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-90">
          <Play className="h-4 w-4" /> 25 Min starten
        </button>
      )}
    </div>
  );
};

export default FocusWidget;
