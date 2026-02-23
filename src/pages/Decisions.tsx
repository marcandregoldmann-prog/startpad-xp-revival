import { useState, useEffect, useCallback } from 'react';
import { History, RotateCcw, Check, Scale } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex p-1 bg-white/5 rounded-2xl">
        <button onClick={() => setView('decide')}
          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-300 ${view === 'decide' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-muted-foreground hover:text-foreground'}`}>
          <Scale className="h-3.5 w-3.5 inline mr-2 -mt-0.5" />
          Entscheiden
        </button>
        <button onClick={() => { setView('history'); refreshHistory(); }}
          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-300 ${view === 'history' ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-muted-foreground hover:text-foreground'}`}>
          <History className="h-3.5 w-3.5 inline mr-2 -mt-0.5" />
          Historie
        </button>
      </div>

      {view === 'decide' ? (
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Frage / Thema</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Was möchtest du entscheiden?"
              className="w-full rounded-2xl border border-white/10 bg-card/50 px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all shadow-sm" />
          </div>

          <div className="space-y-4">
            <ArgumentList type="pro" arguments={pros} onChange={setPros} />
            <ArgumentList type="contra" arguments={contras} onChange={setContras} />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleReset}
              className="rounded-2xl border border-white/10 px-5 py-3.5 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <RotateCcw className="h-5 w-5" />
            </button>
            <button onClick={handleCalculate} disabled={!canCalculate}
              className="flex-1 rounded-2xl bg-foreground py-3.5 text-sm font-bold text-background shadow-lg shadow-white/5 hover:bg-foreground/90 disabled:opacity-30 disabled:shadow-none transition-all flex items-center justify-center gap-2">
              <Check className="h-4 w-4" /> Ergebnis berechnen
            </button>
          </div>

          {result && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <ResultCard decision={result} />
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Vergangene Entscheidungen</h2>
          <HistoryList decisions={history} onRefresh={refreshHistory} />
        </div>
      )}
    </div>
  );
};

export default Decisions;
