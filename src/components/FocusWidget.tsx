import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Timer, Coffee } from 'lucide-react';
import { loadFocusSession, startFocus, stopFocus, type FocusSession } from '@/lib/focus';
import { addXP } from '@/lib/tasks';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const FocusWidget = () => {
  const [session, setSession] = useState<FocusSession>(loadFocusSession());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [targetDuration, setTargetDuration] = useState(25);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate time left based on startedAt
  useEffect(() => {
    if (session.active && session.startedAt) {
      const startTime = new Date(session.startedAt).getTime();
      const endTime = startTime + session.duration * 60 * 1000;
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(diff);

      if (diff > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleComplete();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Handle case where loaded session is already done
        handleComplete();
      }
    } else if (!isBreak) {
      setTimeLeft(targetDuration * 60);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.active, session.startedAt, session.duration]); // Re-run if session changes

  // Update timeLeft when targetDuration changes (only if not active)
  useEffect(() => {
    if (!session.active) {
      setTimeLeft(targetDuration * 60);
    }
  }, [targetDuration]);

  const handleStart = () => {
    const newSession = startFocus(targetDuration);
    setSession(newSession);
    setIsBreak(false);
    toast.success('Fokus-Session gestartet! Viel Erfolg.');
  };

  const handleStop = () => {
    const newSession = stopFocus();
    setSession(newSession);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(targetDuration * 60);
    setIsBreak(false);
  };

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newSession = stopFocus(); // Stop the session
    setSession(newSession);

    // XP Reward
    addXP(25); // 25 XP per session

    // Notification
    if (Notification.permission === 'granted') {
      new Notification('ClearMind OS', { body: 'Fokus-Session beendet! Zeit für eine Pause.' });
    }
    toast.success('Session beendet! +25 XP');

    // Start Break
    startBreak();
  };

  const startBreak = () => {
    setIsBreak(true);
    setTimeLeft(5 * 60); // 5 min break
    toast.info('5 Minuten Pause gestartet.');

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsBreak(false);
          setTimeLeft(targetDuration * 60);

          if (Notification.permission === 'granted') {
            new Notification('ClearMind OS', { body: 'Pause vorbei! Bereit für die nächste Runde?' });
          }
          toast.info('Pause vorbei.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = session.active
    ? ((session.duration * 60 - timeLeft) / (session.duration * 60)) * 100
    : isBreak
      ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
      : 0;

  return (
    <div className="rounded-3xl bg-card p-6 shadow-xl shadow-black/5 border border-border relative overflow-hidden">
      {/* Background Progress */}
      <div
        className={`absolute inset-0 opacity-10 pointer-events-none transition-all duration-1000 ${isBreak ? 'bg-blue-500' : 'bg-focus'}`}
        style={{ width: `${progress}%` }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-1">
           <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center justify-center gap-2">
             {isBreak ? <Coffee className="h-4 w-4" /> : <Timer className="h-4 w-4" />}
             {isBreak ? 'Pause' : 'Fokus Timer'}
           </h2>
           <div className="font-mono text-5xl font-bold tracking-tight tabular-nums text-foreground">
             {formatTime(timeLeft)}
           </div>
        </div>

        {!session.active && !isBreak && (
          <div className="flex gap-2">
             {[15, 25, 50].map(m => (
               <button key={m} onClick={() => setTargetDuration(m)}
                 className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${targetDuration === m ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}>
                 {m} min
               </button>
             ))}
          </div>
        )}

        <div className="flex gap-4">
          {!session.active && !isBreak ? (
            <button onClick={handleStart}
              className="h-14 w-14 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
              <Play className="h-6 w-6 ml-1" fill="currentColor" />
            </button>
          ) : (
            <button onClick={handleStop}
              className="h-14 w-14 rounded-full bg-red-500/10 text-red-500 border-2 border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-all">
              <Square className="h-5 w-5 fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusWidget;
