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
       <h1 className="text-2xl font-bold tracking-tight px-1">Gewohnheiten</h1>

       <div className="space-y-3">
         {habits.length === 0 && (
           <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl">
             <p>Noch keine Gewohnheiten.</p>
             <p className="text-xs mt-1">Starte klein, bleib dran!</p>
           </div>
         )}
         {habits.map(habit => {
           const done = isHabitDoneToday(habit);
           return (
             <div key={habit.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-card border-border'}`}>
               <div className="flex items-center gap-4">
                 <button onClick={() => handleToggle(habit.id)}
                   className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'border-2 border-muted-foreground/30 hover:border-accent hover:bg-accent/10'}`}>
                   {done && <Check className="h-4 w-4 font-bold" />}
                 </button>
                 <div>
                   <p className={`font-medium ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{habit.title}</p>
                   <div className="flex items-center gap-1 text-xs text-muted-foreground">
                     <Flame className={`h-3 w-3 ${habit.streak > 0 ? 'text-orange-500 fill-orange-500' : ''}`} />
                     <span className={habit.streak > 0 ? 'text-orange-500 font-bold' : ''}>{habit.streak} Tage Streak</span>
                   </div>
                 </div>
               </div>
               <button onClick={() => handleDelete(habit.id)} className="text-muted-foreground/30 hover:text-red-400 p-2 transition-colors">
                 <Trash2 className="h-4 w-4" />
               </button>
             </div>
           );
         })}
       </div>

       <form onSubmit={handleAdd} className="flex gap-2">
         <input
           value={newHabit}
           onChange={e => setNewHabit(e.target.value)}
           placeholder="Neue Gewohnheit..."
           className="flex-1 rounded-xl border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent transition-all"
         />
         <button type="submit" disabled={!newHabit.trim()} className="rounded-xl bg-accent px-4 text-accent-foreground shadow-lg shadow-accent/20 hover:bg-accent/90 disabled:opacity-50 disabled:shadow-none transition-all">
           <Plus className="h-5 w-5" />
         </button>
       </form>
    </div>
  );
};

export default Habits;
