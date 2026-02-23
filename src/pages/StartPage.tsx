import { useState, useEffect } from 'react';
import { Flame, Zap, Calendar, Clock, Pencil, ChevronRight, BookOpen, Moon, Award, Play } from 'lucide-react';
import { loadTasks, loadCompletions, getTodaysTasks, isTaskCompletedToday, checkStreakReset, getTodaysXP } from '@/lib/tasks';
import { loadWissen, getRunningMedia } from '@/lib/wissen';
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Tageskompass - Gradient Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-tageskompass p-6 shadow-xl shadow-purple-500/10">
        <div className="relative z-10 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-800/80">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium uppercase tracking-wide">{dateStr}</span>
            </div>
            <div className="font-mono text-4xl font-bold tracking-tight text-zinc-900 drop-shadow-sm">
              {timeStr}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-md px-3 py-1.5 shadow-sm border border-white/20">
              <Award className="h-4 w-4 text-purple-700" />
              <span className="text-xs font-bold text-zinc-900">LVL {stats.level}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-md px-3 py-1.5 shadow-sm border border-white/20">
              <Flame className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-bold text-zinc-900">{stats.currentStreak}d</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-md px-3 py-1.5 shadow-sm border border-white/20">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-zinc-900">+{todaysXP} XP</span>
            </div>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>
      </div>

      {/* Links Section */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Links</h2>
          <button onClick={() => setEditLinks(!editLinks)}
            className={`rounded-full px-3 py-1 text-[10px] font-medium transition-all ${editLinks ? 'bg-accent text-white shadow-lg shadow-accent/25' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'}`}>
            <Pencil className="h-3 w-3 inline mr-1.5" />{editLinks ? 'Fertig' : 'Bearbeiten'}
          </button>
        </div>
        <LinksWidget editMode={editLinks} />
      </section>

      {/* Aktuell laufend */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Aktuell laufend</h2>
        {runningMedia.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-card/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">Keine laufenden Inhalte.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {runningMedia.map(entry => (
              <button key={entry.id} onClick={() => navigate('/wissen')}
                className="group w-full flex items-center gap-4 rounded-2xl bg-card p-4 hover:bg-card/80 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/5 shadow-sm hover:shadow-md hover:shadow-black/20">
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

      {/* Heute (Daily Progress) */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Tagesfortschritt</h2>
        <div className="rounded-2xl bg-card p-5 border border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight">{Math.round((completedCount / (todaysTasks.length || 1)) * 100)}%</p>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Erledigt</p>
            </div>
            <button onClick={() => navigate('/tasks')}
              className="rounded-full bg-white/5 px-4 py-2 text-xs font-medium text-foreground hover:bg-white/10 transition-colors border border-white/5">
              Aufgaben öffnen
            </button>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-purple-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${todaysTasks.length > 0 ? (completedCount / todaysTasks.length) * 100 : 0}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-right">{completedCount} / {todaysTasks.length} Aufgaben</p>
        </div>
      </section>

      {/* Wochenfokus */}
      <section>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Wochenfokus</h2>
          {!editingFokus && (
            <button onClick={() => { setFokusText(wochenfokus); setEditingFokus(true); }}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-white/5">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {editingFokus ? (
          <div className="rounded-2xl bg-card p-4 space-y-3 border border-white/5 animate-in zoom-in-95 duration-200">
            <textarea value={fokusText} onChange={(e) => setFokusText(e.target.value)} placeholder="Was ist dein Fokus diese Woche?" rows={2}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditingFokus(false)} className="px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">Abbrechen</button>
              <button onClick={handleSaveFokus} className="rounded-lg bg-accent px-4 py-1.5 text-xs font-medium text-white shadow-lg shadow-accent/20 hover:bg-accent/90 transition-all">Speichern</button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-card p-5 border border-white/5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <Award className="h-12 w-12 rotate-12" />
            </div>
            <p className="text-base font-medium text-foreground relative z-10 leading-relaxed">
              {wochenfokus || <span className="text-muted-foreground italic">Kein Fokus gesetzt</span>}
            </p>
          </div>
        )}
      </section>

      {/* Kontext-Hinweise */}
      {hints.length > 0 && (
        <section className="space-y-2">
          {hints.map((hint, i) => (
            <div key={i} className="flex gap-3 rounded-xl bg-accent/10 border border-accent/20 px-4 py-3 items-start">
              <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
              <p className="text-xs text-foreground/90 leading-relaxed">{hint}</p>
            </div>
          ))}
        </section>
      )}

      {/* Fokus-Modus */}
      <FocusWidget />

      {/* Tagesabschluss */}
      <section className="pb-8">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Reflexion</h2>
        {doneToday ? (
          <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center flex flex-col items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
              <Award className="h-4 w-4" />
            </div>
            <p className="text-sm text-emerald-500 font-medium">Tagesabschluss erledigt</p>
          </div>
        ) : showAbschluss ? (
          <div className="rounded-2xl bg-card p-5 space-y-4 border border-white/5 animate-in slide-in-from-bottom-2">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Wie war dein Tag?</p>
              <div className="flex justify-between gap-1">
                {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
                  <button key={i} onClick={() => setMood(i + 1)}
                    className={`text-2xl p-2 rounded-xl transition-all ${mood === i + 1 ? 'bg-accent/20 scale-110 ring-1 ring-accent' : 'opacity-40 hover:opacity-100 hover:bg-white/5'}`}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <textarea value={abschlussNote} onChange={(e) => setAbschlussNote(e.target.value)} placeholder="Gedanken zum Tag..." rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent resize-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowAbschluss(false)}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors flex-1">Abbrechen</button>
              <button onClick={handleAbschluss}
                className="flex-1 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background hover:bg-foreground/90 transition-opacity shadow-lg shadow-white/5">Abschließen</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAbschluss(true)}
            className="group w-full rounded-2xl border border-dashed border-white/10 py-4 text-sm text-muted-foreground hover:text-accent hover:border-accent/50 hover:bg-accent/5 transition-all flex items-center justify-center gap-2">
            <Moon className="h-4 w-4 group-hover:-rotate-12 transition-transform" />
            <span className="font-medium">Tag abschließen</span>
          </button>
        )}
      </section>
    </div>
  );
};

export default StartPage;
