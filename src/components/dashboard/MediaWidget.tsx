import { Play, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WissenEntry } from '@/lib/wissen';

export function MediaWidget({ runningMedia }: { runningMedia: WissenEntry[] }) {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Aktuell laufend</h2>
      {runningMedia.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">Keine laufenden Inhalte.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {runningMedia.map(entry => (
            <button key={entry.id} onClick={() => navigate('/wissen')}
              className="group w-full flex items-center gap-4 rounded-2xl bg-card p-4 hover:bg-card/80 transition-all hover:scale-[1.02] active:scale-[0.98] border border-border shadow-sm hover:shadow-md">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-wissen/10 text-wissen group-hover:bg-wissen group-hover:text-white transition-colors">
                <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-wissen transition-colors">{entry.title}</p>
                <p className="text-[11px] text-muted-foreground">{entry.type}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-wissen group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
