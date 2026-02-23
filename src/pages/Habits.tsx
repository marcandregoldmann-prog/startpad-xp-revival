import { useState, useEffect } from 'react';
import { loadHabits, toggleHabit, addHabit, deleteHabit, isHabitDoneToday, type Habit } from '@/lib/habits';
import { Check, Plus, Trash2, Flame } from 'lucide-react';
import { toast } from 'sonner';

const Habits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState('');

  const refresh = () => setHabits(loadHabits());
  useEffect(refresh, []);

  const handleToggle = (id: string) => {
    toggleHabit(id);
    refresh();
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    addHabit(newHabit.trim());
    setNewHabit('');
    refresh();
    toast.success('Gewohnheit erstellt');
  };

  const handleDelete = (id: string) => {
    if (confirm('Gewohnheit löschen?')) {
      deleteHabit(id);
      refresh();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-24">
       <div className="flex items-center justify-between px-1">
         <h1 className="text-2xl font-bold tracking-tight">Gewohnheiten</h1>
         <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
           <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
           <span>Streak aufbauen!</span>
         </div>
       </div>

       <div className="space-y-3">
         {habits.length === 0 ? (
           <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl bg-card/50">
             <p className="font-medium">Noch keine Gewohnheiten.</p>
             <p className="text-xs mt-1 text-muted-foreground/70">Starte klein, bleib dran!</p>
           </div>
         ) : (
           habits.map(habit => {
             const done = isHabitDoneToday(habit);
             return (
               <div key={habit.id}
                 className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${done ? 'bg-emerald-500/10 border-emerald-500/20 shadow-none' : 'bg-card border-border shadow-sm hover:shadow-md'}`}>
                 <div className="flex items-center gap-4 flex-1">
                   <button onClick={() => handleToggle(habit.id)}
                     className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300 ${done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' : 'border-2 border-muted-foreground/30 hover:border-accent hover:bg-accent/10'}`}>
                     {done && <Check className="h-5 w-5 font-bold animate-in zoom-in" />}
                   </button>
                   <div className="min-w-0 flex-1">
                     <p className={`font-medium truncate transition-colors ${done ? 'text-muted-foreground line-through decoration-emerald-500/30' : 'text-foreground'}`}>{habit.title}</p>
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                       <span className={`flex items-center gap-1 ${habit.streak > 0 ? 'text-orange-500 font-bold' : ''}`}>
                         <Flame className={`h-3 w-3 ${habit.streak > 0 ? 'fill-orange-500' : ''}`} />
                         {habit.streak} Tage Streak
                       </span>
                       <span className="text-muted-foreground/30">•</span>
                       <span className="text-accent font-medium">+{habit.xp} XP</span>
                     </div>
                   </div>
                 </div>
                 <button onClick={() => handleDelete(habit.id)} className="text-muted-foreground/30 hover:text-red-400 p-2 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                   <Trash2 className="h-4 w-4" />
                 </button>
               </div>
             );
           })
         )}
       </div>

       <form onSubmit={handleAdd} className="flex gap-2 sticky bottom-24 bg-background/80 backdrop-blur-md p-2 -mx-2 rounded-2xl border border-white/10 shadow-lg shadow-black/5">
         <input
           value={newHabit}
           onChange={e => setNewHabit(e.target.value)}
           placeholder="Neue Gewohnheit..."
           className="flex-1 rounded-xl border border-input bg-card/80 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
         />
         <button type="submit" disabled={!newHabit.trim()} className="rounded-xl bg-accent px-4 text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center min-w-[50px]">
           <Plus className="h-6 w-6" />
         </button>
       </form>
    </div>
  );
};

export default Habits;
