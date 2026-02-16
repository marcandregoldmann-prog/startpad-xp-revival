import { useState } from 'react';
import { Plus, Star, ExternalLink, Trash2, Edit3, X, Check } from 'lucide-react';
import {
  WissenEntry,
  WissenCategory,
  WissenStatus,
  WissenDifficulty,
  loadWissen,
  saveWissenEntry,
  deleteWissenEntry,
  createWissenEntry,
  updateWissenEntry,
  wissenTypes,
} from '@/lib/wissen';

const statusColors: Record<WissenStatus, string> = {
  Geplant: 'bg-secondary text-secondary-foreground',
  Laufend: 'bg-xp-muted text-xp',
  Beendet: 'bg-pro-muted text-pro',
  Abgebrochen: 'bg-contra-muted text-contra',
};

const categoryColors: Record<WissenCategory, string> = {
  Medien: 'bg-wissen-muted text-wissen',
  Projekt: 'bg-accent text-accent-foreground',
};

interface WissenCardProps {
  entry: WissenEntry;
  onUpdate: () => void;
}

const WissenCard = ({ entry, onUpdate }: WissenCardProps) => {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<WissenStatus>(entry.status);
  const [category, setCategory] = useState<WissenCategory>(entry.category);
  const [difficulty, setDifficulty] = useState<WissenDifficulty | undefined>(entry.difficulty);

  const handleSave = () => {
    updateWissenEntry(entry.id, { status, category, difficulty });
    setEditing(false);
    onUpdate();
  };

  const handleDelete = () => {
    deleteWissenEntry(entry.id);
    onUpdate();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-foreground truncate">{entry.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{entry.type}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setEditing(!editing)} className="text-muted-foreground hover:text-foreground transition-colors">
            {editing ? <X className="h-3.5 w-3.5" /> : <Edit3 className="h-3.5 w-3.5" />}
          </button>
          <button onClick={handleDelete} className="text-muted-foreground hover:text-contra transition-colors">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${categoryColors[entry.category]}`}>
          {entry.category}
        </span>
        <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded ${statusColors[entry.status]}`}>
          {entry.status}
        </span>
        {entry.difficulty && (
          <span className="text-[10px] font-mono text-muted-foreground">{entry.difficulty}</span>
        )}
        {entry.xpAwarded && (
          <span className="text-[10px] font-mono text-xp">✓ XP</span>
        )}
      </div>

      {entry.rating > 0 && (
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < entry.rating ? 'text-streak fill-streak' : 'text-muted-foreground'}`} />
          ))}
        </div>
      )}

      {entry.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {entry.tags.map(tag => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground">#{tag}</span>
          ))}
        </div>
      )}

      {entry.url && (
        <a href={entry.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-xp hover:underline">
          <ExternalLink className="h-3 w-3" /> Link
        </a>
      )}

      {editing && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex gap-2 flex-wrap">
            <select value={category} onChange={(e) => setCategory(e.target.value as WissenCategory)}
              className="rounded border border-border bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="Medien">Medien</option>
              <option value="Projekt">Projekt</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as WissenStatus)}
              className="rounded border border-border bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
              <option value="Geplant">Geplant</option>
              <option value="Laufend">Laufend</option>
              <option value="Beendet">Beendet</option>
              <option value="Abgebrochen">Abgebrochen</option>
            </select>
            {category === 'Projekt' && (
              <select value={difficulty || ''} onChange={(e) => setDifficulty(e.target.value as WissenDifficulty)}
                className="rounded border border-border bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
                <option value="Klein">Klein</option>
                <option value="Mittel">Mittel</option>
                <option value="Anspruchsvoll">Anspruchsvoll</option>
              </select>
            )}
          </div>
          <button onClick={handleSave}
            className="flex items-center gap-1 rounded bg-foreground px-3 py-1 text-xs font-medium text-background">
            <Check className="h-3 w-3" /> Speichern
          </button>
        </div>
      )}
    </div>
  );
};

interface WissenCreatorProps {
  onCreated: () => void;
}

export const WissenCreator = ({ onCreated }: WissenCreatorProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Buch');
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState('');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<WissenCategory>('Medien');
  const [status, setStatus] = useState<WissenStatus>('Geplant');
  const [difficulty, setDifficulty] = useState<WissenDifficulty>('Mittel');

  const handleSubmit = () => {
    if (!title.trim()) return;
    const entry = createWissenEntry(
      title.trim(), type, rating,
      tags.split(',').map(t => t.trim()).filter(Boolean),
      url.trim(), notes.trim(), category, status,
      category === 'Projekt' ? difficulty : undefined,
    );
    saveWissenEntry(entry);
    setTitle(''); setRating(0); setTags(''); setUrl(''); setNotes('');
    setCategory('Medien'); setStatus('Geplant');
    setOpen(false);
    onCreated();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" /> Neuer Eintrag
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel..."
        autoFocus className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      <div className="flex gap-2 flex-wrap">
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          {wissenTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value as WissenCategory)}
          className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="Medien">Medien</option>
          <option value="Projekt">Projekt</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value as WissenStatus)}
          className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
          <option value="Geplant">Geplant</option>
          <option value="Laufend">Laufend</option>
          <option value="Beendet">Beendet</option>
          <option value="Abgebrochen">Abgebrochen</option>
        </select>
        {category === 'Projekt' && (
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as WissenDifficulty)}
            className="rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring">
            <option value="Klein">Klein</option>
            <option value="Mittel">Mittel</option>
            <option value="Anspruchsvoll">Anspruchsvoll</option>
          </select>
        )}
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs text-muted-foreground mr-1">Bewertung:</span>
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} onClick={() => setRating(i + 1)} className="p-0.5">
            <Star className={`h-4 w-4 ${i < rating ? 'text-streak fill-streak' : 'text-muted-foreground'}`} />
          </button>
        ))}
      </div>
      <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (kommagetrennt)"
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL (optional)"
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notizen..." rows={2}
        className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!title.trim()}
          className="flex-1 rounded-lg bg-foreground py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-30">Erstellen</button>
        <button onClick={() => setOpen(false)}
          className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Abbrechen</button>
      </div>
    </div>
  );
};

export default WissenCard;
