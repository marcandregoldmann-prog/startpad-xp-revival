import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Home, ListChecks, Scale, BookOpen, Repeat } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { loadTasks } from '@/lib/tasks';
import { loadDecisions } from '@/lib/decisions';
import { loadWissen } from '@/lib/wissen';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const run = (command: () => void) => {
    setOpen(false);
    command();
  };

  const tasks = loadTasks();
  const decisions = loadDecisions();
  const wissen = loadWissen();

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Suche nach Aufgaben, Wissen, etc..." />
      <CommandList>
        <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => run(() => navigate('/'))}>
            <Home className="mr-2 h-4 w-4" /> Start
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/tasks'))}>
            <ListChecks className="mr-2 h-4 w-4" /> Aufgaben
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/habits'))}>
             <Repeat className="mr-2 h-4 w-4" /> Gewohnheiten
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/decisions'))}>
            <Scale className="mr-2 h-4 w-4" /> Entscheidungen
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/wissen'))}>
            <BookOpen className="mr-2 h-4 w-4" /> Wissen
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate('/settings'))}>
            <Settings className="mr-2 h-4 w-4" /> Einstellungen
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {tasks.length > 0 && (
          <CommandGroup heading="Aufgaben">
            {tasks.slice(0, 5).map(task => (
               <CommandItem key={task.id} onSelect={() => run(() => navigate('/tasks'))}>
                 <ListChecks className="mr-2 h-4 w-4 opacity-70" /> {task.title}
               </CommandItem>
            ))}
          </CommandGroup>
        )}

        {wissen.length > 0 && (
          <CommandGroup heading="Wissen">
            {wissen.slice(0, 5).map(entry => (
               <CommandItem key={entry.id} onSelect={() => run(() => navigate('/wissen'))}>
                 <BookOpen className="mr-2 h-4 w-4 opacity-70" /> {entry.title}
               </CommandItem>
            ))}
          </CommandGroup>
        )}

        {decisions.length > 0 && (
          <CommandGroup heading="Entscheidungen">
            {decisions.slice(0, 5).map(d => (
               <CommandItem key={d.id} onSelect={() => run(() => navigate('/decisions'))}>
                 <Scale className="mr-2 h-4 w-4 opacity-70" /> {d.title}
               </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
