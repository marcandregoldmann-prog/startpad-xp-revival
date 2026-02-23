import { useState } from 'react';
import { type WissenEntry, type WissenCategory, type WissenStatus, saveWissenEntry, deleteWissenEntry, updateWissenEntry, createWissenEntry } from '@/lib/wissen';
import { Folder, Calendar, CheckCircle2, MoreHorizontal, Plus, Trash2, X } from 'lucide-react';

interface WissenCardProps {
  entry: WissenEntry;
  onUpdate: () => void;
}

const WissenCard = ({ entry, onUpdate }: WissenCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  // Status Colors
  const statusColors = {
    'Geplant': 'text-muted-foreground bg-muted/20 border-white/5',
    'Laufend': 'text-sky-400 bg-sky-400/10 border-sky-400/20',
    'Beendet': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'Abgebrochen': 'text-rose-400 bg-rose-400/10 border-rose-400/20'
  };

  const statusColorClass = statusColors[entry.status] || statusColors['Geplant'];
  const statusBorderClass = statusColorClass.split(' ').pop() || 'border-white/5';
  const statusBadgeClass = statusColorClass.split(' border')[0];

  const handleStatusChange = (newStatus: WissenStatus) => {
    updateWissenEntry(entry.id, { status: newStatus });
    onUpdate();
  };

  return (
    <div className={`group relative rounded-2xl border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 ${statusBorderClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusBadgeClass}`}>
              {entry.status}
            </span>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
              <Folder className="h-3 w-3" /> {entry.category}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground truncate pr-2 group-hover:text-accent transition-colors">{entry.title}</h3>

          {showDetails && (
            <div className="mt-3 text-sm text-muted-foreground space-y-2 animate-in slide-in-from-top-2 duration-200">
              <p className="leading-relaxed bg-black/20 p-3 rounded-xl border border-white/5 text-xs">{entry.notes || <span className="italic opacity-50">Keine Notizen</span>}</p>
              <div className="flex items-center gap-2 text-[10px] opacity-60 pt-1">
                <Calendar className="h-3 w-3" />
                <span>Erstellt: {new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          {entry.status !== 'Beendet' && (
            <button onClick={() => handleStatusChange('Beendet')} className="p-2 rounded-xl hover:bg-emerald-400/10 text-muted-foreground hover:text-emerald-400 transition-colors" title="Abschließen">
              <CheckCircle2 className="h-5 w-5" />
            </button>
          )}
          <button onClick={() => deleteWissenEntry(entry.id) && onUpdate()} className="p-2 rounded-xl hover:bg-rose-400/10 text-muted-foreground hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100" title="Löschen">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar for 'Laufend' */}
      {entry.status === 'Laufend' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-sky-400/20 overflow-hidden rounded-b-2xl">
          <div className="h-full w-1/3 bg-sky-400 animate-pulse-glow"></div>
        </div>
      )}
    </div>
  );
};

export const WissenCreator = ({ onCreated }: { onCreated: () => void }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WissenCategory>('Medien');
  const [status, setStatus] = useState<WissenStatus>('Geplant');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Correctly match the signature:
    // createWissenEntry(title, type, rating, tags, url, notes, category, status, difficulty)
    // We pass defaults for the missing UI fields to prevent breaking the function call.
    const newEntry = createWissenEntry(
      title.trim(),
      'Sonstiges', // Default Type
      0,           // Default Rating
      [],          // Default Tags
      '',          // Default URL
      notes.trim(),
      category,
      status
      // difficulty is optional
    );
    saveWissenEntry(newEntry);

    setTitle(''); setNotes(''); setIsAdding(false);
    onCreated();
  };

  if (!isAdding) {
    return (
      <button onClick={() => setIsAdding(true)}
        className="group w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-card/20 py-4 text-sm font-medium text-muted-foreground hover:bg-accent/5 hover:text-accent hover:border-accent/30 transition-all duration-300">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5 group-hover:bg-accent/20 transition-colors">
          <Plus className="h-3.5 w-3.5" />
        </div>
        Neuen Eintrag erstellen
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl border border-white/10 bg-card p-6 space-y-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground tracking-tight">Neues Wissen</h3>
          <button type="button" onClick={() => setIsAdding(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Titel</label>
            <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Buch, Kurs, Projekt..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Kategorie</label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value as WissenCategory)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent appearance-none">
                  <option value="Medien">Medien</option>
                  <option value="Projekt">Projekt</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Status</label>
              <div className="relative">
                <select value={status} onChange={(e) => setStatus(e.target.value as WissenStatus)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-accent appearance-none">
                  <option value="Geplant">Geplant</option>
                  <option value="Laufend">Laufend</option>
                  <option value="Beendet">Beendet</option>
                  <option value="Abgebrochen">Abgebrochen</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                  <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Notizen</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optionale Details..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent resize-none transition-all" />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={!title.trim()}
              className="w-full rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 disabled:shadow-none transition-all">
              Eintrag speichern
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WissenCard;
