import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTask, saveTask, TaskCategory } from '@/lib/tasks';
import { createWissenEntry, saveWissenEntry, WissenCategory } from '@/lib/wissen';
import { toast } from 'sonner';

export function QuickCapture({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'task' | 'wissen'>('task');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>('Sonstiges');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === 'task') {
      const newTask = createTask(title, category as TaskCategory, 10, 'manuell');
      saveTask(newTask);
      toast.success('Aufgabe erstellt');
    } else {
      // Create a basic project entry
      const newEntry = createWissenEntry(
        title,
        'Projekt',
        0,
        [],
        '',
        '',
        'Projekt', // Category
        'Geplant', // Status
        'Mittel'   // Difficulty
      );
      saveWissenEntry(newEntry);
      toast.success('Wissensprojekt erstellt');
    }

    setTitle('');
    setOpen(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="fixed bottom-24 right-6 h-14 w-14 rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all z-40 bg-accent text-accent-foreground">
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schnellerfassung</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Typ</Label>
            <div className="flex gap-2">
              <Button type="button" variant={type === 'task' ? 'default' : 'outline'} onClick={() => setType('task')} className="flex-1">Aufgabe</Button>
              <Button type="button" variant={type === 'wissen' ? 'default' : 'outline'} onClick={() => setType('wissen')} className="flex-1">Wissen</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Titel</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Was möchtest du erfassen?" autoFocus />
          </div>
          {type === 'task' && (
             <div className="space-y-2">
               <Label>Kategorie</Label>
               <Select value={category} onValueChange={setCategory}>
                 <SelectTrigger><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="Haushalt">Haushalt</SelectItem>
                   <SelectItem value="Gesundheit">Gesundheit</SelectItem>
                   <SelectItem value="Routine">Routine</SelectItem>
                   <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                 </SelectContent>
               </Select>
             </div>
          )}
          <Button type="submit" className="w-full">Speichern</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
