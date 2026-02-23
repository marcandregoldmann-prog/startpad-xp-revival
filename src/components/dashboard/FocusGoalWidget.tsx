import { useState } from 'react';
import { Pencil, Award } from 'lucide-react';
import { saveWochenfokus } from '@/lib/focus';

export function FocusGoalWidget({ wochenfokus, setWochenfokus }: { wochenfokus: string, setWochenfokus: (val: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(wochenfokus);

  const handleSave = () => {
    saveWochenfokus(text);
    setWochenfokus(text);
    setEditing(false);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wochenfokus</h2>
        {!editing && (
          <button onClick={() => { setText(wochenfokus); setEditing(true); }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted/10">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {editing ? (
        <div className="rounded-2xl bg-card p-4 space-y-3 border border-border animate-in zoom-in-95 duration-200">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Was ist dein Fokus diese Woche?" rows={2}
            className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Abbrechen</button>
            <button onClick={handleSave} className="rounded-lg bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all">Speichern</button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-card p-5 border border-border shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
             <Award className="h-12 w-12 rotate-12 text-accent" />
          </div>
          <p className="text-base font-medium text-foreground relative z-10 leading-relaxed">
            {wochenfokus || <span className="text-muted-foreground italic">Kein Fokus gesetzt</span>}
          </p>
        </div>
      )}
    </section>
  );
}
