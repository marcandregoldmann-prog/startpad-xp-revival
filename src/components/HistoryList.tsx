import { Decision, deleteDecision } from '@/lib/decisions';
import { Trash2, CheckCircle, XCircle, MinusCircle } from 'lucide-react';

interface HistoryListProps {
  decisions: Decision[];
  onRefresh: () => void;
}

const HistoryList = ({ decisions, onRefresh }: HistoryListProps) => {
  const iconMap = {
    pro: <CheckCircle className="h-4 w-4 text-pro shrink-0" />,
    contra: <XCircle className="h-4 w-4 text-contra shrink-0" />,
    neutral: <MinusCircle className="h-4 w-4 text-neutral shrink-0" />,
  };

  if (decisions.length === 0) {
    return <p className="text-center text-sm text-muted-foreground py-8">Noch keine Entscheidungen gespeichert.</p>;
  }

  return (
    <div className="space-y-2">
      {decisions.map((d) => (
        <div key={d.id} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          {iconMap[d.result]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{d.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(d.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
              {' · '}<span className="text-pro">{d.proScore}</span>{' vs '}<span className="text-contra">{d.contraScore}</span>
            </p>
          </div>
          <button onClick={() => { deleteDecision(d.id); onRefresh(); }} className="text-muted-foreground hover:text-contra transition-colors shrink-0">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
