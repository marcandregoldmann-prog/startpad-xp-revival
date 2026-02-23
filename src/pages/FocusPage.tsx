import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Square, X, Volume2, VolumeX } from 'lucide-react';
import { loadFocusSession, startFocus, stopFocus, type FocusSession } from '@/lib/focus';
import { addXP } from '@/lib/tasks';
import { waterGarden } from '@/lib/garden';
import { playNoise, stopNoise, NoiseType } from '@/lib/audio';
import { toast } from 'sonner';

const FocusPage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<FocusSession>(loadFocusSession());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundType, setSoundType] = useState<NoiseType>('brown');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
        handleComplete();
      }
    } else {
      setTimeLeft(session.duration * 60);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.active, session.startedAt, session.duration]);

  useEffect(() => {
    if (session.active && soundEnabled && !isBreak) {
      playNoise(soundType);
    } else {
      stopNoise();
    }
    return () => stopNoise();
  }, [session.active, soundEnabled, soundType, isBreak]);

  const handleStart = () => {
    const newSession = startFocus(25); // Default 25 in this view
    setSession(newSession);
    setIsBreak(false);
  };

  const handleStop = () => {
    const newSession = stopFocus();
    setSession(newSession);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(25 * 60);
    setIsBreak(false);
  };

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const newSession = stopFocus();
    setSession(newSession);
    addXP(25);
    const { evolved } = waterGarden(session.duration);
    if (evolved > 0) toast.success('Garten gewachsen! 🌱');
    toast.success('Session beendet!');
    startBreak();
  };

  const startBreak = () => {
    setIsBreak(true);
    setTimeLeft(5 * 60);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsBreak(false);
          setTimeLeft(25 * 60);
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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden">
      <button onClick={() => navigate('/')} className="absolute top-6 right-6 p-3 rounded-full hover:bg-muted/20 text-muted-foreground hover:text-foreground transition-colors z-50">
        <X className="h-6 w-6" />
      </button>

      <div className="z-10 text-center space-y-8 animate-in zoom-in duration-300">
        <h1 className="text-xl font-medium tracking-widest uppercase text-muted-foreground">
          {isBreak ? 'Pause' : 'Focus Mode'}
        </h1>
        <div className="font-mono text-8xl sm:text-9xl font-bold tracking-tighter text-foreground tabular-nums select-none">
          {formatTime(timeLeft)}
        </div>

        <div className="flex items-center justify-center gap-6">
          {!session.active && !isBreak ? (
            <button onClick={handleStart} className="h-24 w-24 rounded-full bg-foreground text-background flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all">
              <Play className="h-10 w-10 ml-1" fill="currentColor" />
            </button>
          ) : (
            <button onClick={handleStop} className="h-24 w-24 rounded-full bg-red-500/10 text-red-500 border-2 border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-all">
              <Square className="h-8 w-8 fill-current" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-8">
           <button onClick={() => setSoundEnabled(!soundEnabled)}
             className={`p-4 rounded-full transition-all ${soundEnabled ? 'bg-accent/20 text-accent ring-1 ring-accent' : 'bg-muted/10 text-muted-foreground hover:bg-muted/20'}`}>
             {soundEnabled ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
           </button>
           {soundEnabled && (
             <div className="flex gap-2">
               {(['white', 'pink', 'brown'] as const).map(t => (
                 <button key={t} onClick={() => setSoundType(t)}
                   className={`px-3 py-1 rounded-full text-xs font-mono border transition-all ${soundType === t ? 'bg-accent border-accent text-foreground' : 'border-muted text-muted-foreground'}`}>
                   {t}
                 </button>
               ))}
             </div>
           )}
        </div>
      </div>

      {/* Background Ambience */}
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${session.active ? 'opacity-20 bg-accent/5' : 'opacity-0'}`} />
    </div>
  );
};

export default FocusPage;
