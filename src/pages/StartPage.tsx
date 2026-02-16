import { useState, useEffect } from 'react';
import { Flame, Zap, Calendar, Clock, Pencil, ChevronRight, BookOpen, Moon } from 'lucide-react';
import { loadStats, loadTasks, loadCompletions, getTodaysTasks, isTaskCompletedToday, checkStreakReset, getTodaysXP } from '@/lib/tasks';
import { loadWissen, getRunningMedia, type WissenEntry } from '@/lib/wissen';
import { loadWochenfokus, saveWochenfokus, getKontextHinweise, hasTagesabschlussToday, saveTagesabschluss } from '@/lib/focus';
import LinksWidget from '@/components/LinksWidget';
import FocusWidget from '@/components/FocusWidget';
import { useNavigate } from 'react-router-dom';

const StartPage = () => {
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());
  const [editLinks, setEditLinks] = useState(false);
  const [wochenfokus, setWochenfokus] = useState(loadWochenfokus);
  const [editingFokus, setEditingFokus] = useState(false);
  const [fokusText, setFokusText] = useState(wochenfokus);
  const [showAbschluss, setShowAbschluss] = useState(false);
  const [mood, setMood] = useState(3);
  const [abschlussNote, setAbschlussNote] = useState('');

  const stats = checkStreakReset();
  const tasks = loadTasks();
  const completions = loadCompletions();
  const todaysTasks = getTodaysTasks(tasks);
  const completedCount = todaysTasks.filter(t => isTaskCompletedToday(t.id, completions)).length;
  const todaysXP = getTodaysXP(completions, tasks);
  const wissenEntries = loadWissen();
  const runningMedia = getRunningMedia(wissenEntries);
  const hints = getKontextHinweise();
  const doneToday = hasTagesabschlussToday();

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const handleSaveFokus = () => {
    saveWochenfokus(fokusText);
    setWochenfokus(fokusText);
    setEditingFokus(false);
  };

  const handleAbschluss = () => {
    saveTagesabschluss({ date: new Date().toISOString().split('T')[0], mood, note: abschlussNote });
    setShowAbschluss(false);
    setAbschlussNote('');
  };

  return (
    <div className="space-y-5">
      {/* Tageskompass */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-lg font-mono font-bold text-foreground">{timeStr}</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <div className="text-level font-mono text-sm font-semibold">LVL {stats.level}</div>
            <div className="flex items-center gap-1 justify-end">
              <Flame className="h-3 w-3 text-streak" />
              <span className="text-xs font-mono text-streak">{stats.currentStreak}d</span>
            </div>
            <div className="flex items-center gap-1 justify-end">
              <Zap className="h-3 w-3 text-xp" />
              <span className="text-xs font-mono text-xp">+{todaysXP} XP heute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Links</h2>
          <button onClick={() => setEditLinks(!editLinks)}
            className={`rounded px-2 py-1 text-[10px] font-medium transition-colors ${editLinks ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <Pencil className="h-3 w-3 inline mr-1" />{editLinks ? 'Fertig' : 'Bearbeiten'}
          </button>
        </div>
        <LinksWidget editMode={editLinks} />
      </div>

      {/* Aktuell laufend */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Aktuell laufend</h2>
        {runningMedia.length === 0 ? (
          <p className="text-xs text-muted-foreground py-3 text-center">Keine laufenden Inhalte.</p>
        ) : (
          <div className="space-y-1.5">
            {runningMedia.map(entry => (
              <button key={entry.id} onClick={() => navigate('/wissen')}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-accent/30 transition-colors text-left">
                <BookOpen className="h-4 w-4 text-wissen shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{entry.title}</p>
                  <p className="text-[10px] text-muted-foreground">{entry.type}</p>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-xp-muted text-xp">Laufend</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Heute */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Heute</h2>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                {completedCount} / {todaysTasks.length} Aufgaben erledigt
              </p>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden mt-2 w-32">
                <div className="h-full rounded-full bg-pro transition-all duration-500"
                  style={{ width: `${todaysTasks.length > 0 ? (completedCount / todaysTasks.length) * 100 : 0}%` }} />
              </div>
            </div>
            <button onClick={() => navigate('/tasks')}
              className="rounded-lg bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity">
              Aufgaben öffnen
            </button>
          </div>
        </div>
      </div>

      {/* Wochenfokus */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Wochenfokus</h2>
          {!editingFokus && (
            <button onClick={() => { setFokusText(wochenfokus); setEditingFokus(true); }}
              className="text-muted-foreground hover:text-foreground transition-colors">
              <Pencil className="h-3 w-3" />
            </button>
          )}
        </div>
        {editingFokus ? (
          <div className="rounded-xl border border-border bg-card p-3 space-y-2">
            <textarea value={fokusText} onChange={(e) => setFokusText(e.target.value)} placeholder="Was ist dein Fokus diese Woche?" rows={2}
              className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            <div className="flex gap-2">
              <button onClick={handleSaveFokus} className="rounded bg-foreground px-3 py-1 text-xs font-medium text-background">Speichern</button>
              <button onClick={() => setEditingFokus(false)} className="text-xs text-muted-foreground hover:text-foreground">Abbrechen</button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-foreground">{wochenfokus || <span className="text-muted-foreground italic">Kein Fokus gesetzt</span>}</p>
          </div>
        )}
      </div>

      {/* Kontext-Hinweise */}
      {hints.length > 0 && (
        <div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Kontext-Hinweise</h2>
          <div className="space-y-1.5">
            {hints.map((hint, i) => (
              <div key={i} className="rounded-lg border border-border bg-card/50 px-4 py-2.5">
                <p className="text-xs text-foreground">{hint}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fokus-Modus */}
      <FocusWidget />

      {/* Tagesabschluss */}
      <div>
        <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Tagesabschluss</h2>
        {doneToday ? (
          <div className="rounded-xl border border-pro bg-pro-muted p-4 text-center">
            <p className="text-sm text-pro font-medium">✓ Tagesabschluss erledigt</p>
          </div>
        ) : showAbschluss ? (
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Stimmung</p>
              <div className="flex gap-2">
                {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
                  <button key={i} onClick={() => setMood(i + 1)}
                    className={`text-xl p-1 rounded transition-all ${mood === i + 1 ? 'bg-accent scale-110' : 'opacity-50 hover:opacity-100'}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={abschlussNote} onChange={(e) => setAbschlussNote(e.target.value)} placeholder="Kurze Reflexion..." rows={2}
              className="w-full rounded-lg border border-border bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
            <div className="flex gap-2">
              <button onClick={handleAbschluss}
                className="flex-1 rounded-lg bg-foreground py-2 text-sm font-semibold text-background hover:opacity-90 transition-opacity">Abschließen</button>
              <button onClick={() => setShowAbschluss(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Abbrechen</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAbschluss(true)}
            className="w-full rounded-xl border border-dashed border-border py-3 text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors flex items-center justify-center gap-2">
            <Moon className="h-4 w-4" /> Tag abschließen
          </button>
        )}
      </div>
    </div>
  );
};

export default StartPage;
