import { useState, useCallback } from 'react';
import WissenCard, { WissenCreator } from '@/components/WissenCard';
import { loadWissen, type WissenEntry, type WissenCategory, type WissenStatus } from '@/lib/wissen';

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
    <div className="space-y-5">
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Wissen</h2>
        <div className="flex gap-2 flex-wrap">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as WissenCategory | 'Alle')}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="Alle">Alle Kategorien</option>
            <option value="Medien">Medien</option>
            <option value="Projekt">Projekt</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as WissenStatus | 'Alle')}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="Alle">Alle Status</option>
            <option value="Geplant">Geplant</option>
            <option value="Laufend">Laufend</option>
            <option value="Beendet">Beendet</option>
            <option value="Abgebrochen">Abgebrochen</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">Keine Einträge gefunden.</p>
        ) : (
          filtered.map(entry => (
            <WissenCard key={entry.id} entry={entry} onUpdate={refresh} />
          ))
        )}
      </div>

      <WissenCreator onCreated={refresh} />
    </div>
  );
};

export default Wissen;
