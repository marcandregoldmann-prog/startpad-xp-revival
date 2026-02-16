import { useState, useEffect, useCallback } from 'react';
import { History, RotateCcw } from 'lucide-react';
import ArgumentList from '@/components/ArgumentList';
import ResultCard from '@/components/ResultCard';
import HistoryList from '@/components/HistoryList';
import { Argument, Decision, generateId, calculateResult, loadDecisions, saveDecision } from '@/lib/decisions';

type View = 'decide' | 'history';

const Decisions = () => {
  const [view, setView] = useState<View>('decide');
  const [title, setTitle] = useState('');
  const [pros, setPros] = useState<Argument[]>([]);
  const [contras, setContras] = useState<Argument[]>([]);
  const [result, setResult] = useState<Pick<Decision, 'proScore' | 'contraScore' | 'result' | 'resultText'> | null>(null);
  const [history, setHistory] = useState<Decision[]>([]);

  const refreshHistory = useCallback(() => { setHistory(loadDecisions()); }, []);
  useEffect(() => { refreshHistory(); }, [refreshHistory]);

  const handleCalculate = () => {
    if (!title.trim()) return;
    const res = calculateResult(pros, contras);
    setResult(res);
    const decision: Decision = { id: generateId(), title: title.trim(), pros, contras, ...res, createdAt: new Date().toISOString() };
    saveDecision(decision);
    refreshHistory();
  };

  const handleReset = () => { setTitle(''); setPros([]); setContras([]); setResult(null); };
  const canCalculate = title.trim() && (pros.length > 0 || contras.length > 0);

  return (
    <div className="space-y-5">
      <div className="flex gap-1">
        <button onClick={() => setView('decide')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${view === 'decide' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          Entscheiden
        </button>
        <button onClick={() => { setView('history'); refreshHistory(); }}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${view === 'history' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          <History className="h-3.5 w-3.5" /> Historie
        </button>
      </div>

      {view === 'decide' ? (
        <>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Entscheidung</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Was möchtest du entscheiden?"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring text-base" />
          </div>
          <ArgumentList type="pro" arguments={pros} onChange={setPros} />
          <ArgumentList type="contra" arguments={contras} onChange={setContras} />
          <div className="flex gap-3">
            <button onClick={handleCalculate} disabled={!canCalculate}
              className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-30">
              Berechnen
            </button>
            <button onClick={handleReset}
              className="rounded-xl border border-border px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          {result && <ResultCard decision={result} />}
        </>
      ) : (
        <>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Entscheidungs-Historie</h2>
          <HistoryList decisions={history} onRefresh={refreshHistory} />
        </>
      )}
    </div>
  );
};

export default Decisions;
