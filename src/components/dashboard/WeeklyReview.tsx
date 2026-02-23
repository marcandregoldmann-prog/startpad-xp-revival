import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { loadTasks, loadCompletions, getTodaysTasks, type Task } from '@/lib/tasks';
import { BarChart, Activity, Zap, CheckCircle2, CalendarDays } from 'lucide-react';
import { saveJournalEntry } from '@/lib/journal';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface WeeklyReviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WeeklyReview({ open, onOpenChange }: WeeklyReviewProps) {
  const [step, setStep] = useState(1);
  const [reflection, setReflection] = useState({
    good: '',
    improve: '',
    nextFocus: ''
  });

  // Calculate stats
  const tasks = loadTasks();
  const completions = loadCompletions();

  const now = new Date();
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  const weekCompletions = completions.filter(c => new Date(c.completedAt) >= oneWeekAgo);
  const completedCount = weekCompletions.length;

  const weekXP = weekCompletions.reduce((sum, c) => {
    const task = tasks.find(t => t.id === c.taskId);
    return sum + (task?.xp || 0);
  }, 0);

  const bestDay = weekCompletions.reduce((acc, c) => {
    const day = new Date(c.completedAt).toLocaleDateString('de-DE', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bestDayName = Object.entries(bestDay).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Keine Daten';

  const handleSave = () => {
    const content = `Wochenrückblick:\n\nWas lief gut:\n${reflection.good}\n\nWas kann besser werden:\n${reflection.improve}\n\nFokus nächste Woche:\n${reflection.nextFocus}`;
    saveJournalEntry(content, 'reflection');
    toast.success('Wochenrückblick gespeichert! 🎉');
    onOpenChange(false);
    setStep(1);
    setReflection({ good: '', improve: '', nextFocus: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-accent" />
            Wochenrückblick
          </DialogTitle>
          <DialogDescription>
            Nimm dir einen Moment Zeit, um deine Woche zu reflektieren.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 border border-border/50">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                  <span className="text-2xl font-bold">{completedCount}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">Aufgaben</span>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 border border-border/50">
                  <Zap className="h-8 w-8 text-yellow-500 mb-2" />
                  <span className="text-2xl font-bold">{weekXP}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">XP Gesammelt</span>
                </div>
              </div>

              <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent" />
                  Produktivster Tag
                </h4>
                <p className="text-lg font-medium text-accent">{bestDayName}</p>
                <p className="text-xs text-muted-foreground">An diesem Tag hast du am meisten erledigt.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Was lief diese Woche gut?</label>
                <Textarea
                  value={reflection.good}
                  onChange={e => setReflection({...reflection, good: e.target.value})}
                  placeholder="Erfolge, kleine Siege..."
                  className="h-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Was kann besser laufen?</label>
                <Textarea
                  value={reflection.improve}
                  onChange={e => setReflection({...reflection, improve: e.target.value})}
                  placeholder="Herausforderungen, Ablenkungen..."
                  className="h-20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Fokus für nächste Woche</label>
                <Textarea
                  value={reflection.nextFocus}
                  onChange={e => setReflection({...reflection, nextFocus: e.target.value})}
                  placeholder="Ein Hauptziel..."
                  className="h-20"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2 sm:justify-between">
          {step === 2 && (
            <Button variant="ghost" onClick={() => setStep(1)}>Zurück</Button>
          )}
          <div className="flex gap-2 ml-auto">
             <Button variant="outline" onClick={() => onOpenChange(false)}>Schließen</Button>
             {step === 1 ? (
               <Button onClick={() => setStep(2)}>Weiter zur Reflexion</Button>
             ) : (
               <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">Abschließen</Button>
             )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
