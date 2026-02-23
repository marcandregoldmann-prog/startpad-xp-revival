import { type Decision } from '@/lib/decisions';
import { ArrowRight, Calendar, Check, X } from 'lucide-react';

interface HistoryListProps {
  decisions: Decision[];
  onRefresh: () => void;
}

const HistoryList = ({ decisions }: HistoryListProps) => {
  if (decisions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-8 text-center animate-in zoom-in-95">
        <p className="text-sm text-muted-foreground">Keine Entscheidungen getroffen.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {decisions.map((decision) => {
        const isPositive = decision.result === 'Dafür';
        const color = isPositive ? 'text-emerald-500' : 'text-rose-500';
        const bg = isPositive ? 'bg-emerald-500/10' : 'bg-rose-500/10';

        return (
          <div key={decision.id} className="group relative rounded-2xl border border-white/5 bg-card/50 p-5 shadow-sm hover:border-white/10 hover:shadow-md hover:bg-white/5 transition-all duration-300">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-foreground leading-tight group-hover:text-accent transition-colors">{decision.title}</h3>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bg} ${color}`}>
                    {isPositive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    {decision.result}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-mono">
                    <Calendar className="h-3 w-3" />
                    {new Date(decision.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-500">{decision.proScore}</span>
                  <div className="h-3 w-px bg-white/10" />
                  <span className="text-xs font-bold text-rose-500">{decision.contraScore}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </div>

            {/* Hover Indicator */}
            <div className={`absolute left-0 top-6 h-8 w-0.5 rounded-r-full ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'} opacity-0 group-hover:opacity-100 transition-opacity`} />
          </div>
        );
      })}
    </div>
  );
};

export default HistoryList;
