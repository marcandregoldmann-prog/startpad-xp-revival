import { useState, useEffect } from 'react';
import { Moon, Award, RefreshCw, PenLine } from 'lucide-react';
import { saveTagesabschluss, hasTagesabschlussToday } from '@/lib/focus';
import { saveJournalEntry } from '@/lib/journal';
import { toast } from 'sonner';

const REFLECTION_PROMPTS = [
  "Was hat mich heute glücklich gemacht?",
  "Was habe ich heute gelernt?",
  "Wofür bin ich heute besonders dankbar?",
  "Was würde ich morgen anders machen?",
  "Welche Entscheidung war heute wichtig?",
  "Habe ich mich heute gut um mich selbst gekümmert?",
  "Welcher Moment ist mir heute besonders in Erinnerung geblieben?",
  "Was habe ich heute geschafft, auf das ich stolz bin?",
];

export function ReflectionWidget() {
  const [showAbschluss, setShowAbschluss] = useState(false);
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState('');
  const [done, setDone] = useState(hasTagesabschlussToday());
  const [prompt, setPrompt] = useState(REFLECTION_PROMPTS[0]);

  useEffect(() => {
    if (showAbschluss) {
      setPrompt(REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]);
    }
  }, [showAbschluss]);

  const cyclePrompt = () => {
    let newPrompt;
    do {
      newPrompt = REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)];
    } while (newPrompt === prompt);
    setPrompt(newPrompt);
  };

  const handleAbschluss = () => {
    const fullNote = `${prompt}\n\n${note}`;
    saveTagesabschluss({ date: new Date().toISOString().split('T')[0], mood, note: fullNote });

    // Also save as a journal entry for the new system
    saveJournalEntry(fullNote, 'reflection');

    setShowAbschluss(false);
    setNote('');
    setDone(true);
    toast.success("Tagesabschluss gespeichert!");
  };

  if (done && !showAbschluss) {
    return (
      <section className="pb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Reflexion</h2>
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center flex flex-col items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Award className="h-4 w-4" />
          </div>
          <p className="text-sm text-emerald-500 font-medium">Tagesabschluss erledigt</p>
          <button onClick={() => setShowAbschluss(true)} className="text-xs text-muted-foreground hover:text-foreground underline mt-1 flex items-center gap-1">
            <PenLine className="h-3 w-3" /> Überarbeiten / Ergänzen
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-8">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Reflexion</h2>
      {showAbschluss ? (
        <div className="rounded-2xl bg-card p-5 space-y-4 border border-border animate-in slide-in-from-bottom-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Wie war dein Tag?</p>
            <div className="flex justify-between gap-1">
              {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
                <button key={i} onClick={() => setMood(i + 1)}
                  className={`text-2xl p-2 rounded-xl transition-all ${mood === i + 1 ? 'bg-accent/20 scale-110 ring-1 ring-accent' : 'opacity-40 hover:opacity-100 hover:bg-muted/10'}`}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent/80 flex items-center gap-1.5">
                Impulsfrage
              </p>
              <button onClick={cyclePrompt} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted/20" title="Neue Frage">
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
            <p className="text-sm font-medium text-foreground/90 italic">"{prompt}"</p>
          </div>

          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Deine Gedanken dazu..." rows={3}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent resize-none" />

          <div className="flex gap-3">
            <button onClick={() => setShowAbschluss(false)}
              className="rounded-xl border border-input px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/10 transition-colors flex-1">Abbrechen</button>
            <button onClick={handleAbschluss}
              className="flex-1 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-opacity shadow-lg shadow-black/5">Abschließen</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAbschluss(true)}
          className="group w-full rounded-2xl border border-dashed border-border py-4 text-sm text-muted-foreground hover:text-accent hover:border-accent/50 hover:bg-accent/5 transition-all flex items-center justify-center gap-2">
          <Moon className="h-4 w-4 group-hover:-rotate-12 transition-transform" />
          <span className="font-medium">Tag abschließen</span>
        </button>
      )}
    </section>
  );
}
