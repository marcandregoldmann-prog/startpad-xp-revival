import { useNavigate } from 'react-router-dom';

export function ProgressWidget({ completed, total }: { completed: number, total: number }) {
  const navigate = useNavigate();
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Tagesfortschritt</h2>
      <div className="rounded-2xl bg-card p-5 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{Math.round(percentage)}%</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Erledigt</p>
          </div>
          <button onClick={() => navigate('/tasks')}
            className="rounded-full bg-accent/10 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/20 transition-colors border border-accent/20">
            Aufgaben öffnen
          </button>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            style={{ width: `${percentage}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-right">{completed} / {total} Aufgaben</p>
      </div>
    </section>
  );
}
