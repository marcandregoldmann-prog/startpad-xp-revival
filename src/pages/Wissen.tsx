import { useState, useCallback } from 'react';
import WissenCard, { WissenCreator } from '@/components/WissenCard';
import { loadWissen, type WissenEntry, type WissenCategory, type WissenStatus, saveWissenEntry, deleteWissenEntry, updateWissenEntry } from '@/lib/wissen';
import { Filter } from 'lucide-react';

const Wissen = () => {
  const [entries, setEntries] = useState<WissenEntry[]>(loadWissen);
  const [filterCategory, setFilterCategory] = useState<WissenCategory | 'Alle'>('Alle');
  const [filterStatus, setFilterStatus] = useState<WissenStatus | 'Alle'>('Alle');

  const refresh = useCallback(() => { setEntries(loadWissen()); }, []);

  const filtered = entries.filter(e => {
    if (filterCategory !== 'Alle' && e.category !== filterCategory) return false;
    if (filterStatus !== 'Alle' && e.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col gap-3 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Filter className="h-3.5 w-3.5" /> Filter
        </h2>
        <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as WissenCategory | 'Alle')}
            className="rounded-xl border border-white/10 bg-card/50 px-4 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent hover:bg-white/5 transition-colors appearance-none cursor-pointer min-w-[120px]">
            <option value="Alle">Alle Kategorien</option>
            <option value="Medien">Medien</option>
            <option value="Projekt">Projekt</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as WissenStatus | 'Alle')}
            className="rounded-xl border border-white/10 bg-card/50 px-4 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent hover:bg-white/5 transition-colors appearance-none cursor-pointer min-w-[100px]">
            <option value="Alle">Alle Status</option>
            <option value="Geplant">Geplant</option>
            <option value="Laufend">Laufend</option>
            <option value="Beendet">Beendet</option>
            <option value="Abgebrochen">Abgebrochen</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-8 text-center animate-in zoom-in-95">
            <p className="text-sm text-muted-foreground">Keine Einträge gefunden.</p>
          </div>
        ) : (
          filtered.map(entry => (
            <WissenCard key={entry.id} entry={entry} onUpdate={refresh} />
          ))
        )}
      </div>

      <div className="pt-2">
        <WissenCreator onCreated={refresh} />
      </div>
    </div>
  );
};

export default Wissen;
